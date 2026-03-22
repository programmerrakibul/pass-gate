import { envConfig } from "@/lib/envConfig";
import bcrypt from "bcryptjs";
import { model, models, Schema } from "mongoose";

import type { TUserDocument } from "@/types/user.type";

const userSchema = new Schema<TUserDocument>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    photoURL: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLoggedIn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre<TUserDocument>("save", async function () {
  if (this.isModified("password")) {
    const hashed = await bcrypt.hash(this.password, envConfig.SALT_ROUND);
    this.password = hashed;
  }
});

const User = models.User || model("User", userSchema);

export default User;
