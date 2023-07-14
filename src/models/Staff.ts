import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import UserUtils from "../utils/UserUtils/UserUtils";
import { IStaff, IStaffMethods, StaffModelT } from "./interface/staff.types";

const StaffSchema = new Schema<IStaff, StaffModelT, IStaffMethods>(
  {
    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "MODERATOR"],
      required: true,
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

StaffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

StaffSchema.methods.checkPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};

StaffSchema.methods.createPasswordResetToken =
  async function (): Promise<string> {
    const { hashedToken, resetToken } = UserUtils.generatePasswordResetToken();

    this.passwordResetToken = hashedToken;
    this.passwordResetAt = Date.now() + 1000 * 60 * 10; // 10 minutes

    await this.save();

    return resetToken || "";
  };

const Staff = model<IStaff, StaffModelT>("Staff", StaffSchema);

export default Staff;
