import { model, Schema } from "mongoose";

const NavRoutesSchema = new Schema({
  ka: {
    type: String,
    required: true,
    unique: true,
  },
  en: {
    type: String,
    required: true,
    unique: true,
  },
  query: {
    type: String,
    required: true,
    unique: true,
  },
});

const NavRoutes = model("NavRoutes", NavRoutesSchema);

export default NavRoutes;
