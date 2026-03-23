import { Document } from "mongoose";
import type { TCreateUser } from "@/validators/user.validator";

export interface TUserDocument extends TCreateUser, Document {
  lastLoggedIn: Date;
  isVerified: boolean;
}
