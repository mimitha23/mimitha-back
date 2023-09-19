import { Model, Schema, Document } from "mongoose";

export interface DevelopedProductT extends Document {
  product: Schema.Types.ObjectId;
  isPublic: boolean;
  isFeatured: boolean;
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
    _id: string;
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
  thumbnails: string[];
  mannequin: string;
  placingVideo: string;
  pickUpVideo: string;
  modelVideo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DevelopedProductMethodT {}

export type DevelopedProductModelT = Model<
  DevelopedProductT,
  {},
  DevelopedProductMethodT
>;
