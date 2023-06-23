import { Schema, model } from "mongoose";
import {
  ProductTypeT,
  ProductTypeModelT,
  ProductTypeMethodsT,
} from "./interface/productType.types";

const ProductTypeSchema = new Schema<
  ProductTypeT,
  ProductTypeModelT,
  ProductTypeMethodsT
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

const ProductType = model<ProductTypeT, ProductTypeModelT>(
  "ProductType",
  ProductTypeSchema
);
export default ProductType;
