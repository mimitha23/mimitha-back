import { AppError, Async } from "../../lib";
import { UserList } from "../../models";

export const createList = Async(async function (req, res, next) {
  const { title } = req.body;
  const currUser = req.user;

  const list = await UserList.create({
    title,
    user: currUser._id,
    products: [],
  });

  res.status(201).json(list);
});

export const addToList = Async(async function (req, res, next) {
  const { listId, productId } = req.params;
  const currUser = req.user;

  const updatedList = await UserList.findOneAndUpdate(
    { _id: listId, user: currUser._id },
    {
      $addToSet: { products: productId },
    }
  );

  if (!updatedList) return next(new AppError(404, "there are no such a list."));

  res.status(201).json("product added to the list");
});

export const removeFromList = Async(async function (req, res, next) {
  const { listId, productId } = req.params;
  const currUser = req.user;

  const updatedList = await UserList.findOneAndUpdate(
    { _id: listId, user: currUser._id },
    {
      $pull: { products: productId },
    }
  );

  if (!updatedList) return next(new AppError(404, "there are no such a list."));

  res.status(204).json("product added to the list");
});

export const getAllList = Async(async function (req, res, next) {
  const currUser = req.user;

  const docs = await UserList.find({ user: currUser._id });

  res.status(200).json(docs);
});

export const getAllFromList = Async(async function (req, res, next) {
  const { listId } = req.params;
  const currUser = req.user;

  const docs = await UserList.findOne({
    user: currUser._id,
    _id: listId,
  }).populate({
    path: "products",
    select: "product title price thumbnails soldOut size color",
    populate: { path: "product", select: "category productType isEditable" },
  });

  res.status(200).json(docs);
});

export const deleteList = Async(async function (req, res, next) {
  const { listId } = req.params;

  await UserList.findByIdAndDelete(listId);

  res.status(204).json("list is deleted");
});
