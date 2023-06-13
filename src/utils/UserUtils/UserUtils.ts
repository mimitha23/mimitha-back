import {
  IUser,
  USER_TO_CLIENT_T,
  USER_WHITE_LIST,
} from "../../models/interface/user.types";
import crypto from "crypto";

class UserUtils {
  generateUserToClientData(user: IUser): USER_TO_CLIENT_T {
    const userData: USER_TO_CLIENT_T = {
      _id: "",
      email: "",
      fullname: "",
      username: "",
    };

    USER_WHITE_LIST.forEach((key) => {
      userData[key as keyof typeof userData] =
        user[key as keyof typeof userData];
    });

    return userData;
  }

  generatePasswordResetToken(token?: string): {
    hashedToken: string;
    resetToken?: string;
  } {
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(token ? token : resetToken)
      .digest("hex");

    return { hashedToken, resetToken };
  }
}

export default new UserUtils();
