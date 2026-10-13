import crypto from "crypto";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export default class AuthManager {
  constructor(ddb, tableName, defaultPassword, defaultRecoveryPin) {
    this.ddb = ddb;
    this.tableName = tableName;
    this.defaultPassword = defaultPassword;
    this.defaultRecoveryPin = defaultRecoveryPin;
    this.defaultSalt = "shree_keshar_secure_salt_2024";
    this.iterations = 100000;
  }

  hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, this.iterations, 64, "sha512").toString("hex");
  }

  async getStoredCredentials() {
    try {
      const res = await this.ddb.send(new GetCommand({
        TableName: this.tableName,
        Key: { id: "auth_config" }
      }));
      if (res.Item?.hash && res.Item?.salt) {
        return {
          salt: res.Item.salt,
          hash: res.Item.hash,
          recoveryPin: res.Item.recoveryPin || this.defaultRecoveryPin,
          iterations: res.Item.iterations || this.iterations
        };
      }
    } catch (err) {
      console.warn("Could not fetch auth_config from DynamoDB:", err);
    }
    // fallback to default credentials
    return {
      salt: this.defaultSalt,
      hash: this.hashPassword(this.defaultPassword, this.defaultSalt),
      recoveryPin: this.defaultRecoveryPin,
      iterations: this.iterations
    };
  }

  async verifyPassword(providedPassword) {
    if (!providedPassword || typeof providedPassword !== "string") {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return false;
    }
    const stored = await this.getStoredCredentials();
    const computedHash = this.hashPassword(providedPassword, stored.salt);
    const bufA = Buffer.from(computedHash, "hex");
    const bufB = Buffer.from(stored.hash, "hex");
    if (bufA.length !== bufB.length) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return false;
    }
    const isValid = crypto.timingSafeEqual(bufA, bufB);
    if (!isValid) {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    return isValid;
  }

  async updatePassword(newPassword, newRecoveryPin = null) {
    const newSalt = crypto.randomBytes(32).toString("hex");
    const newHash = this.hashPassword(newPassword, newSalt);
    const stored = await this.getStoredCredentials();
    await this.ddb.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        id: "auth_config",
        salt: newSalt,
        hash: newHash,
        recoveryPin: newRecoveryPin || stored.recoveryPin || this.defaultRecoveryPin,
        iterations: this.iterations,
        updatedAt: new Date().toISOString()
      }
    }));
  }

  async resetWithPin(providedPin, newPassword) {
    const stored = await this.getStoredCredentials();
    const validPin = stored.recoveryPin || this.defaultRecoveryPin;
    if (String(providedPin).trim() !== String(validPin).trim()) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: false, error: "Invalid Recovery PIN" };
    }
    await this.updatePassword(newPassword, validPin);
    return { success: true };
  }
}
