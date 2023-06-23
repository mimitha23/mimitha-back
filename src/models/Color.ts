import { Schema, model } from "mongoose";
import { ColorT, ColorMethodsT, ColorModelT } from "./interface/color.types";

const ColorSchema = new Schema<ColorT, ColorModelT, ColorMethodsT>({
  label: {
    ka: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
  },
  hex: {
    type: String,
    required: true,
  },
});

const Color = model<ColorT, ColorModelT>("Color", ColorSchema);
export default Color;
