import type { Mongoose } from "mongoose";

export interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}
