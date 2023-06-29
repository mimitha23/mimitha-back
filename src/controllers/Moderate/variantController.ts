import { Async, AppError } from "../../lib";
import { Variant } from "../../models";
import { ReqUserT } from "../../types";

export const createVariant = Async(async function (req, res, next) {
  const body = req.body;

  await Variant.create(body);

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
