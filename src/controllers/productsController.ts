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

export const getAllDevelopedProductsByRegisteredProduct = Async(async function (
  req,
  res,
  next
) {
  const { registeredProductId } = req.params;

  const docs = await new API_Features(
    DevelopedProduct.find({ product: registeredProductId }),
    req.query
  )
    .filter()
    .sort()
    .selectFields({ isProduct: true })
    .execute();

  res.status(200).json(docs);
});
