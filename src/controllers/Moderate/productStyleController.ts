import { Async, AppError } from "../../lib";
import { ProductStyle } from "../../models";

export const createProductStyle = Async(async function (req, res, next) {
  const body = req.body;

  await ProductStyle.create(body);

  res.status(201).json("product style is created");
});

export const getAllProductStyle = Async(async function (req, res, next) {
  const docs = await ProductStyle.find();

  res.status(200).json(docs);
});

export const updateProductStyle = Async(async function (req, res, next) {
  const { id } = req.params;
  const body = req.body;

  const doc = await ProductStyle.findByIdAndUpdate(
    id,
    {
      $set: { ...body },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such product style"));

  res.status(201).json(doc);
});

export const deleteProductStyle = Async(async function (req, res, next) {
  const { id } = req.params;

  const doc = await ProductStyle.findByIdAndDelete(id);

  if (!doc) return next(new AppError(400, "there ane no such color"));

  res.status(204).json("product style is deleted");
});
