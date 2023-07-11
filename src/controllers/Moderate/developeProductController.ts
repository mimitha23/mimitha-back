import { Async, AppError, FileUplaod } from "../../lib";
import {
  Color,
  Variant,
  DevelopedProduct,
  RegisteredProduct,
} from "../../models";

const fileUpload = new FileUplaod({
  storage: "memoryStorage",
  upload: "any",
});

export const uploadMedia = (filename: string) =>
  fileUpload.uploadMedia({ filename });

export const attachDevelopedProduct = Async(async function (req, res, next) {
  const body = req.body;

  if (!req.files) return next(new AppError(400, "please upload assets"));

  const developedProduct = await new DevelopedProduct(body).save();

  let downloadUrls;

  try {
    downloadUrls = await fileUpload.uploadMultiplesFileOnFirebase({
      files: req.files,
      contentType: "image/webp",
      folder: "products",
    });
  } catch (error) {
    return next(new AppError(400, "occured error during upload assets"));
  }

  developedProduct.assets = downloadUrls;
  await developedProduct.save();

  await RegisteredProduct.findByIdAndUpdate(developedProduct.product, {
    $inc: { attachedProducts: 1 },
    $push: { developedProducts: developedProduct.product },
  });

  res.status(201).json("product is attached");
});

export const getAllDevelopedProducts = Async(async function (req, res, next) {
  const { select } = req.query;

  const full = "-__v";
  const short = "title price color inStock assets rating soldOut";

  let fieldsToSelect = "";

  if (select === "short" || !select) fieldsToSelect = short;
  else if (select === "full") fieldsToSelect = full;
  else fieldsToSelect = select as string;

  const docs = await DevelopedProduct.find().select(fieldsToSelect);

  res.status(200).json(docs);
});

export const getDevelopedProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const doc = await DevelopedProduct.findById(productId)
    .populate({
      path: "product",
    })
    .populate({ path: "variants" });

  if (!doc) return next(new AppError(400, "there ane no such product"));

  res.status(200).json(doc);
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
