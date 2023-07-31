import { Schema, model } from "mongoose";
import {
  UserListMethodsT,
  UserListModelT,
  UserListT,
} from "../interface/user/userList.types";

const UserListSchema = new Schema<UserListT, UserListModelT, UserListMethodsT>({
  title: {
    type: String,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "DevelopedProduct",
    },
  ],
});

const UserList = model<UserListT, UserListModelT>("UserList", UserListSchema);
export default UserList;
