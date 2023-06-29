import { Async, AppError } from "../../lib";
import { Color } from "../../models";
import { ReqUserT } from "../../types";

export const createColor = Async(async function (req, res, next) {
  const body = req.body;

  await Color.create(body);

  res.status(201).json("color is created");
});

export const getAllColor = Async(async function (req, res, next) {
  const docs = await Color.find();

  res.status(200).json(docs);
});

export const updateColor = Async(async function (req, res, next) {
  const { id } = req.params;
  const body = req.body;

  const doc = await Color.findByIdAndUpdate(
    id,
    {
      $set: { ...body },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such color"));

  res.status(201).json(doc);
});

export const deleteColor = Async(async function (req, res, next) {
  const { id } = req.params;

  const doc = await Color.findByIdAndDelete(id);

  if (!doc) return next(new AppError(400, "there ane no such color"));

  res.status(204).json("color is deleted");
});
