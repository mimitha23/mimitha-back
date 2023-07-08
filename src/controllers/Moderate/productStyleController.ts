import { Async, AppError } from "../../lib";
import { ProductStyle, RegisteredProduct } from "../../models";

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
  const { styleId } = req.params;
  const body = req.body;

  const doc = await ProductStyle.findById(styleId);

  if (!doc) return next(new AppError(400, "there ane no such product type"));

  const oldProductStyle = { ...doc.toObject() };

  doc.set(body);
  await doc.save({ validateBeforeSave: true });

  await RegisteredProduct.updateMany(
    {
      "styles._id": oldProductStyle._id,
    },
    {
      $set: { "styles.$": { _id: oldProductStyle._id, ...body } },
    },
    {
      runValidators: true,
      arrayFilters: [{ "styles._id": oldProductStyle._id }],
    }
  );

  res.status(201).json("product style is updated");
});

export const deleteProductStyle = Async(async function (req, res, next) {
  const { styleId } = req.params;

  const doc = await ProductStyle.findByIdAndDelete(styleId);

  if (!doc) return next(new AppError(400, "there ane no such color"));

  res.status(204).json("product style is deleted");
});
