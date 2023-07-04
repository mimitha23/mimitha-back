import { Model } from "mongoose";

export interface RegisteredProductT {
  productType: {
    label: {
      ka: string;
      en: string;
    };
    query: string;
  };

  style: [
    {
      label: {
        ka: string;
        en: string;
      };
      query: string;
    }
  ];

  season: [
    {
      ka: string;
      en: string;
    }
  ];

  gender: {
    ka: "მამაკაცი" | "ქალბატონი" | "უნისექსი";
    en: "male" | "female" | "unisex";
  };

  texture: [
    {
      ka: string;
      en: string;
      percentage: number;
    }
  ];

  warnings: [
    {
      ka: string;
      en: string;
    }
  ];
}

export interface RegisteredProductMethodsT {}

export type RegisteredProductModelT = Model<
  RegisteredProductT,
  {},
  RegisteredProductMethodsT
>;
