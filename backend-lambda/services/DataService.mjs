import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { BaseService } from "./BaseService.mjs";

export class DataService extends BaseService {
  constructor({ ddb, tableName }) {
    super({ ddb, s3: null, sns: null, tableName, bucketName: null, region: null, ownerPhone: null });
  }

  async handle(event) {
    const corsHeaders = this.getCorsHeaders(event);
    let payload = {};
    if (event.body) {
      const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
      try { payload = JSON.parse(raw); } catch { payload = {}; }
    }
    if (!payload.data) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing admin data payload" }) };
    }
    await this.ddb.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        id: "admin",
        data: payload.data,
        updatedAt: new Date().toISOString()
      }
    }));
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: "Admin data saved successfully" }) };
  }
}
