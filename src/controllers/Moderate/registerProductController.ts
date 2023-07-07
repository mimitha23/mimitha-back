import {
  RegisteredProduct,
  ProductType,
  ProductStyle,
  Seasons,
  Gender,
  Texture,
} from "../../models";
import { Async, AppError } from "../../lib";

export const getRegisterProductFormSugestions = Async(async function (
  req,
  res,
  next
) {
  const productTypes = await ProductType.find().select("-__v");

  const productStyles = await ProductStyle.find().select("-__v");

  const seasons = await Seasons.find().select("-__v");

  const gender = await Gender.find().select("-__v");

  const textures = await Texture.find().select("-__v");

  res
    .status(200)
    .json({ productTypes, productStyles, seasons, gender, textures });
});

export const registerProduct = Async(async function (req, res, next) {
  const body = req.body;

  await RegisteredProduct.create(body);

  res.status(201).json("product is registered");
});

export const getAllRegisteredProducts = Async(async function (req, res, next) {
  const docs = await RegisteredProduct.find();

  res.status(200).json(docs);
});

export const updateRegisteredProduct = Async(async function (req, res, next) {
  const { id } = req.params;
  const body = req.body;

  const doc = await RegisteredProduct.findByIdAndUpdate(
    id,
    {
      $set: { ...body },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such product"));

  res.status(201).json(doc);
});

export const deleteRegisteredProduct = Async(async function (req, res, next) {
  const { id } = req.params;

  const doc = await RegisteredProduct.findByIdAndDelete(id);

  if (!doc) return next(new AppError(400, "there ane no such product"));

  res.status(204).json("product is deleted");
});
