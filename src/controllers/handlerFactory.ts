import { Async, AppError } from "../lib";
import { Model as MongooseModelT } from "mongoose";

export const updateOne = (Model: typeof MongooseModelT) =>
  Async(async function (req, res, next) {
    const { id } = req.params;
    const body = req.body;

    const doc = await Model.findByIdAndUpdate(
      id,
      {
        $set: { ...body },
      },
      { new: true }
    );

    if (!doc) return next(new AppError(400, "there ane no such color"));

    res.status(201).json(doc);
  });

export const deleteOne = (Model: typeof MongooseModelT) =>
  Async(async function (req, res, next) {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc) return next(new AppError(400, "there ane no such color"));

    res.status(204).json("color is deleted");
  });
