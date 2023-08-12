import { Async, AppError, FileUpload } from "../../lib";
import { Variant, DevelopedProduct } from "../../models";

const fileUpload = new FileUpload({
  storage: "memoryStorage",
  upload: "single",
});

export const uploadMedia = (filename: string) =>
  fileUpload.uploadMedia({ filename });

export const createVariant = Async(async function (req, res, next) {
  const body = req.body;

  if (!req.file) return next(new AppError(400, "please upload icon"));

  const newVariant = new Variant(body);

  let downloadUrl;

  try {
    downloadUrl = await fileUpload.uploadFileOnFirebase({
      convert: false,
      file: req.file,
      folder: "icons",
      contentType: "image/svg+xml",
    });
  } catch (error) {
    return next(new AppError(400, "ocurred error during file upload"));
  }

  newVariant.icon = downloadUrl;
  await newVariant.save();

  res.status(201).json("variant is created");
});

export const getAllVariant = Async(async function (req, res, next) {
  const docs = await Variant.find();

  res.status(200).json(docs);
});

export const updateVariant = Async(async function (req, res, next) {
  const { variantId } = req.params;
  const body = req.body;

  let downloadUrl;

  if (req.file) {
    try {
      downloadUrl = await fileUpload.updateFileOnFirebase({
        file: req.file,
        contentType: "image/svg+xml",
        folder: "icons",
        downloadUrl: body.icon,
      });
    } catch (error) {
      return next(new AppError(400, "ocurred error during upload icon"));
    }
  }

  const updatedBody = { ...body };
  if (downloadUrl) updatedBody.icon = downloadUrl;

  const doc = await Variant.findByIdAndUpdate(
    variantId,
    {
      $set: { ...updatedBody },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such variant"));

  res.status(201).json(doc);
});

export const deleteVariant = Async(async function (req, res, next) {
  const { variantId } = req.params;

  const doc = await Variant.findById(variantId);

  if (!doc) return next(new AppError(400, "there ane no such variant"));

  try {
    await fileUpload.deleteFileOnFirebase(doc.icon);
  } catch (error) {
    return next(new AppError(400, "ocurred error during delete icon"));
  }

  await Variant.findByIdAndDelete(variantId);
  await DevelopedProduct.updateMany(
    { variants: variantId },
    { $pull: { variants: variantId } }
  );

  res.status(204).json("variant is deleted");
});

export const getExistingVariantTypes = Async(async function (req, res, next) {
  const variants = await Variant.aggregate([
    {
      $project: {
        type: 1,
        label_ka: 1,
        label_en: 1,
      },
    },
    {
      $group: {
        _id: "$type",
        type: { $first: "$type" },
        label_ka: { $first: "$label_ka" },
        label_en: { $first: "$label_en" },
      },
    },
  ]);

  res.status(200).json(variants);
});
