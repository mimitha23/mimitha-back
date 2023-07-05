import { Model } from "mongoose";

export interface ColorT {
  label: {
    ka: string;
    en: string;
  };
  hex: string;
}

export interface ColorMethodsT {}

export type ColorModelT = Model<ColorT, {}, ColorMethodsT>;
