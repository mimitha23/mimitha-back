import { Schema, model } from "mongoose";
import {
  VariantT,
  VariantModelT,
  VariantMethodsT,
} from "../interface/moderate/variant.types";

const VariantSchema = new Schema<VariantT, VariantModelT, VariantMethodsT>({
  type: {
    type: String,
    required: true,
  },
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
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const Variant = model<VariantT, VariantModelT>("Variant", VariantSchema);
export default Variant;
