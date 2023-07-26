import { DevelopedProduct } from "../models";
import { Async } from "../lib";

export const getLanding = Async(async function (req, res, next) {
  const popularProducts = await DevelopedProduct.find({ isPublic: true })
    .populate({ path: "product", select: "category" })
    .select("assets title price soldOut rating")
    .sort({
      soldOut: -1,
      rating: -1,
    })
    .limit(12);

  res.status(200).json({ popularProducts });
});
