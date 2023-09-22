import {
  RegisteredProduct,
  DevelopedProduct,
  ProductType,
  ProductStyle,
  Seasons,
  Gender,
  Texture,
  Category,
} from "../../models";
import { Async, AppError, FileUpload } from "../../lib";

const fileUpload = new FileUpload({
  storage: "memoryStorage",
  upload: "single",
});

export const uploadMedia = (filename: string) =>
  fileUpload.uploadMedia({ filename });

export const registerProduct = Async(async function (req, res, next) {
  const body = req.body;

  if (!req.file) return next(new AppError(400, "please upload thumbnail"));

  const registeredProduct = await new RegisteredProduct(body).save();

  let downloadUrl;

  try {
    downloadUrl = await fileUpload.uploadFileOnFirebase({
      file: req.file,
      contentType: "image/webp",
      folder: "products",
    });
  } catch (error) {
    return next(new AppError(400, "ocurred error during upload thumbnail"));
  }

  registeredProduct.thumbnail = downloadUrl;
  await registeredProduct.save();

  res.status(201).json("product is registered");
});

export const getRegisterProductFormSuggestions = Async(async function (
  req,
  res,
  next
) {
  const productTypes = await ProductType.find().select("-__v");

  const productStyles = await ProductStyle.find().select("-__v");

  const seasons = await Seasons.find().select("-__v");

  const gender = await Gender.find().select("-__v");

  const textures = await Texture.find().select("-__v");

  const categories = await Category.find().select("-__v");

  res.status(200).json({
    productTypes,
    productStyles,
    seasons,
    gender,
    textures,
    categories,
  });
});

export const getAllRegisteredProducts = Async(async function (req, res, next) {
  const docs = await RegisteredProduct.find().sort({ createdAt: -1 });

  res.status(200).json(docs);
});

export const updateRegisteredProduct = Async(async function (req, res, next) {
  const { productId } = req.params;
  const body = req.body;

  let downloadUrl;

  if (req.file && body.thumbnail) {
    try {
      downloadUrl = await fileUpload.updateFileOnFirebase({
        file: req.file,
        folder: "products",
        contentType: "image/webp",
        downloadUrl: body.thumbnail,
      });
    } catch (error) {
      return next(new AppError(400, "ocurred error during update thumbnail"));
    }
  }

  const updatedBody = { ...body };
  if (downloadUrl) updatedBody.thumbnail = downloadUrl;

  const doc = await RegisteredProduct.findByIdAndUpdate(
    productId,
    {
      $set: { ...updatedBody },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such product"));

  res.status(201).json("product is updated");
});

export const deleteRegisteredProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const doc = await RegisteredProduct.findById(productId).populate({
    path: "developedProducts",
    select: "assets thumbnails mannequin modelVideo placingVideo pickUpVideo",
  });

  if (!doc) return next(new AppError(400, "there ane no such product"));

  const developedProductsAssets = doc.developedProducts.flatMap(
    (product: any) => product.assets
  );

  const developedProductsThumbnails = doc.developedProducts.flatMap(
    (product: any) => product.thumbnails
  );

  const developedProductsOtherAssets = doc.developedProducts.flatMap(
    (product: any) => [
      product.mannequin,
      product.modelVideo,
      product.placingVideo,
      product.pickUpVideo,
    ]
  );

  const developedProductsIds = doc.developedProducts.flatMap(
    (product: any) => product._id
  );

  await DevelopedProduct.deleteMany({ _id: { $in: developedProductsIds } });

  try {
    const filesToDelete: string[] = [
      ...developedProductsAssets,
      ...developedProductsThumbnails,
      ...developedProductsOtherAssets,
      doc.thumbnail,
    ];

    await fileUpload.deleteMultipleFilesOnFirebase(filesToDelete);
  } catch (error) {
    return next(new AppError(400, "ocurred error during delete thumbnail"));
  }

  res.status(204).json("product is deleted");
});
