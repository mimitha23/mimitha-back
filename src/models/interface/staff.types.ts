import { Model, Document } from "mongoose";

export interface IStaff extends Document {
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

type AvailableStaffRolesT = IStaff["role"][];
export const STAFF_ROLES: AvailableStaffRolesT = ["ADMIN", "MODERATOR"];
