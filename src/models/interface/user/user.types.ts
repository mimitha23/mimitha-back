import { Model, Document, Schema } from "mongoose";

export interface IUser extends Document {
  role: "USER";
  _id: string;
  fullname: string;
  username: string;
  email: string;
  profilePicture: string;
  favorites: [Schema.Types.ObjectId];
  authByGoogle: boolean;
  password: string;
  confirmEmailPin?: string;
  emailPinResetAt?: Date;
  passwordResetToken?: string;
  passwordResetAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface IUserMethods {
  checkPassword: (
    candidatePassword: string,
    password: string
  ) => Promise<boolean>;
  createPasswordResetToken: () => Promise<string>;
  createConfirmEmailPin: () => Promise<string>;
}

export type UserModelT = Model<IUser, {}, IUserMethods>;

export const USER_WHITE_LIST = [
  "_id",
  "fullname",
  "username",
  "email",
  "profilePicture",
];

export interface USER_TO_CLIENT_T {
  _id: IUser["_id"];
  fullname: IUser["fullname"];
  username: IUser["username"];
  email: IUser["email"];
  profilePicture: IUser["profilePicture"];
}

type AvailableUserRolesT = IUser["role"][];

export const USER_ROLES: AvailableUserRolesT = ["USER"];
