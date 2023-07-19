import {
  DevelopedProductT,
  DevelopedProductModelT,
  DevelopedProductMethodT,
} from "../interface/moderate/developedProduct.types";
import { Schema, model } from "mongoose";

const DevelopedProductSchema = new Schema<
  DevelopedProductT,
  DevelopedProductModelT,
  DevelopedProductMethodT
>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "RegisteredProduct",
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    title: {
      ka: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
    },

    price: {
      type: Number,
      required: true,
    },

    sale: {
      type: Boolean,
      default: false,
    },

    color: {
      ka: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
      hex: {
        type: String,
        required: true,
      },
      _id: {
        type: String,
        required: true,
      },
    },

    size: [
      {
        size: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],

    inStock: {
      type: Number,
      required: true,
    },

    soldOut: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],

    description: {
      ka: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
    },

    assets: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const DevelopedProduct = model<DevelopedProductT, DevelopedProductModelT>(
  "DevelopedProduct",
  DevelopedProductSchema
);

export default DevelopedProduct;
