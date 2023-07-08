import { Async, AppError, FileUplaod } from "../../lib";
import { Variant } from "../../models";

const fileUpload = new FileUplaod({
  storage: "memoryStorage",
  upload: "single",
});

export const uploadMedia = (filename: string) =>
  fileUpload.uploadMedia({ filename });

export const createVariant = Async(async function (req, res, next) {
  const body = req.body;

  if (!req.file) return next(new AppError(400, "please upload icon"));

  const newVariant = await new Variant(body).save();

  let downloadUrl;

  try {
    downloadUrl = await fileUpload.uploadFileOnFirebase({
      file: req.file,
      contentType: "image/svg+xml",
      folder: "icons",
    });
  } catch (error) {
    return next(new AppError(400, "occured error during file upload"));
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
      return next(new AppError(400, "occured error during upload icon"));
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
    return next(new AppError(400, "occured error during delete icon"));
  }

  await Variant.findByIdAndDelete(variantId);

  res.status(204).json("variant is deleted");
});

export const getExistingVariantTypes = Async(async function (req, res, next) {
  const variants = await Variant.find().distinct("type");

  res.status(200).json(variants);
});
