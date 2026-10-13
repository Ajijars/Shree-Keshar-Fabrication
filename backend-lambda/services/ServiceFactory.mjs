import AuthManager from "./AuthManager.mjs";
import OTPService from "./OTPService.mjs";
import { UploadService } from "./UploadService.mjs";
import { DataService } from "./DataService.mjs";
import { ForgotPasswordService } from "./ForgotPasswordService.mjs";
import { OtpResetService } from "./OtpResetService.mjs";

export class ServiceFactory {
  /**
   * Create a service instance for the given request path.
   * Uses the Factory Pattern (OOP) to route requests to the correct service.
   * @param {string} rawPath - The normalized request path (e.g. "/login").
   * @param {object} deps - Dependency object containing ddb, s3, sns, etc.
   * @returns {object|null} An instance with a `handle(event)` method or null.
   */
  static createService(rawPath, deps) {
    if (rawPath.includes("/login")) {
      return new AuthManager(deps.ddb, deps.tableName, null, null);
    }
    if (rawPath.includes("/send-otp")) {
      return new OTPService(deps.ddb, deps.tableName, deps.ownerPhone);
    }
    if (rawPath.includes("/upload")) {
      return new UploadService(deps);
    }
    if (rawPath.includes("/data")) {
      return new DataService(deps);
    }
    if (rawPath.includes("/forgot-password")) {
      return new ForgotPasswordService(deps);
    }
    if (rawPath.includes("/verify-otp-reset-v2")) {
      return new OtpResetService(deps);
    }
    // fallback for other auth-protected actions (change-password, reset-with-pin, verify-otp-reset)
    if (["/verify-otp-reset", "/change-password", "/reset-with-pin"].some(p => rawPath.includes(p))) {
      return new AuthManager(deps.ddb, deps.tableName, null, null);
    }
    return null;
  }
}
