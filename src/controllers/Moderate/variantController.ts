import { Async, AppError, FileUplaod } from "../../lib";
import { Variant } from "../../models";
import { ReqUserT } from "../../types";

const fileUpload = new FileUplaod({
  storage: "memoryStorage",
  upload: "single",
});

export const uploadMedia = (filename: string) =>
  fileUpload.uploadMedia({ filename });

export const createVariant = Async(async function (req, res, next) {
  const body = req.body;

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

  await Variant.create({ ...body, icon: downloadUrl });

  res.status(201).json("variant is created");
});

export const getAllVariant = Async(async function (req, res, next) {
  const docs = await Variant.find();

  res.status(200).json(docs);
});

export const updateVariant = Async(async function (req, res, next) {
  const { id } = req.params;
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
      return next(new AppError(400, "occured error during file upload"));
    }
  }

  const doc = await Variant.findByIdAndUpdate(
    id,
    {
      $set: { ...body, icon: downloadUrl },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such variant"));

  res.status(201).json(doc);
});

export const deleteVariant = Async(async function (req, res, next) {
  const { id } = req.params;

  const doc = await Variant.findById(id);

  if (!doc) return next(new AppError(400, "there ane no such variant"));

  try {
    await fileUpload.deleteFileOnFirebase(doc.icon);
  } catch (error) {
    return next(new AppError(400, "occured error during delete file"));
  }

  await Variant.findByIdAndDelete(id);

  res.status(204).json("variant is deleted");
});

export const getExistingVariantTypes = Async(async function (req, res, next) {
  const variants = await Variant.find().distinct("type");

  res.status(200).json(variants);
});
