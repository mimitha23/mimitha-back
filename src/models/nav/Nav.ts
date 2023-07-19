import { model, Schema } from "mongoose";

const NavSchema = new Schema({
  category: {
    type: String,
    enum: ["MEN", "WOMEN", "ADULT", "FAMILY"],
    required: true,
    unique: true,
  },

  title: {
    ka: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
  },

  routes: [
    {
      type: Schema.Types.ObjectId,
      ref: "NavRoutes",
    },
  ],
});

const Nav = model("Nav", NavSchema);

export default Nav;
