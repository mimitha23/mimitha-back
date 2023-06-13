import { Async } from "../lib";
import { ReqUserT } from "../types";

export const checkAuth = Async(async function (req, res, next) {
  req.user = <ReqUserT>{
    _id: "",
    email: "",
    username: "",
  };

  next();
});
