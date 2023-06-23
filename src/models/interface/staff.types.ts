import { Model } from "mongoose";

export interface IStaff {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  passwordResetToken?: string;
  passwordResetAt?: Date;
  createdAt: string;
  updatedAt: string;
  role: "ADMIN" | "MODERATOR";
}

export interface IStaffMethods {
  checkPassword: (
    candidatePassword: string,
    password: string
  ) => Promise<boolean>;
  createPasswordResetToken: () => Promise<string>;
}

export type StaffModelT = Model<IStaff, {}, IStaffMethods>;
