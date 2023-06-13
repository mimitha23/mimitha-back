import { Response } from "express";
import jwt from "jsonwebtoken";
import { NODE_MODE } from "../config/env";
import { ReqUserT } from "../types";

class JWT {
  private accessSecret;
  private refreshSecret;
  nodeMode;
  expiresIn;

  constructor() {
    this.accessSecret = process.env.JWT_SECRET || "";
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || "";
    this.nodeMode = process.env.NODE_MODE;
    this.expiresIn = "1h";
  }

  asignToken({ payload, res }: { payload: ReqUserT; res: Response }): {
    accessToken: string;
  } {
    const accessTokenPayload: ReqUserT = {
      _id: payload._id,
      email: payload.email,
      username: payload.username,
    };

    const accessToken = jwt.sign(accessTokenPayload, this.accessSecret, {
      expiresIn: this.expiresIn,
    });

    const refreshToken = jwt.sign(accessTokenPayload, this.refreshSecret);

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: false,
    };

    if (NODE_MODE === "PROD") cookieOptions.secure = true;

    res.cookie("authorization", refreshToken, cookieOptions);

    return { accessToken };
  }

  verifyToken() {}
}

export default new JWT();
