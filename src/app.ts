import express from "express";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

import { AppError } from "./lib";
import { NODE_MODE } from "./config/env";
import errorController from "./controllers/errorController";

import { setHeaders, setCors } from "./middlewares";

// Manuals
import manualsRoutes from "./routes/manualsRoutes";

// Auth
import userAuthRoutes from "./routes/Auth/userAuthRoutes";
import staffAuthRoutes from "./routes/Auth/staffAuthRoutes";

// Nav
import navigationRoutes from "./routes/Navigation/navigationRoutes";

// Moderate
import colorRoutes from "./routes/Moderate/colorRoutes";
import variantRoutes from "./routes/Moderate/variantRoutes";
import textureRoutes from "./routes/Moderate/textureRoutes";
import productTypeRoutes from "./routes/Moderate/productTypeRoutes";
import productStylesRoutes from "./routes/Moderate/productStylesRoutes";
import registerProductRoutes from "./routes/Moderate/registerProductRoutes";
import developeProductRoutes from "./routes/Moderate/developeProductRoutes";
import productRoutes from "./routes/productRoutes";
import landingRoutes from "./routes/landingRoutes";

const App = express();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.set("view engine", "pug");
App.set("views", path.join(__dirname, "/views"));

App.use(cookieParser());

App.use(setHeaders);

App.use(setCors());

NODE_MODE === "DEV" && App.use(morgan("dev"));
// ":data[web] :method :url :status :response-time-ms :total-time[digits] - :res[content-length]"

// Manuals
App.use("/api/v1/manuals", manualsRoutes);

// Auth
App.use("/api/v1/auth", userAuthRoutes);
App.use("/api/v1/auth/staff", staffAuthRoutes);

// NAV
App.use("/api/v1/app/navigation/client", navigationRoutes);

// Moderate -> Dashboard
App.use("/api/v1/moderate/color", colorRoutes);
App.use("/api/v1/moderate/texture", textureRoutes);
App.use("/api/v1/moderate/variant", variantRoutes);
App.use("/api/v1/moderate/product-type", productTypeRoutes);
App.use("/api/v1/moderate/product-style", productStylesRoutes);
App.use("/api/v1/moderate/register-product", registerProductRoutes);
App.use("/api/v1/moderate/develope-product", developeProductRoutes);

// Client
App.use("/api/v1/products", productRoutes);
App.use("/api/v1/landing", landingRoutes);

// Views
App.get("/view", (req, res) => {
  res.status(200).render("emails/passwordReset", {
    userName: "Russ",
    url: "/change-password/reset-token",
  });
});

// Fetch unrecognized routes
App.all("*", (req, _, next) => {
  next(new AppError(404, `can't find ${req.originalUrl} on this server`));
});

App.use(errorController);

export default App;
