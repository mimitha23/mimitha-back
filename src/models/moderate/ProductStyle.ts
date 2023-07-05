import { Schema, model } from "mongoose";
import {
  ProductStyleT,
  ProductStyleModelT,
  ProductStyleMethodsT,
} from "../interface/moderate/productStyle.types";

const ProductStyleSchema = new Schema<
  ProductStyleT,
  ProductStyleModelT,
  ProductStyleMethodsT
>({
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

const ProductStyle = model<ProductStyleT, ProductStyleModelT>(
  "ProductStyle",
  ProductStyleSchema
);
export default ProductStyle;
