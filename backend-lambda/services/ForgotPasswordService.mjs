import crypto from "crypto";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { PublishCommand } from "@aws-sdk/client-sns";
import { BaseService } from "./BaseService.mjs";

export class ForgotPasswordService extends BaseService {
  constructor(deps) {
    super(deps);
  }

  /**
   * Handles forgot‑password requests.
   * Expected payload: { phoneNumber: "+91XXXXXXXXXX" }
   * Validates owner identity, enforces 60s cooldown, generates secure 6-digit OTP, stores in DynamoDB, and sends via SMS.
   */
  async handle(event) {
    const corsHeaders = this.getCorsHeaders(event);
    let payload = {};
    if (event.body) {
      const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
      try { payload = JSON.parse(raw); } catch { payload = {}; }
    }
    const phone = payload.phoneNumber;
    if (!phone) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing phoneNumber in request" }) };
    }

    // Verify phone belongs to authorized owner (last 10 digits match)
    const cleanReq = String(phone).replace(/\D/g, "");
    const cleanOwner = String(this.ownerPhone || "919699371940").replace(/\D/g, "");
    if (!cleanReq.endsWith(cleanOwner.slice(-10))) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: "अनधिकृत फोन नंबर / Unauthorized mobile number" })
      };
    }

    // Rate-limit: 60-second cooldown check
    try {
      const existing = await this.ddb.send(new GetCommand({
        TableName: this.tableName,
        Key: { id: `forgot_pw_${cleanReq}` }
      }));
      if (existing.Item?.lastSentAt && Date.now() - existing.Item.lastSentAt < 60000) {
        const waitSecs = Math.ceil((60000 - (Date.now() - existing.Item.lastSentAt)) / 1000);
        return {
          statusCode: 429,
          headers: corsHeaders,
          body: JSON.stringify({ error: `कृपया ${waitSecs} सेकंद प्रतीक्षा करा / Please wait ${waitSecs}s` })
        };
      }
    } catch (err) {
      console.warn("Cooldown check warning:", err);
    }

    // Cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const ttl = Math.floor(Date.now() / 1000) + 600;
    await this.ddb.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        id: `forgot_pw_${cleanReq}`,
        otp,
        ttl,
        lastSentAt: Date.now(),
        createdAt: new Date().toISOString()
      }
    }));

    const message = `Shree Keshar Fabrication: Your password reset code is ${otp}. Valid for 10 minutes.`;
    await this.sns.send(new PublishCommand({
      PhoneNumber: this.ownerPhone || "+919699371940",
      Message: message,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": { DataType: "String", StringValue: "Transactional" }
      }
    }));

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: "OTP sent to your mobile number" }) };
  }
}
