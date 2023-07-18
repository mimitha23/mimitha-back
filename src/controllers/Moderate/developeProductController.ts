import {
  Color,
  Variant,
  DevelopedProduct,
  RegisteredProduct,
} from "../../models";
import { Async, AppError, FileUpload, API_Features } from "../../lib";

const fileUpload = new FileUpload({
  storage: "memoryStorage",
  upload: "any",
});

export const uploadMedia = (filename: string) =>
  fileUpload.uploadMedia({ filename });

export const attachDevelopedProduct = Async(async function (req, res, next) {
  const body = req.body;

  if (!req.files) return next(new AppError(400, "please upload assets"));

  const doc = await new DevelopedProduct(body).save();

  let downloadUrls;

  try {
    downloadUrls = await fileUpload.uploadMultipleFilesOnFirebase({
      files: req.files,
      folder: "products",
      contentType: "image/webp",
    });
  } catch (error: any) {
    return next(new AppError(400, "occured error during upload assets"));
  }

  doc.assets = downloadUrls;
  await doc.save();

  await RegisteredProduct.findByIdAndUpdate(doc.product, {
    $inc: { attachedProducts: 1 },
    $push: { developedProducts: doc._id },
  });

  res.status(201).json("product is attached");
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

export const getAllDevelopedProductsByRegisteredProduct = Async(async function (
  req,
  res,
  next
) {
  const { registeredProductId } = req.params;

  const docs = await new API_Features(
    DevelopedProduct.find({ product: registeredProductId }),
    req.query
  )
    .filter()
    .sort()
    .selectFields({ isProduct: true })
    .execute();

  res.status(200).json(docs);
});

export const copyDevelopedProductConfig = Async(async function (
  req,
  res,
  next
) {
  const { registeredProductId } = req.params;

  const { createdAt, updatedAt }: any = req.query;

  const sort: any = {};

  if (createdAt) sort.createdAt = createdAt;
  else if (updatedAt) sort.updatedAt = updatedAt;

  const doc = await DevelopedProduct.find({ product: registeredProductId })
    .sort(sort)
    .limit(1)
    .populate({ path: "variants" })
    .select("description isPublic price size variants");

  if (!doc[0]) return next(new AppError(400, "there ane no such product"));

  res.status(200).json(doc[0]);
});

export const updateDevelopedProduct = Async(async function (req, res, next) {
  const { productId } = req.params;
  const body = req.body;

  const isFilesToDelete =
    Array.isArray(body.filesToDelete) && body.filesToDelete[0] ? true : false;

  if (isFilesToDelete && Array.isArray(body.assets))
    body.assets = body.assets.filter(
      (asset: string) => !body.filesToDelete.includes(asset)
    );

  const doc = await DevelopedProduct.findByIdAndUpdate(
    productId,
    {
      $set: { ...body },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such product"));

  let downloadUrls;

  // upload files and delete removed files
  if (req.files) {
    try {
      downloadUrls = await fileUpload.updateMultipleFilesOnFirebase({
        files: req.files,
        folder: "products",
        contentType: "image/webp",
        downloadUrls: body.filesToDelete || [],
      });
    } catch (error: any) {
      return next(
        new AppError(400, error.message || "occured error during update assets")
      );
    }
    // if there are no new files but are removed files, delete them
  } else if (isFilesToDelete) {
    try {
      await fileUpload.deleteMultipleFilesOnFirebase(body.filesToDelete);
    } catch (error) {
      return next(
        new AppError(400, "occured error during delete removed files")
      );
    }
  }

  // if there were new files, join them to previous assets
  if (downloadUrls && Array.isArray(downloadUrls))
    doc.set("assets", [...doc.assets, ...downloadUrls]);

  await doc.save();

  res.status(201).json(doc);
});

export const deleteDevelopedProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const doc = await DevelopedProduct.findByIdAndDelete(productId);

  if (!doc) return next(new AppError(400, "there ane no such product"));

  try {
    await fileUpload.deleteMultipleFilesOnFirebase(doc.assets);
  } catch (error) {
    return next(new AppError(400, "occured error during delete thumbnail"));
  }

  await RegisteredProduct.findByIdAndUpdate(doc.product, {
    $inc: { attachedProducts: -1 },
    $pull: { developedProducts: doc._id },
  });

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
