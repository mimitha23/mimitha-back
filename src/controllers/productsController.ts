import { DevelopedProduct } from "../models";
import { Async, AppError, API_Features } from "../lib";
import mongoose from "mongoose";

export const getAllDevelopedProducts = Async(async function (req, res, next) {
  const api_features = new API_Features({ query: req.query });
  const agregationQuery = api_features.generateAgregationQuery();

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

  if (!doc) return next(new AppError(404, "there ane no such product"));

  res.status(200).json(doc);
});

export const searchProducts = Async(async function (req, res, next) {
  const { locale, search } = req.query;

  const titleLocale = `title.${locale || "en"}`;

  const docs = await DevelopedProduct.find({
    isPublic: true,
    [titleLocale]: { $regex: search, $options: "i" },
  })
    .populate({ path: "product", select: "category productType isEditable" })
    .select("title assets price soldOut");

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

export const getRelatedProducts = Async(async function (req, res, next) {
  const { productId } = req.params;

  const doc: any = await DevelopedProduct.findById(productId).populate({
    path: "product",
    select: "productType category styles seasons gender textures",
  });

  if (!doc) return next(new AppError(404, "there ane no such product"));

  const productType = doc.product.productType.query;
  const category = doc.product.category.query;
  const styles = doc.product.styles.map((style: any) => style.query);
  const seasons = doc.product.seasons.map((season: any) => season.query);
  const gender = doc.product.gender.query;

  const relatedProducts = await DevelopedProduct.aggregate([
    {
      $lookup: {
        from: "registeredproducts",
        localField: "product",
        foreignField: "_id",
        as: "product",
        pipeline: [
          {
            $project: {
              productType: 1,
              category: 1,
              styles: 1,
              seasons: 1,
              gender: 1,
              textures: 1,
            },
          },
        ],
      },
    },
    {
      $match: {
        isPublic: true,
        "product.gender.query": gender,
        "product.category.query": category,
        "product.productType.query": productType,
        "product.seasons.query": { $in: seasons },
        "product.styles.query": { $in: styles },
        _id: { $ne: new mongoose.Types.ObjectId(productId) },
      },
    },
    {
      $project: {
        assets: 1,
        price: 1,
        rating: 1,
      },
    },
    {
      $limit: 30,
    },
  ]);

  res.status(200).json(relatedProducts);
});
