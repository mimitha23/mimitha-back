import { Model, Schema } from "mongoose";

export interface DevelopedProductT {
  product: Schema.Types.ObjectId;
  isPublic: boolean;
  title: {
    ka: string;
    en: string;
  };
  price: number;
  sale: boolean;
  color: {
    ka: string;
    en: string;
    hex: string;
  };
  size: [
    {
      size: string;
      amount: number;
    }
  ];
  inStock: number;
  soldOut: number;
  rating: number;
  variants: Schema.Types.ObjectId[];
  description: {
    ka: string;
    en: string;
  };
  assets: string[];
}

export interface DevelopedProductMethodT {}

export type DevelopedProductModelT = Model<
  DevelopedProductT,
  {},
  DevelopedProductMethodT
>;
