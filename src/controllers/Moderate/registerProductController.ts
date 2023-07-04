import { Async, AppError } from "../../lib";
import {
  RegisteredProduct,
  ProductType,
  ProductStyle,
  Seasons,
  Gender,
} from "../../models";
import { ReqUserT } from "../../types";

export const getRegisterProductFormSugestions = Async(async function (
  req,
  res,
  next
) {
  const productTypes = await ProductType.find().select("-__v");

  const productStyles = await ProductStyle.find().select("-__v");

  const seasons = await Seasons.find().select("-__v");

  const gender = await Gender.find().select("-__v");

  res.status(200).json({ productTypes, productStyles, seasons, gender });
});

export const create = Async(async function (req, res, next) {});
