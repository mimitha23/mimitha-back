import { Schema, model } from "mongoose";
import {
  ColorT,
  ColorMethodsT,
  ColorModelT,
} from "../interface/moderate/color.types";

const ColorSchema = new Schema<ColorT, ColorModelT, ColorMethodsT>({
  label: {
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
  },
  hex: {
    type: String,
    required: true,
    unique: true,
  },
});

const Color = model<ColorT, ColorModelT>("Color", ColorSchema);

export default Color;
