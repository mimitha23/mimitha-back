import { Model } from "mongoose";

export interface TextureT {
  ka: string;
  en: string;
}

export interface TextureMethodsT {}

export type TextureModelT = Model<TextureT, {}, TextureMethodsT>;
