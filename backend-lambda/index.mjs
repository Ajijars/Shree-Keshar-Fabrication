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

const ALLOWED_ORIGINS = [
  "https://www.shreekesharfabrication.in",
  "https://shreekesharfabrication.in",
  "https://main.dnhik5dayaggh.amplifyapp.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

function getCorsHeaders(event) {
  const reqHeaders = event?.headers || {};
  const origin = reqHeaders["origin"] || reqHeaders["Origin"] || "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  const allowOrigin = isAllowed ? origin : "https://www.shreekesharfabrication.in";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-key",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "Content-Type": "application/json"
  };
}

// Cryptographic hash function using PBKDF2 with SHA-512 and 100,000 iterations
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

async function getStoredCredentials() {
  try {
    const res = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: "auth_config" }
    }));
    if (res.Item?.hash && res.Item?.salt) {
      return { salt: res.Item.salt, hash: res.Item.hash, iterations: res.Item.iterations || 100000 };
    }
  } catch (err) {
    console.warn("Could not fetch auth_config from DynamoDB:", err);
  }

  // Default fallback credentials if no custom password has been initialized
  const defaultSalt = "shree_keshar_secure_salt_2024";
  return {
    salt: defaultSalt,
    hash: hashPassword(DEFAULT_PASSWORD, defaultSalt),
    iterations: 100000
  };
}

async function verifyPassword(providedPassword) {
  if (!providedPassword || typeof providedPassword !== "string") {
    // Artificial cooldown to mitigate brute force
    await new Promise((resolve) => setTimeout(resolve, 800));
    return false;
  }

  const stored = await getStoredCredentials();
  const iterations = stored.iterations || 100000;
  const computedHash = crypto.pbkdf2Sync(providedPassword, stored.salt, iterations, 64, "sha512").toString("hex");

  const bufA = Buffer.from(computedHash, "hex");
  const bufB = Buffer.from(stored.hash, "hex");

  if (bufA.length !== bufB.length) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return false;
  }

  const isValid = crypto.timingSafeEqual(bufA, bufB);

  // If password verification fails, enforce an 800ms throttle to prevent brute-force attacks
  if (!isValid) {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  return isValid;
}

export const handler = async (event) => {
  const corsHeaders = getCorsHeaders(event);
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
    // Parse body safely
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

      if (!body.newPassword || typeof body.newPassword !== "string" || body.newPassword.length < 8) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "New password must be at least 8 characters long" })
        };
      }

      const newSalt = crypto.randomBytes(32).toString("hex");
      const newHash = hashPassword(body.newPassword, newSalt);

      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: "auth_config",
          salt: newSalt,
          hash: newHash,
          iterations: 100000,
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
      const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      const contentType = allowedMimes.includes(body.contentType) ? body.contentType : "image/jpeg";

      let fileBuffer;
      if (body.base64Data && typeof body.base64Data === "string") {
        const base64Clean = body.base64Data.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
        fileBuffer = Buffer.from(base64Clean, "base64");
      } else {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Missing base64Data in upload request" })
        };
      }

      // Enforce 8MB max upload size
      if (fileBuffer.length > 8 * 1024 * 1024) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "File exceeds 8MB size limit" })
        };
      }

      const filename = (body.filename || `img_${Date.now()}.jpg`).replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `gallery/${Date.now()}_${filename}`;

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
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
