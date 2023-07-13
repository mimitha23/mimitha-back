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
>({
  isEditable: {
    type: Boolean,
    default: false,
  },

  thumbnail: {
    type: String,
    // required: true,
  },

  productType: {
    ka: { type: String, required: true },
    en: { type: String, required: true },
    query: { type: String, required: true },
    _id: { type: String, required: true },
  },

  styles: [
    {
      ka: { type: String, required: true },
      en: { type: String, required: true },
      query: { type: String, required: true },
    },
  ],

  seasons: [
    {
      ka: {
        enum: ["გაზაფხული", "ზაფხული", "შემოდგომა", "ზამთარი"],
        type: String,
        required: true,
      },
      en: {
        enum: ["spring", "summer", "autumn", "winter"],
        type: String,
        required: true,
      },
      query: {
        enum: ["spring", "summer", "autumn", "winter"],
        type: String,
        required: true,
      },
    },
  ],

  gender: {
    ka: {
      enum: ["მამაკაცი", "ქალბატონი", "უნისექსი"],
      type: String,
      required: true,
    },
    en: { enum: ["male", "female", "unisex"], type: String, required: true },
    query: {
      enum: ["male", "female", "unisex"],
      type: String,
      required: true,
    },
  },

  textures: [
    {
      ka: { type: String, required: true },
      en: { type: String, required: true },
      percentage: { type: Number, required: true },
    },
  ],

  warnings: [
    {
      ka: { type: String, required: true },
      en: { type: String, required: true },
    },
  ],

  attachedProducts: {
    type: Number,
    default: 0,
  },

  developedProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "DevelopedProduct",
    },
  ],
});

const RegisteredProduct = model<RegisteredProductT, RegisteredProductModelT>(
  "RegisteredProduct",
  RegisteredProductSchema
);

export default RegisteredProduct;
