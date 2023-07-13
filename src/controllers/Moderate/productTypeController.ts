import { Async, AppError } from "../../lib";
import { ProductType, RegisteredProduct } from "../../models";

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
  const { typeId } = req.params;
  const body = req.body;

  const doc = await ProductType.findByIdAndUpdate(typeId, {
    $set: { ...body },
  });

  if (!doc) return next(new AppError(400, "there ane no such product type"));

  await RegisteredProduct.updateMany(
    {
      "productType._id": doc._id,
    },
    {
      $set: { productType: { ...body, _id: doc._id } },
    },
    { runValidators: true }
  );

  res.status(201).json("product type is updated");
});

export const deleteProductType = Async(async function (req, res, next) {
  const { typeId } = req.params;

  const doc = await ProductType.findByIdAndDelete(typeId);

  if (!doc) return next(new AppError(400, "there ane no such color"));

  res.status(204).json("product type is deleted");
});
