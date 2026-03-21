export const envConfig = {
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME || "pass-gate",
  SALT_ROUND: Number(process.env.SALT_ROUND) || 10,
};
