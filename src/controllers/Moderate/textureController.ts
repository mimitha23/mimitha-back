import { Async, AppError } from "../../lib";
import { Texture, RegisteredProduct } from "../../models";

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
  const { textureId } = req.params;
  const body = req.body;

  const doc = await Texture.findById(textureId);

  if (!doc) return next(new AppError(400, "there ane no such texture"));

  const oldTexture = { ...doc.toObject() };

  doc.set(body);
  await doc.save({ validateBeforeSave: true });

  await RegisteredProduct.updateMany(
    {
      "textures._id": oldTexture._id,
    },
    { $set: { "textures.$.ka": body.ka, "textures.$.en": body.en } },
    { runValidators: true, arrayFilters: [{ "textures._id": oldTexture._id }] }
  );

  res.status(201).json("texture is updated");
});

export const deleteTexture = Async(async function (req, res, next) {
  const { textureId } = req.params;

  const doc = await Texture.findByIdAndDelete(textureId);

  if (!doc) return next(new AppError(400, "there ane no such texture"));

  res.status(204).json("texture is deleted");
});
