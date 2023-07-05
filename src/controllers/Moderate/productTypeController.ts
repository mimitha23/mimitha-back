import { Async, AppError } from "../../lib";
import { ProductType } from "../../models";

export const createProductType = Async(async function (req, res, next) {
  const body = req.body;

  await ProductType.create(body);

  res.status(201).json("product type is created");
});

export const getAllProductType = Async(async function (req, res, next) {
  const docs = await ProductType.find();

  res.status(200).json(docs);
});

export const updateProductType = Async(async function (req, res, next) {
  const { id } = req.params;
  const body = req.body;

  const doc = await ProductType.findByIdAndUpdate(
    id,
    {
      $set: { ...body },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such product type"));

  res.status(201).json(doc);
});

export const deleteProductType = Async(async function (req, res, next) {
  const { id } = req.params;

  const doc = await ProductType.findByIdAndDelete(id);

  if (!doc) return next(new AppError(400, "there ane no such color"));

  res.status(204).json("product type is deleted");
});
