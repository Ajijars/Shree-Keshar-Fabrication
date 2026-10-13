import crypto from "crypto";
import { GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { BaseService } from "./BaseService.mjs";

export class OtpResetService extends BaseService {
  constructor(deps) {
    super(deps);
  }

  /**
   * Verify OTP and reset password.
   * Expected payload: { phoneNumber: "+91...", otp: "123456", newPassword: "..." }
   */
  async handle(event) {
    const corsHeaders = this.getCorsHeaders(event);
    let payload = {};
    if (event.body) {
      const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
      try { payload = JSON.parse(raw); } catch { payload = {}; }
    }
    const { phoneNumber, otp, newPassword } = payload;
    if (!phoneNumber || !otp || !newPassword) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing fields" }) };
    }

    // Verify phone belongs to authorized owner
    const cleanReq = String(phoneNumber).replace(/\D/g, "");
    const cleanOwner = String(this.ownerPhone || "919699371940").replace(/\D/g, "");
    if (!cleanReq.endsWith(cleanOwner.slice(-10))) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: "अनधिकृत फोन नंबर / Unauthorized mobile number" })
      };
    }

    // Validate new password length
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "नवीन पासवर्ड किमान ८ अक्षरांचा असावा / Password must be at least 8 characters" })
      };
    }

    // Fetch stored OTP
    const getRes = await this.ddb.send(new GetCommand({ TableName: this.tableName, Key: { id: `forgot_pw_${cleanReq}` } }));
    if (!getRes.Item || !getRes.Item.otp) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Invalid or expired OTP" }) };
    }

    // Check TTL
    if (getRes.Item.ttl && Math.floor(Date.now() / 1000) > getRes.Item.ttl) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "OTP expired. Please request a new OTP." }) };
    }

    // Constant-time OTP check
    const bufA = Buffer.from(String(getRes.Item.otp).trim());
    const bufB = Buffer.from(String(otp).trim());
    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      await new Promise((r) => setTimeout(r, 800));
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Invalid OTP" }) };
    }

    // Delete the OTP entry so it cannot be re-used
    await this.ddb.send(new DeleteCommand({ TableName: this.tableName, Key: { id: `forgot_pw_${cleanReq}` } }));

    // Update password via AuthManager
    const authMgr = new (await import("./AuthManager.mjs")).default(this.ddb, this.tableName, null, null);
    await authMgr.updatePassword(newPassword);

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: "Password reset successful" }) };
  }
}
