import { model, Schema } from "mongoose";

const NavSchema = new Schema({
  category: {
    type: String,
    enum: ["men", "women", "adult", "family"],
    required: true,
    unique: true,
  },

  blocks: [
    {
      title: {
        ka: {
          type: String,
        },
        en: {
          type: String,
        },
      },
      routes: [
        {
          type: Schema.Types.ObjectId,
          ref: "ProductType",
        },
      ],
    },
  ],
});

const Nav = model("Nav", NavSchema);

export default Nav;
