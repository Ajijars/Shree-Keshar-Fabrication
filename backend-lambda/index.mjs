import crypto from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION || "ap-southeast-2";
const TABLE_NAME = process.env.TABLE_NAME || "AdminData";
const BUCKET_NAME = process.env.BUCKET_NAME || "shree-keshar-fabrication-gallery";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "keshar2024";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));
const s3 = new S3Client({ region: REGION });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-key",
  "Content-Type": "application/json"
};

// Cryptographic hash function using PBKDF2 with SHA-512
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

async function getStoredCredentials() {
  try {
    const res = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: "auth_config" }
    }));
    if (res.Item?.hash && res.Item?.salt) {
      return { salt: res.Item.salt, hash: res.Item.hash };
    }
  } catch (err) {
    console.warn("Could not fetch auth_config, using default password:", err);
  }
  // Default fallback salt and hash for keshar2024
  const defaultSalt = "shree_keshar_salt_2024";
  return {
    salt: defaultSalt,
    hash: hashPassword(DEFAULT_PASSWORD, defaultSalt)
  };
}

async function verifyPassword(providedPassword) {
  if (!providedPassword) return false;
  const stored = await getStoredCredentials();
  const computedHash = hashPassword(providedPassword, stored.salt);
  return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(stored.hash));
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod || "GET";
  const rawPath = event.requestContext?.http?.path || event.rawPath || event.path || "/";

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "OK" })
    };
  }

  try {
    // Parse body if present
    let body = {};
    if (event.body) {
      const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
      try {
        body = JSON.parse(raw);
      } catch {
        body = {};
      }
    }

    // 1. PUBLIC GET / (Fetch Website Data)
    if (method === "GET") {
      const getRes = await ddb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: "admin" }
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          data: getRes.Item?.data || null
        })
      };
    }

    // 2. POST /login (Verify Admin Password)
    if (rawPath.includes("/login") || body.action === "login") {
      const isValid = await verifyPassword(body.password);
      if (!isValid) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Invalid password" })
        };
      }
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, message: "Authentication successful" })
      };
    }

    // 3. POST /change-password (Secure Password Update)
    if (rawPath.includes("/change-password") || body.action === "change-password") {
      const isCurrentValid = await verifyPassword(body.currentPassword);
      if (!isCurrentValid) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Current password is incorrect" })
        };
      }

      if (!body.newPassword || body.newPassword.length < 6) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "New password must be at least 6 characters" })
        };
      }

      const newSalt = crypto.randomBytes(16).toString("hex");
      const newHash = hashPassword(body.newPassword, newSalt);

      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: "auth_config",
          salt: newSalt,
          hash: newHash,
          updatedAt: new Date().toISOString()
        }
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, message: "Password updated successfully" })
      };
    }

    // 4. VERIFY AUTH FOR ALL OTHER POST ACTIONS (/upload, /data)
    const reqHeaders = event.headers || {};
    const adminKey = reqHeaders["x-admin-key"] || reqHeaders["X-Admin-Key"] || reqHeaders["authorization"] || reqHeaders["Authorization"];
    const providedKey = adminKey?.replace(/^Bearer\s+/i, "");

    const isAuthorized = await verifyPassword(providedKey);
    if (!isAuthorized) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Unauthorized: Invalid admin key" })
      };
    }

    // 5. POST /upload (Upload Image to S3)
    if (rawPath.includes("/upload") || body.action === "upload") {
      const filename = body.filename || `img_${Date.now()}.jpg`;
      const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `gallery/${Date.now()}_${cleanName}`;
      const contentType = body.contentType || "image/jpeg";

      let fileBuffer;
      if (body.base64Data) {
        const base64Clean = body.base64Data.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
        fileBuffer = Buffer.from(base64Clean, "base64");
      } else {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Missing base64Data in upload request" })
        };
      }

      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType
      }));

      const publicUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          url: publicUrl,
          key
        })
      };
    }

    // 6. POST /data (Save Admin Data)
    if (body.data) {
      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: "admin",
          data: body.data,
          updatedAt: new Date().toISOString()
        }
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, message: "Admin data saved successfully" })
      };
    }

    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid request payload" })
    };

  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || "Internal server error" })
    };
  }
};
