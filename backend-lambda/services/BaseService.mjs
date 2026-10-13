export class BaseService {
  constructor({ ddb, s3, sns, tableName, bucketName, region, ownerPhone }) {
    this.ddb = ddb;
    this.s3 = s3;
    this.sns = sns;
    this.tableName = tableName;
    this.bucketName = bucketName;
    this.region = region;
    this.ownerPhone = ownerPhone;
  }

  getCorsHeaders(event) {
    const reqHeaders = event?.headers || {};
    const origin = reqHeaders["origin"] || reqHeaders["Origin"] || "";
    const allowedOrigins = [
      "https://www.shreekesharfabrication.in",
      "https://shreekesharfabrication.in",
      "https://main.dnhik5dayaggh.amplifyapp.com",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    const allowOrigin = allowedOrigins.includes(origin) ? origin : "https://www.shreekesharfabrication.in";
    return {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-key",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
      "Content-Type": "application/json",
      "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';"
    };
  }
}
