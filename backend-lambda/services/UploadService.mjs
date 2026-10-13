import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BaseService } from "./BaseService.mjs";

export class UploadService extends BaseService {
  constructor({ ddb, s3, sns, tableName, bucketName, region, ownerPhone }) {
    super({ ddb, s3, sns, tableName, bucketName, region, ownerPhone });
  }

  async handle(event) {
    const corsHeaders = this.getCorsHeaders(event);
    let payload = {};
    if (event.body) {
      const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
      try { payload = JSON.parse(raw); } catch { payload = {}; }
    }
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const contentType = allowedMimes.includes(payload.contentType) ? payload.contentType : "image/jpeg";
    if (!payload.base64Data) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing base64Data in upload request" }) };
    }
    const base64Clean = payload.base64Data.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
    const fileBuffer = Buffer.from(base64Clean, "base64");
    if (fileBuffer.length > 8 * 1024 * 1024) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "File exceeds 8MB size limit" }) };
    }
    const filename = (payload.filename || `img_${Date.now()}.jpg`).replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `gallery/${Date.now()}_${filename}`;
    await this.s3.send(new PutObjectCommand({ Bucket: this.bucketName, Key: key, Body: fileBuffer, ContentType: contentType }));
    const publicUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, url: publicUrl, key }) };
  }
}
