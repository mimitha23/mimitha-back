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

  const doc = await ProductStyle.findByIdAndUpdate(styleId, {
    $set: { ...body },
  });

  if (!doc) return next(new AppError(400, "there ane no such product type"));

  await RegisteredProduct.updateMany(
    {
      "styles._id": doc._id,
    },
    {
      $set: { "styles.$": { ...body, _id: doc._id } },
    },
    {
      runValidators: true,
      arrayFilters: [{ "styles._id": doc._id }],
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
