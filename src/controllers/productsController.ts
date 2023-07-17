import { DevelopedProduct } from "../models";
import { Async, AppError, API_Features } from "../lib";

export const getAllDevelopedProducts = Async(async function (req, res, next) {
  const docs = await new API_Features(DevelopedProduct.find(), req.query)
    .filter()
    .sort()
    .pagination()
    .selectFields({ isProduct: true })
    .execute();

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
