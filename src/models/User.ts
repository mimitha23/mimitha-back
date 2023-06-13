import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import UserUtils from "../utils/UserUtils/UserUtils";
import { IUser, IUserMethods, UserModelT } from "./interface/user.types";

const UserSchema = new Schema<IUser, UserModelT, IUserMethods>(
  {
    fullname: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: true,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    authByGoogle: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetAt: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.checkPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};

UserSchema.methods.createPasswordResetToken =
  async function (): Promise<string> {
    const { hashedToken, resetToken } = UserUtils.generatePasswordResetToken();

    this.passwordResetToken = hashedToken;
    this.passwordResetAt = Date.now() + 1000 * 60 * 10; // 10 minutes

    await this.save();

    return resetToken || "";
  };

const User = model<IUser, UserModelT>("User", UserSchema);

export default User;
