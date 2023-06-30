import { Async, AppError, FileUplaod } from "../../lib";
import { Variant } from "../../models";
import { uploadFileOnFirebase } from "../../services/firebase";
import { ReqUserT } from "../../types";

const fileUpload = new FileUplaod({
  storage: "memoryStorage",
  upload: "single",
});

export const uploadMedia = (filename: string) =>
  fileUpload.uploadMedia({ filename });

export const createVariant = Async(async function (req, res, next) {
  const body = req.body;
  const downloadUrl = await uploadFileOnFirebase({
    file: Buffer.from(req.file.buffer),
    filename: req.file.originalname,
    folder: "icons",
  });
  console.log({ downloadUrl });
  // await Variant.create(body);

  res.status(201).json("variant is created");
});

export const getAllVariant = Async(async function (req, res, next) {
  const docs = await Variant.find();

  res.status(200).json(docs);
});

export const updateVariant = Async(async function (req, res, next) {
  const { id } = req.params;
  const body = req.body;

  const doc = await Variant.findByIdAndUpdate(
    id,
    {
      $set: { ...body },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such variant"));

  res.status(201).json(doc);
});

export const deleteVariant = Async(async function (req, res, next) {
  const { id } = req.params;

  const doc = await Variant.findByIdAndDelete(id);

  if (!doc) return next(new AppError(400, "there ane no such color"));

  res.status(204).json("variant is deleted");
});
