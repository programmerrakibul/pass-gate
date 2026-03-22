export const envConfig = {
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME || "pass-gate",
  SALT_ROUND: Number(process.env.SALT_ROUND) || 10,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
