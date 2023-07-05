import { Schema, model } from "mongoose";
import {
  ProductTypeT,
  ProductTypeModelT,
  ProductTypeMethodsT,
} from "../interface/moderate/productType.types";

const ProductTypeSchema = new Schema<
  ProductTypeT,
  ProductTypeModelT,
  ProductTypeMethodsT
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

const ProductType = model<ProductTypeT, ProductTypeModelT>(
  "ProductType",
  ProductTypeSchema
);
export default ProductType;
