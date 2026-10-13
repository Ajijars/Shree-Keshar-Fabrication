import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { PublishCommand } from "@aws-sdk/client-sns";
import { BaseService } from "./BaseService.mjs";

export class ForgotPasswordService extends BaseService {
  constructor(deps) {
    super(deps);
  }

  /**
   * Handles forgot‑password requests.
   * Expected payload: { phoneNumber: "+91XXXXXXXXXX" }
   * Generates a 6‑digit OTP, stores it in DynamoDB (TTL 10 min), and sends via SMS.
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = Math.floor(Date.now() / 1000) + 600;
    await this.ddb.send(new PutCommand({
      TableName: this.tableName,
      Item: { id: `forgot_pw_${phone}`, otp, ttl, createdAt: new Date().toISOString() }
    }));
    const message = `Your Shree Keshar Fabrication password reset code is ${otp}. It expires in 10 minutes.`;
    await this.sns.send(new PublishCommand({ PhoneNumber: phone, Message: message }));
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: "OTP sent to your mobile number" }) };
  }
}
