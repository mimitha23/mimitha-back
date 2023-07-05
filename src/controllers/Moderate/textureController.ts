import { Async, AppError } from "../../lib";
import { Texture } from "../../models";

export const createTexture = Async(async function (req, res, next) {
  const body = req.body;

  await Texture.create(body);

  res.status(201).json("texture is created");
});

export const getAllTexture = Async(async function (req, res, next) {
  const docs = await Texture.find();

  res.status(200).json(docs);
});

export const updateTexture = Async(async function (req, res, next) {
  const { id } = req.params;
  const body = req.body;

  const doc = await Texture.findByIdAndUpdate(
    id,
    {
      $set: { ...body },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such texture"));

  res.status(201).json(doc);
});

export const deleteTexture = Async(async function (req, res, next) {
  const { id } = req.params;

  const doc = await Texture.findByIdAndDelete(id);

  if (!doc) return next(new AppError(400, "there ane no such texture"));

  res.status(204).json("texture is deleted");
});
