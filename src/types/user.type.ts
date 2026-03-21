import { Document } from "mongoose";
import type { TCreateUser } from "@/validators/user.validator";

export type TUser = TCreateUser &
  TCreateUser & {
    lastLoggedIn: Date;
  };

export interface TUserDocument extends TUser, Document {}
