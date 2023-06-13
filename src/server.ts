import { PORT, DB_APP_CONNECTION, APP_ORIGINS } from "./config/env";
import mongoose from "mongoose";
import { createServer } from "http";
import App from "./app";
import { Server } from "socket.io";

const SERVER = createServer(App);

const io = new Server(SERVER, {
  allowEIO3: true,
  cors: { origin: APP_ORIGINS, credentials: true },
});

App.set("socket", io);

process.on("uncaughtException", (err) => {
  console.log("uncaughtException ! process is exited with status code 1", err);
  process.exit(1);
});

mongoose.set("strictQuery", false);
mongoose
  .connect(DB_APP_CONNECTION)
  .then(() => {
    console.log(`DB Is Connected Successfully ✔`);
    SERVER.listen(PORT, () => {
      console.log(`App Listens On Port ${PORT} 👀`);
    });
  })
  .catch((err) => {
    process.on("unhandledRejection", (err: Error) => {
      console.log(
        "Unhandled Rejection, server is closed >",
        err.message,
        "with status code 1"
      );
      SERVER.close(() => process.exit(1));
    });
  });
