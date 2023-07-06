import { Model } from "mongoose";

export interface RegisteredProductT {
  productType: {
    ka: string;
    en: string;
    query: string;
  };

  styles: [
    {
      ka: string;
      en: string;
      query: string;
    }
  ];

  seasons: [
    {
      ka: "გაზაფხული" | "ზაფხული" | "შემოდგომა" | "ზამთარი";
      en: "spring" | "summer" | "autumn" | "winter";
      query: "spring" | "summer" | "autumn" | "winter";
    }
  ];

  gender: {
    ka: "მამაკაცი" | "ქალბატონი" | "უნისექსი";
    en: "male" | "female" | "unisex";
    query: "male" | "female" | "unisex";
  };

  textures: [
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
