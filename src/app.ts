import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

import { AppError } from "./lib";
import { APP_ORIGINS, NODE_MODE } from "./config/env";
import errorController from "./controllers/errorController";

import authRoutes from "./routes/Auth/authRotes";

const App = express();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.set("view engine", "pug");
App.set("views", path.join(__dirname, "/views"));

App.use(cookieParser());

App.use(function (req, res, next) {
  res.header("Access-Control-Allow-credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Origin, Authorization"
  );

  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

App.use(
  cors({
    credentials: true,
    origin(requestOrigin, callback) {
      const notAllowedOriginErrorMessage = `This site ${requestOrigin} does not have an access. Only specific domains are allowed to access it.`;

      if (!requestOrigin) return callback(null, false);

      if (!APP_ORIGINS.includes(requestOrigin))
        return callback(new Error(notAllowedOriginErrorMessage), false);

      return callback(null, true);
    },
  })
);

NODE_MODE === "DEV" && App.use(morgan("dev"));

App.use("/api/v1/auth", authRoutes);

App.get("/view", (req, res) => {
  res.status(200).render("emails/passwordReset", {
    userName: "Russ",
    url: "/change-password/reset-token",
  });
});

App.all("*", (req, _, next) => {
  next(new AppError(404, `can't find ${req.originalUrl} on this server`));
});

App.use(errorController);

export default App;
