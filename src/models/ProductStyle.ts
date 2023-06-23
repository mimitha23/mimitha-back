import { Schema, model } from "mongoose";
import {
  ProductStyleT,
  ProductStyleModelT,
  ProductStyleMethodsT,
} from "./interface/productStyle.types";

const ProductStyleSchema = new Schema<
  ProductStyleT,
  ProductStyleModelT,
  ProductStyleMethodsT
>({
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
  query: {
    type: String,
    required: true,
  },
});

const ProductStyle = model<ProductStyleT, ProductStyleModelT>(
  "ProductStyle",
  ProductStyleSchema
);
export default ProductStyle;
