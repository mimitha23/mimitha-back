import { Model } from "mongoose";

export interface ProductTypeT {
  label: {
    ka: string;
    en: string;
  };
  query: string;
}

export interface ProductTypeMethodsT {}

export type ProductTypeModelT = Model<ProductTypeT, {}, ProductTypeMethodsT>;
