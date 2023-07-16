import { DevelopedProduct } from "../models";
import { Async, AppError, API_Features } from "../lib";

export const getLanding = Async(async function (req, res, next) {
  const query = {
    isPublic: "1",
    sort: "-soldOut,-rating",
    page: 1,
    limit: 12,
  };

  const popularProducts = await new API_Features(DevelopedProduct.find(), query)
    .filter()
    .sort()
    .pagination()
    .selectFields({ isProduct: true })
    .execute();

  res.status(200).json({ popularProducts });
});
