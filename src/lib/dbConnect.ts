import { envConfig } from "./envConfig";
import type { MongooseCache } from "@/types";
import mongoose, { type ConnectOptions } from "mongoose";

declare global {
  var mongooseCache: MongooseCache; // This must be a `var` and not a `let / const`
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const dbConnect = async () => {
  const MONGO_URI = envConfig.MONGO_URI;

  if (!MONGO_URI?.trim()) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local",
    );
  }

  if (cached.conn) {
    console.log("📦 Using existing MongoDB connection");

    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Creating new MongoDB connection...");

    const opts: ConnectOptions = {
      dbName: envConfig.DB_NAME,
      serverApi: { version: "1", strict: true, deprecationErrors: true },
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default dbConnect;
