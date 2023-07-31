import { AppError, Async } from "../../lib";
import { User } from "../../models";

export const addToFavorites = Async(async function (req, res, next) {
  const { productId }: any = req.params;
  const currUser = req.user;

  await User.findByIdAndUpdate(currUser._id, {
    $addToSet: { favorites: productId },
  });

  res.status(201).json("product is added");
});

export const removeFromFavorites = Async(async function (req, res, next) {
  const { productId }: any = req.params;
  const currUser = req.user;

  await User.findByIdAndUpdate(currUser._id, {
    $pull: { favorites: productId },
  });

  res.status(204).json("product is removed");
});

export const getAllFavorites = Async(async function (req, res, next) {
  const currUser = req.user;
  const { select } = req.query;

  let querySelect = "";
  if (select === "short") querySelect = "_id";

  const docs = await User.findById(currUser._id)
    .select("favorites")
    .populate({ path: "favorites", select: querySelect });

  if (!docs) return next(new AppError(404, "there are no such user"));

  res.status(200).json(docs.favorites);
});
