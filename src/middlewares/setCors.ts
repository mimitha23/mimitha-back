import cors from "cors";
import { APP_ORIGINS } from "../config/env";

export default function setCors() {
  return cors({
    credentials: true,
    origin(requestOrigin, callback) {
      const notAllowedOriginErrorMessage = `This site ${requestOrigin} does not have an access. Only specific domains are allowed to access it.`;

      if (!requestOrigin) return callback(null, false);

      if (!APP_ORIGINS.includes(requestOrigin))
        return callback(new Error(notAllowedOriginErrorMessage), false);

      return callback(null, true);
    },
  });
}
