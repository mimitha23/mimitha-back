import { DevelopedProduct } from "../models";
import { Async, AppError, API_Features } from "../lib";

export const getAllDevelopedProducts = Async(async function (req, res, next) {
  const api_features = new API_Features();
  const agregationQuery = api_features.generateAgregationQuery(req.query);

  const docs = await DevelopedProduct.aggregate([
    {
      $lookup: {
        from: "registeredproducts",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    ...agregationQuery,
  ]);

  res.status(200).json(docs);
});

export const getActiveProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const doc = await DevelopedProduct.findById(productId)
    .populate({
      path: "product",
      select: "-attachedProducts -createdAt -updatedAt -__v -thumbnail",
      populate: {
        path: "developedProducts",
        select: "color",
        match: { isPublic: true },
      },
    })
    .select("-__v -isPublic -variants -createdAt -updatedAt");

  if (!doc) return next(new AppError(400, "there ane no such product"));

  res.status(200).json(doc);
});

export const searchProducts = Async(async function (req, res, next) {
  const { locale, search } = req.query;

  const titleLocale = `title.${locale || "en"}`;

  const docs = await DevelopedProduct.find({
    isPublic: true,
    [titleLocale]: { $regex: search, $options: "i" },
  });

  res.status(200).json(docs);
});

export const getProductsFilter = Async(async function (req, res, next) {
  const { category, productType } = req.query;

  const queryToExecute: any = {};

  if (category) {
    queryToExecute["product.category.query"] = category;
  }

  if (productType) {
    queryToExecute["product.productType.query"] = productType;
  }

  const filterAgregation = await DevelopedProduct.aggregate([
    {
      $lookup: {
        from: "registeredproducts",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },

    {
      $unwind: "$product",
    },

    { $match: { ...queryToExecute } },

    {
      $project: {
        "product.seasons": 1,
        "product.textures": 1,
        "product.styles": 1,
        "product.category": 1,
        "product.productType": 1,
      },
    },

    {
      $unwind: "$product.styles",
    },

    {
      $unwind: "$product.seasons",
    },

    {
      $unwind: "$product.textures",
    },

    {
      $group: {
        _id: null,
        styles: { $addToSet: "$product.styles" },
        textures: { $addToSet: "$product.textures" },
        seasons: { $addToSet: "$product.seasons" },
        productTypes: { $addToSet: "$product.productType" },
      },
    },
  ]);

  const filter: any = {
    styles: filterAgregation[0]?.styles || [],
    textures: filterAgregation[0]?.textures || [],
    seasons: filterAgregation[0]?.seasons || [],
    productTypes: filterAgregation[0]?.productTypes || [],
    sort: [
      {
        ka: "უახლესი",
        en: "New In",
        query: "-createdAd",
      },
      {
        ka: "ყველაზე პოპულარული",
        en: "The Most Popular",
        query: "-soldOut,-rating",
      },
      {
        ka: "ფასი ზრდადი",
        en: "Price Ascending",
        query: "price",
      },
      {
        ka: "ფასი კლებადი",
        en: "Price Descending",
        query: "-price",
      },
    ],
  };

  res.status(200).json(filter);
});
