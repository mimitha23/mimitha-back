import { Response } from "express";
import jwt from "jsonwebtoken";
import { NODE_MODE } from "../config/env";
import { ReqUserT } from "../types";
import { promisify } from "util";

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
      _id: payload._id.toString(),
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

  async verifyToken(token: string, refresh?: boolean): Promise<jwt.JwtPayload> {
    try {
      type VerifyFunctionT = (
        token: string,
        secretOrPublicKey: jwt.Secret | jwt.GetPublicKeyOrSecret,
        options?: jwt.VerifyOptions
      ) => Promise<jwt.JwtPayload>;

      const verificator: VerifyFunctionT = promisify(jwt.verify);

      const verifiedToken = await verificator(
        token,
        refresh ? this.refreshSecret : this.accessSecret
      );

      return verifiedToken;
    } catch (error) {
      throw error;
    }
  }
}

export default new JWT();
