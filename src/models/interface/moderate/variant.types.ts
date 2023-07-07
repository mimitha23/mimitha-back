import { Model } from "mongoose";

export interface VariantT {
  type: string;
  ka: string;
  en: string;
  description: string;
  icon: string;
}

export interface VariantMethodsT {}

export type VariantModelT = Model<VariantT, {}, VariantMethodsT>;
