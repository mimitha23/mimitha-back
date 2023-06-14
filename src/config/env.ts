import dotenv from "dotenv";

dotenv.config();

// MODE
type NODE_MODE_T = "DEV" | "PROD";
const NODE_MODE = (process.env.NODE_MODE || "DEV") as NODE_MODE_T;

// PORT
const PORT = process.env.PORT || 4000;

// DB CONNECTION
const DB_PROD_APP_CONNECTION = process.env.DB_PROD_APP_CONNECTION || "";
const DB_PROD_USER_PASSWORD = process.env.DB_PROD_USER_PASSWORD || "";

const DB_DEV_APP_CONNECTION = process.env.DB_DEV_APP_CONNECTION || "";
const DB_DEV_USER_PASSWORD = process.env.DB_DEV_USER_PASSWORD || "";

const DB_APP_CONNECTION = generateAppConnection();

// ORIGIN SERVER
const DEV_SERVER_ORIGIN = process.env.DEV_SERVER_ORIGIN || "";
const PROD_SERVER_ORIGIN = process.env.PROD_SERVER_ORIGIN || "";

const SERVER_ORIGIN = generateOrigin("SERVER");

// ORIGIN APP
const DEV_APP_ORIGIN = process.env.DEV_APP_ORIGIN || "";
const PROD_APP_ORIGIN = process.env.PROD_APP_ORIGIN || "";

const APP_ORIGIN = generateOrigin("APP");

// ORIGIN DASHBOARD
const DEV_DASHBOARD_ORIGIN = process.env.DEV_DASHBOARD_ORIGIN || "";
const PROD_DASHBOARD_ORIGIN = process.env.PROD_DASHBOARD_ORIGIN || "";

const DASHBOARD_ORIGIN = generateOrigin("DASHBOARD");

// APP ORIGINS
const APP_ORIGINS = generateAppOrigins();

// EMAIL
const DEV_EMAIL_HOST = process.env.DEV_EMAIL_HOST || "";
const DEV_EMAIL_PORT = process.env.DEV_EMAIL_PORT || "";
const DEV_EMAIL_SERVICE = process.env.DEV_EMAIL_SERVICE || "";
const DEV_EMAIL_USER = process.env.DEV_EMAIL_USER || "";
const DEV_EMAIL_PASSWORD = process.env.DEV_EMAIL_PASSWORD || "";

const PROD_EMAIL_HOST = process.env.PROD_EMAIL_HOST || "";
const PROD_EMAIL_PORT = process.env.PROD_EMAIL_PORT || "";
const PROD_EMAIL_SERVICE = process.env.PROD_EMAIL_SERVICE || "";
const PROD_EMAIL_USER = process.env.PROD_EMAIL_USER || "";
const PROD_EMAIL_PASSWORD = process.env.PROD_EMAIL_PASSWORD || "";

const EMAIL_HOST = NODE_MODE === "DEV" ? DEV_EMAIL_HOST : PROD_EMAIL_HOST;
const EMAIL_PORT = NODE_MODE === "DEV" ? DEV_EMAIL_PORT : PROD_EMAIL_PORT;
const EMAIL_SERVICE =
  NODE_MODE === "DEV" ? DEV_EMAIL_SERVICE : PROD_EMAIL_SERVICE;
const EMAIL_USER = NODE_MODE === "DEV" ? DEV_EMAIL_USER : PROD_EMAIL_USER;
const EMAIL_PASSWORD =
  NODE_MODE === "DEV" ? DEV_EMAIL_PASSWORD : PROD_EMAIL_PASSWORD;

export {
  NODE_MODE,
  PORT,
  DB_APP_CONNECTION,
  SERVER_ORIGIN,
  APP_ORIGIN,
  DASHBOARD_ORIGIN,
  APP_ORIGINS,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SERVICE,
  EMAIL_USER,
  EMAIL_PASSWORD,
};

// HELPERS
function generateAppConnection(): string {
  const generator = (connection: string, pasword: string) =>
    connection.replace("<password>", pasword);

  return NODE_MODE === "DEV"
    ? generator(DB_DEV_APP_CONNECTION, DB_DEV_USER_PASSWORD)
    : generator(DB_PROD_APP_CONNECTION, DB_PROD_USER_PASSWORD);
}

function generateOrigin(key: "APP" | "DASHBOARD" | "SERVER"): string {
  return key === "APP"
    ? NODE_MODE === "DEV"
      ? DEV_APP_ORIGIN
      : NODE_MODE === "PROD"
      ? PROD_APP_ORIGIN
      : ""
    : key === "DASHBOARD"
    ? NODE_MODE === "DEV"
      ? DEV_DASHBOARD_ORIGIN
      : NODE_MODE === "PROD"
      ? PROD_DASHBOARD_ORIGIN
      : ""
    : key === "SERVER"
    ? NODE_MODE === "DEV"
      ? DEV_SERVER_ORIGIN
      : NODE_MODE === "PROD"
      ? PROD_SERVER_ORIGIN
      : ""
    : "";
}

function generateAppOrigins(): string[] {
  return NODE_MODE === "DEV"
    ? [DEV_APP_ORIGIN, DEV_DASHBOARD_ORIGIN]
    : [PROD_APP_ORIGIN, PROD_DASHBOARD_ORIGIN];
}
