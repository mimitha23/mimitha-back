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

export const create = Async(async function (req, res, next) {});
