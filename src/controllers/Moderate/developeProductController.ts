import { Async, AppError } from "../../lib";
import { Color, Variant } from "../../models";

export const attachDevelopedProduct = Async(async function (req, res, next) {
  const body = req.body;

  // await Color.create(body);

  res.status(201).json("color is created");
});

export const getAllDevelopedProducts = Async(async function (req, res, next) {
  const docs: any[] = [];

  res.status(200).json(docs);
});

export const updateDevelopedProduct = Async(async function (req, res, next) {
  const { productId } = req.params;
  const body = req.body;

  const doc = {};

  if (!doc) return next(new AppError(400, "there ane no such color"));

  res.status(201).json(doc);
});

export const deleteDevelopedProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const doc = {};

  if (!doc) return next(new AppError(400, "there ane no such color"));

  res.status(204).json("color is deleted");
});

export const getDevelopeProductFormSugestions = Async(async function (
  req,
  res,
  next
) {
  const variants = await Variant.find().select("-__v");

  const colors = await Color.find().select("-__v");

  const sizes = [
    {
      ka: "xs",
      en: "xs",
    },
    {
      ka: "s",
      en: "s",
    },
    {
      ka: "m",
      en: "m",
    },
    {
      ka: "l",
      en: "l",
    },
    {
      ka: "xl",
      en: "xl",
    },
    {
      ka: "xxl",
      en: "xxl",
    },
  ];

  res.status(200).json({ variants, colors, sizes });
});
