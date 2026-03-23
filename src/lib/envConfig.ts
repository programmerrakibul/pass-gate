export const envConfig = {
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME || "pass-gate",
  SALT_ROUND: Number(process.env.SALT_ROUND) || 10,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  VERIFICATION_TOKEN_SECRET: process.env.VERIFICATION_TOKEN_SECRET,
  GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
