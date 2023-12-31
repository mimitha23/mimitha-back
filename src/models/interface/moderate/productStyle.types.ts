import { Model } from "mongoose";

export interface ProductStyleT {
  ka: string;
  en: string;
  query: string;
}

export interface ProductStyleMethodsT {}

export type ProductStyleModelT = Model<ProductStyleT, {}, ProductStyleMethodsT>;
