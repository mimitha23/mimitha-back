import mongoose, { Model } from "mongoose";

export interface UserListT {
  title: string;
  user: mongoose.Types.ObjectId;
  products: [mongoose.Types.ObjectId];
}

export interface UserListMethodsT {}

export type UserListModelT = Model<UserListT, {}, UserListMethodsT>;
