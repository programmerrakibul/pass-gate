import type { Mongoose } from "mongoose";

export interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

export type TApiResponse<T = unknown> =
  | {
      success: true;
      message: string;
      data?: T | T[];
      ACCESS_TOKEN?: string;
      VERIFICATION_TOKEN?: string;
    }
  | { success: false; message: string };
