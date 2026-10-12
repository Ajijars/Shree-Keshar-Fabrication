import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION || "ap-southeast-2";
const TABLE_NAME = process.env.TABLE_NAME || "AdminData";
const BUCKET_NAME = process.env.BUCKET_NAME || "shree-keshar-fabrication-gallery";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "keshar2024";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));
const s3 = new S3Client({ region: REGION });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-key",
  "Content-Type": "application/json"
};

export const handler = async (event) => {
  // Handle HTTP method from Lambda Function URL or API Gateway
  const method = event.requestContext?.http?.method || event.httpMethod || "GET";
  const path = event.requestContext?.http?.path || event.rawPath || event.path || "/";

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "OK" })
    };
  }

  try {
    // 1. GET DATA
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

    // 2. CHECK ADMIN AUTH FOR WRITE/UPLOAD
    const reqHeaders = event.headers || {};
    const adminKey = reqHeaders["x-admin-key"] || reqHeaders["X-Admin-Key"] || reqHeaders["authorization"] || reqHeaders["Authorization"];
    const providedKey = adminKey?.replace(/^Bearer\s+/i, "");

    if (providedKey !== ADMIN_PASSWORD) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Unauthorized: Invalid admin key" })
      };
    }

    // Parse JSON body
    let body = {};
    if (event.body) {
      const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
      body = JSON.parse(raw);
    }

    // 3. POST /upload (Upload image to S3)
    if (path.includes("/upload") || body.action === "upload") {
      const filename = body.filename || `img_${Date.now()}.jpg`;
      const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `gallery/${Date.now()}_${cleanName}`;
      const contentType = body.contentType || "image/jpeg";

      let fileBuffer;
      if (body.base64Data) {
        // Strip data:image/...;base64, prefix if present
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

    // 4. POST /data (Save Admin Data)
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
