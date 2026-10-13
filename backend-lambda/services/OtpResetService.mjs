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
    // Fetch stored OTP
    const getRes = await this.ddb.send(new GetCommand({ TableName: this.tableName, Key: { id: `forgot_pw_${phoneNumber}` } }));
    if (!getRes.Item || getRes.Item.otp !== otp) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Invalid or expired OTP" }) };
    }
    // Delete the OTP entry
    await this.ddb.send(new DeleteCommand({ TableName: this.tableName, Key: { id: `forgot_pw_${phoneNumber}` } }));
    // Update password via AuthManager (reuse its hash logic)
    const authMgr = new (await import("./AuthManager.mjs")).default(this.ddb, this.tableName, null, null);
    await authMgr.updatePassword(newPassword);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: "Password reset successful" }) };
  }
}
