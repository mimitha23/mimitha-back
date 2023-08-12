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
  label_ka: {
    type: String,
    required: true,
  },
  label_en: {
    type: String,
    required: true,
  },
  description_ka: {
    type: String,
    required: true,
  },
  description_en: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
});

const Variant = model<VariantT, VariantModelT>("Variant", VariantSchema);
export default Variant;
