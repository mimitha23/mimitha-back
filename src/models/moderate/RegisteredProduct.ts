import { Schema, model } from "mongoose";
import {
  RegisteredProductT,
  RegisteredProductMethodsT,
  RegisteredProductModelT,
} from "../interface/moderate/registerProduct.types";

const RegisteredProductSchema = new Schema<
  RegisteredProductT,
  RegisteredProductModelT,
  RegisteredProductMethodsT
>({});

const RegisteredProduct = model<RegisteredProductT, RegisteredProductModelT>(
  "RegisteredProduct",
  RegisteredProductSchema
);

export default RegisteredProduct;
