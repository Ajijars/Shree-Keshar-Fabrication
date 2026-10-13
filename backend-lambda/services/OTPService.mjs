import crypto from "crypto";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export default class OTPService {
  constructor(ddb, tableName, ownerPhone, cooldownMs = 60000, otpValidityMs = 10 * 60 * 1000) {
    this.ddb = ddb;
    this.tableName = tableName;
    this.ownerPhone = ownerPhone;
    this.cooldownMs = cooldownMs;
    this.otpValidityMs = otpValidityMs;
  }

  async canSendOtp() {
    try {
      const res = await this.ddb.send(new GetCommand({
        TableName: this.tableName,
        Key: { id: "otp_verification" }
      }));
      const lastSent = res.Item?.lastSentAt;
      if (lastSent && Date.now() - lastSent < this.cooldownMs) {
        return { allowed: false, waitSecs: Math.ceil((this.cooldownMs - (Date.now() - lastSent)) / 1000) };
      }
    } catch (err) {
      console.warn("OTP rate limit check failed:", err);
    }
    return { allowed: true };
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async storeOtp(otpCode, hash, salt) {
    await this.ddb.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        id: "otp_verification",
        hash,
        salt,
        phone: this.ownerPhone,
        expiresAt: Date.now() + this.otpValidityMs,
        lastSentAt: Date.now(),
        attempts: 0
      }
    }));
  }

  async verifyOtp(providedOtp) {
    const otpRecord = await this.ddb.send(new GetCommand({
      TableName: this.tableName,
      Key: { id: "otp_verification" }
    }));
    if (!otpRecord.Item?.hash || !otpRecord.Item?.salt) {
      return { valid: false, error: "No active OTP found" };
    }
    if (Date.now() > (otpRecord.Item.expiresAt || 0)) {
      return { valid: false, error: "OTP expired" };
    }
    if ((otpRecord.Item.attempts || 0) >= 5) {
      return { valid: false, error: "Too many attempts" };
    }
    const computedHash = crypto.pbkdf2Sync(providedOtp, otpRecord.Item.salt, 10000, 32, "sha256").toString("hex");
    const bufA = Buffer.from(computedHash, "hex");
    const bufB = Buffer.from(otpRecord.Item.hash, "hex");
    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      await this.ddb.send(new PutCommand({
        TableName: this.tableName,
        Item: { ...otpRecord.Item, attempts: (otpRecord.Item.attempts || 0) + 1 }
      }));
      await new Promise(r => setTimeout(r, 800));
      return { valid: false, error: "Invalid OTP" };
    }
    // Invalidate OTP after successful verification
    await this.ddb.send(new PutCommand({
      TableName: this.tableName,
      Item: { id: "otp_verification", expiresAt: 0, usedAt: new Date().toISOString() }
    }));
    return { valid: true };
  }
}
