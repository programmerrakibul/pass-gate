import { envConfig } from "@/lib/envConfig";
import bcrypt from "bcryptjs";
import { model, models, Schema } from "mongoose";

import type { TUserDocument } from "@/types/user.types";

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
      toLowerCase: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      select: false,
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

// Hash password before saving
userSchema.pre<TUserDocument>("save", async function () {
  if (this.isModified("password")) {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(envConfig.SALT_ROUND);
    const hashed = await bcrypt.hash(this.password, salt);

    this.password = hashed;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = models.User || model("User", userSchema);

export default User;
