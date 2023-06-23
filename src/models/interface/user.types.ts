import { Model } from "mongoose";

export interface IUser {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  authByGoogle: boolean;
  password: string;
  passwordResetToken?: string;
  passwordResetAt?: Date;
  createdAt: string;
  updatedAt: string;
  role: "USER";
}

export interface IUserMethods {
  checkPassword: (
    candidatePassword: string,
    password: string
  ) => Promise<boolean>;
  createPasswordResetToken: () => Promise<string>;
}

export type UserModelT = Model<IUser, {}, IUserMethods>;

export const USER_WHITE_LIST = ["_id", "fullname", "username", "email"];
export interface USER_TO_CLIENT_T {
  _id: IUser["_id"];
  fullname: IUser["fullname"];
  username: IUser["username"];
  email: IUser["email"];
  role: string;
}
