import { Model } from "mongoose";

export interface VariantT {
  type: string;
  label_ka: string;
  label_en: string;
  description_ka: string;
  description_en: string;
  icon: string;
}

export interface VariantMethodsT {}

export type VariantModelT = Model<VariantT, {}, VariantMethodsT>;
