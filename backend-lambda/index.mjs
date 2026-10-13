import crypto from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { ServiceFactory } from "./services/ServiceFactory.mjs";


const REGION = process.env.AWS_REGION || "ap-southeast-2";
const TABLE_NAME = process.env.TABLE_NAME || "AdminData";
const BUCKET_NAME = process.env.BUCKET_NAME || "shree-keshar-fabrication-gallery";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "keshar2024";
const DEFAULT_RECOVERY_PIN = process.env.RECOVERY_PIN || "969937";
const OWNER_PHONE = process.env.OWNER_PHONE || "+919699371940";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));
const s3 = new S3Client({ region: REGION });
const sns = new SNSClient({ region: REGION });

const ALLOWED_ORIGINS = [
  "https://www.shreekesharfabrication.in",
  "https://shreekesharfabrication.in",
  "https://main.dnhik5dayaggh.amplifyapp.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

function getCorsHeaders(event) {
  const reqHeaders = event?.headers || {};
  const origin = reqHeaders["origin"] || reqHeaders["Origin"] || "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  const allowOrigin = isAllowed ? origin : "https://www.shreekesharfabrication.in";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-key",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "Content-Type": "application/json"
  };
}

// Cryptographic hash function using PBKDF2 with SHA-512 and 100,000 iterations
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

async function getStoredCredentials() {
  try {
    const res = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: "auth_config" }
    }));
    if (res.Item?.hash && res.Item?.salt) {
      return {
        salt: res.Item.salt,
        hash: res.Item.hash,
        recoveryPin: res.Item.recoveryPin || DEFAULT_RECOVERY_PIN,
        iterations: res.Item.iterations || 100000
      };
    }
  } catch (err) {
    console.warn("Could not fetch auth_config from DynamoDB:", err);
  }

  const defaultSalt = "shree_keshar_secure_salt_2024";
  return {
    salt: defaultSalt,
    hash: hashPassword(DEFAULT_PASSWORD, defaultSalt),
    recoveryPin: DEFAULT_RECOVERY_PIN,
    iterations: 100000
  };
}

async function verifyPassword(providedPassword) {
  if (!providedPassword || typeof providedPassword !== "string") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return false;
  }

  const stored = await getStoredCredentials();
  const iterations = stored.iterations || 100000;
  const computedHash = crypto.pbkdf2Sync(providedPassword, stored.salt, iterations, 64, "sha512").toString("hex");

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

export const handler = async (event) => {
  const corsHeaders = getCorsHeaders(event);
  const method = event.requestContext?.http?.method || event.httpMethod || "GET";
  const rawPath = event.requestContext?.http?.path || event.rawPath || event.path || "/";

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "OK" })
    };
  }

  try {
    let body = {};
    if (event.body) {
      const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
      try {
        body = JSON.parse(raw);
      } catch {
        body = {};
      }
    }

    // 1. PUBLIC GET / (Fetch Website Data)
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

    // 2. POST /login (Verify Admin Password)
    if (rawPath.includes("/login") || body.action === "login") {
      const isValid = await verifyPassword(body.password);
      if (!isValid) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Invalid password" })
        };
      }
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, message: "Authentication successful" })
      };
    }

    // 3. POST /send-otp (Send 6-digit OTP to mobile +91 96993 71940 via AWS SNS)
    if (rawPath.includes("/send-otp") || body.action === "send-otp") {
      // Check last sent timestamp to prevent spam (60-second cooldown)
      try {
        const existingOtp = await ddb.send(new GetCommand({
          TableName: TABLE_NAME,
          Key: { id: "otp_verification" }
        }));

        if (existingOtp.Item?.lastSentAt && Date.now() - existingOtp.Item.lastSentAt < 60000) {
          const waitSecs = Math.ceil((60000 - (Date.now() - existingOtp.Item.lastSentAt)) / 1000);
          return {
            statusCode: 429,
            headers: corsHeaders,
            body: JSON.stringify({ error: `कृपया ${waitSecs} सेकंद प्रतीक्षा करा / Please wait ${waitSecs}s before requesting a new OTP` })
          };
        }
      } catch (err) {
        console.warn("Could not check existing OTP rate limit:", err);
      }

      // Generate secure 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpSalt = crypto.randomBytes(16).toString("hex");
      const otpHash = crypto.pbkdf2Sync(otpCode, otpSalt, 10000, 32, "sha256").toString("hex");

      // Save hashed OTP in DynamoDB valid for 10 minutes
      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: "otp_verification",
          hash: otpHash,
          salt: otpSalt,
          phone: OWNER_PHONE,
          expiresAt: Date.now() + 10 * 60 * 1000,
          lastSentAt: Date.now(),
          attempts: 0
        }
      }));

      // Send SMS via AWS SNS
      const smsMessage = `Shree Keshar Fabrication: Your Admin password reset OTP is ${otpCode}. Valid for 10 minutes. Do not share this code with anyone.`;
      
      let messageId = "";
      try {
        const snsRes = await sns.send(new PublishCommand({
          PhoneNumber: OWNER_PHONE,
          Message: smsMessage,
          MessageAttributes: {
            "AWS.SNS.SMS.SMSType": {
              DataType: "String",
              StringValue: "Transactional"
            }
          }
        }));
        messageId = snsRes.MessageId;
      } catch (snsErr) {
        console.error("SNS Publish error:", snsErr);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ error: `SMS पाठवताना त्रुटी: ${snsErr.message || "SNS error"}. पर्यायी म्हणून मास्टर पिन वापरा.` })
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          phone: "+91 96993 71940",
          messageId,
          message: "OTP मोबाइल क्रमांक +91 96993 71940 वर पाठवला आहे! (OTP sent to mobile)"
        })
      };
    }

    // 4. POST /verify-otp-reset (Verify OTP & Reset Password)
    if (rawPath.includes("/verify-otp-reset") || body.action === "verify-otp-reset") {
      const otpRecord = await ddb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: "otp_verification" }
      }));

      if (!otpRecord.Item || !otpRecord.Item.hash || !otpRecord.Item.salt) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "कोणताही सक्रिय OTP आढळला नाही. कृपया प्रथम नवीन OTP मागवा. / No active OTP found" })
        };
      }

      if (Date.now() > (otpRecord.Item.expiresAt || 0)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "OTP कालबाह्य झाला आहे. कृपया नवीन OTP मागवा. / OTP expired" })
        };
      }

      if ((otpRecord.Item.attempts || 0) >= 5) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "अनेक चुकीचे प्रयत्न. कृपया नवीन OTP मागवा. / Too many failed attempts" })
        };
      }

      const providedOtp = String(body.otp || "").trim();
      const computedOtpHash = crypto.pbkdf2Sync(providedOtp, otpRecord.Item.salt, 10000, 32, "sha256").toString("hex");

      const bufA = Buffer.from(computedOtpHash, "hex");
      const bufB = Buffer.from(otpRecord.Item.hash, "hex");

      if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
        await ddb.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            ...otpRecord.Item,
            attempts: (otpRecord.Item.attempts || 0) + 1
          }
        }));
        await new Promise((resolve) => setTimeout(resolve, 800));
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: "चुकीचा OTP! कृपया SMS मध्ये आलेला ६-अंकी OTP पुन्हा तपासा. / Invalid OTP" })
        };
      }

      // Validate new password
      if (!body.newPassword || typeof body.newPassword !== "string" || body.newPassword.length < 8) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "नवीन पासवर्ड किमान ८ अक्षरांचा असावा / Password must be at least 8 characters" })
        };
      }

      const stored = await getStoredCredentials();
      const newSalt = crypto.randomBytes(32).toString("hex");
      const newHash = hashPassword(body.newPassword, newSalt);

      // Save new password
      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: "auth_config",
          salt: newSalt,
          hash: newHash,
          recoveryPin: stored.recoveryPin || DEFAULT_RECOVERY_PIN,
          iterations: 100000,
          updatedAt: new Date().toISOString()
        }
      }));

      // Invalidate the used OTP immediately so it cannot be used again
      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: "otp_verification",
          expiresAt: 0,
          usedAt: new Date().toISOString()
        }
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, message: "पासवर्ड यशस्वीरित्या बदलला! आता नवीन पासवर्डने लॉगिन करा. / Password reset successfully!" })
      };
    }

    // 5. POST /change-password (Secure Password Update while logged in)
    if (rawPath.includes("/change-password") || body.action === "change-password") {
      const isCurrentValid = await verifyPassword(body.currentPassword);
      if (!isCurrentValid) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Current password is incorrect" })
        };
      }

      if (!body.newPassword || typeof body.newPassword !== "string" || body.newPassword.length < 8) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "New password must be at least 8 characters long" })
        };
      }

      const stored = await getStoredCredentials();
      const updatedPin = body.newRecoveryPin || stored.recoveryPin || DEFAULT_RECOVERY_PIN;

      const newSalt = crypto.randomBytes(32).toString("hex");
      const newHash = hashPassword(body.newPassword, newSalt);

      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: "auth_config",
          salt: newSalt,
          hash: newHash,
          recoveryPin: updatedPin,
          iterations: 100000,
          updatedAt: new Date().toISOString()
        }
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, message: "Password updated successfully" })
      };
    }

    // 6. POST /reset-with-pin (Self-service Password Reset via Master Recovery PIN)
    if (rawPath.includes("/reset-with-pin") || body.action === "reset-with-pin") {
      const stored = await getStoredCredentials();
      const validPin = stored.recoveryPin || DEFAULT_RECOVERY_PIN;

      if (!body.recoveryPin || String(body.recoveryPin).trim() !== String(validPin).trim()) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: "चुकीचा रिकव्हरी पिन / Invalid Recovery PIN" })
        };
      }

      if (!body.newPassword || typeof body.newPassword !== "string" || body.newPassword.length < 8) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "नवीन पासवर्ड किमान ८ अक्षरांचा असावा / Password must be at least 8 characters" })
        };
      }

      const newSalt = crypto.randomBytes(32).toString("hex");
      const newHash = hashPassword(body.newPassword, newSalt);

      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: "auth_config",
          salt: newSalt,
          hash: newHash,
          recoveryPin: validPin,
          iterations: 100000,
          updatedAt: new Date().toISOString()
        }
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, message: "पासवर्ड यशस्वीरित्या बदलला! आता नवीन पासवर्डने लॉगिन करा. / Password reset successfully!" })
      };
    }

    // 6.5 POST /forgot-password (PUBLIC — Send OTP to owner mobile for password reset)
    if (rawPath.includes("/forgot-password") || body.action === "forgot-password") {
      // Rate-limit: 60-second cooldown
      try {
        const existingOtp = await ddb.send(new GetCommand({
          TableName: TABLE_NAME,
          Key: { id: "otp_verification" }
        }));
        if (existingOtp.Item?.lastSentAt && Date.now() - existingOtp.Item.lastSentAt < 60000) {
          const waitSecs = Math.ceil((60000 - (Date.now() - existingOtp.Item.lastSentAt)) / 1000);
          return {
            statusCode: 429,
            headers: corsHeaders,
            body: JSON.stringify({ error: `कृपया ${waitSecs} सेकंद प्रतीक्षा करा / Please wait ${waitSecs}s` })
          };
        }
      } catch (err) {
        console.warn("Rate limit check failed:", err);
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpSalt = crypto.randomBytes(16).toString("hex");
      const otpHash = crypto.pbkdf2Sync(otpCode, otpSalt, 10000, 32, "sha256").toString("hex");

      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: "otp_verification",
          hash: otpHash,
          salt: otpSalt,
          phone: OWNER_PHONE,
          expiresAt: Date.now() + 10 * 60 * 1000,
          lastSentAt: Date.now(),
          attempts: 0
        }
      }));

      const smsMessage = `Shree Keshar Fabrication: Your password reset OTP is ${otpCode}. Valid for 10 minutes. Do not share.`;
      try {
        await sns.send(new PublishCommand({
          PhoneNumber: OWNER_PHONE,
          Message: smsMessage,
          MessageAttributes: {
            "AWS.SNS.SMS.SMSType": { DataType: "String", StringValue: "Transactional" }
          }
        }));
      } catch (snsErr) {
        console.error("SNS Publish error:", snsErr);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ error: `SMS पाठवताना त्रुटी: ${snsErr.message || "SNS error"}` })
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          phone: "+91 96993 71940",
          message: "OTP मोबाइल क्रमांक +91 96993 71940 वर पाठवला आहे! (OTP sent to mobile)"
        })
      };
    }

    // 7. VERIFY AUTH FOR ALL OTHER POST ACTIONS (/upload, /data)
    const reqHeaders = event.headers || {};
    const adminKey = reqHeaders["x-admin-key"] || reqHeaders["X-Admin-Key"] || reqHeaders["authorization"] || reqHeaders["Authorization"];
    const providedKey = adminKey?.replace(/^Bearer\s+/i, "");

    const isAuthorized = await verifyPassword(providedKey);
    if (!isAuthorized) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Unauthorized: Invalid admin key" })
      };
    }

    // Delegate to appropriate service based on path
    const service = ServiceFactory.createService(rawPath, {
      ddb,
      s3,
      sns,
      tableName: TABLE_NAME,
      bucketName: BUCKET_NAME,
      region: REGION,
      ownerPhone: OWNER_PHONE
    });
    if (service) {
      return await service.handle(event);
    }

    // If no service matched, return generic bad request
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid request payload" })
    };

  } catch (error) {
    console.error("Handler error:", error);
    const corsHeaders = getCorsHeaders(event);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
