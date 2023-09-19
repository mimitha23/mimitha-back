import {
  Color,
  Variant,
  DevelopedProduct,
  RegisteredProduct,
} from "../../models";
import {
  FileT,
  UploadFileOnFirebaseT,
} from "../../lib/FileUpload/interface/firebase.types";
import { NextFunction, Request, Response } from "express";
import { Async, AppError, FileUpload, API_Features } from "../../lib";
import { MulterUploadFieldsT } from "../../lib/FileUpload/interface/multer.types";

const fileUpload = new FileUpload({
  upload: "fields",
  storage: "memoryStorage",
});

export const uploadImageMedia = (filename: MulterUploadFieldsT) =>
  fileUpload.uploadMedia({ filename, contentType: "any" });

export const attachDevelopedProduct = Async(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = req.body;

  const isSimilar = await DevelopedProduct.findOne({
    $and: [{ variants: body.variants }, { color: body.color }],
  });

  if (isSimilar)
    return next(
      new AppError(
        400,
        `Product with exact this color and variants already exists.You can find existing product with this name > '${isSimilar.title.en}'`
      )
    );

  if (!req.files) return next(new AppError(400, "please upload assets"));

  const doc = new DevelopedProduct(body);

  try {
    const downloadUrls = await uploadAllDevelopeProductAssets(req);

    doc.assets = downloadUrls.assets;
    doc.thumbnails = downloadUrls.thumbnails;
    doc.mannequin = downloadUrls.mannequin;
    doc.placingVideo = downloadUrls.placing;
    doc.pickUpVideo = downloadUrls.pick_up;
    doc.modelVideo = downloadUrls.modelVideo;
  } catch (error: any) {
    return next(new AppError(400, "occurred error during upload files"));
  }

  await doc.save();

  await RegisteredProduct.findByIdAndUpdate(doc.product, {
    $inc: { attachedProducts: 1 },
    $push: { developedProducts: doc._id },
  });

  res.status(201).json("product is attached");
});

export const getDevelopedProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const doc = await DevelopedProduct.findById(productId)
    .populate({
      path: "product",
    })
    .populate({ path: "variants" });

  if (!doc) return next(new AppError(400, "there ane no such product"));

  res.status(200).json(doc);
});

export const getAllDevelopedProductsByRegisteredProduct = Async(async function (
  req,
  res,
  next
) {
  const { registeredProductId } = req.params;

  const { doc } = new API_Features({
    doc: DevelopedProduct.find({ product: registeredProductId }),
    query: req.query,
  })
    .filter()
    .sort()
    .selectFields();

  const docs = await doc;

  res.status(200).json(docs);
});

export const copyDevelopedProductConfig = Async(async function (
  req,
  res,
  next
) {
  const { registeredProductId } = req.params;

  const { createdAt, updatedAt }: any = req.query;

  const sort: any = {};

  if (createdAt) sort.createdAt = createdAt;
  else if (updatedAt) sort.updatedAt = updatedAt;

  const doc = await DevelopedProduct.find({ product: registeredProductId })
    .sort(sort)
    .limit(1)
    .populate({ path: "variants" })
    .select("description isPublic price size variants");

  if (!doc[0]) return next(new AppError(400, "there ane no such product"));

  res.status(200).json(doc[0]);
});

export const updateDevelopedProduct = Async(async function (req, res, next) {
  const { productId } = req.params;
  const body = req.body;

  const isFilesToDelete =
    Array.isArray(body.filesToDelete) && body.filesToDelete[0] ? true : false;

  if (isFilesToDelete && Array.isArray(body.assets))
    body.assets = body.assets.filter(
      (asset: string) => !body.filesToDelete.includes(asset)
    );

  const doc = await DevelopedProduct.findByIdAndUpdate(
    productId,
    {
      $set: { ...body },
    },
    { new: true }
  );

  if (!doc) return next(new AppError(400, "there ane no such product"));

  let downloadUrls;

  // upload files and delete removed files
  if (req.files) {
    try {
      downloadUrls = await fileUpload.updateMultipleFilesOnFirebase({
        files: req.files,
        folder: "products",
        contentType: "image/webp",
        downloadUrls: body.filesToDelete || [],
      });
    } catch (error: any) {
      return next(
        new AppError(
          400,
          error.message || "occurred error during update assets"
        )
      );
    }
    // if there are no new files but are removed files, delete them
  } else if (isFilesToDelete) {
    try {
      await fileUpload.deleteMultipleFilesOnFirebase(body.filesToDelete);
    } catch (error) {
      return next(
        new AppError(400, "occurred error during delete removed files")
      );
    }
  }

  // if there were new files, join them to previous assets
  if (downloadUrls && Array.isArray(downloadUrls))
    doc.set("assets", [...doc.assets, ...downloadUrls]);

  await doc.save();

  res.status(201).json(doc);
});

export const deleteDevelopedProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const doc = await DevelopedProduct.findByIdAndDelete(productId);

  if (!doc) return next(new AppError(400, "there ane no such product"));

  try {
    await fileUpload.deleteMultipleFilesOnFirebase(doc.assets);
  } catch (error) {
    return next(new AppError(400, "occurred error during delete thumbnail"));
  }

  await RegisteredProduct.findByIdAndUpdate(doc.product, {
    $inc: { attachedProducts: -1 },
    $pull: { developedProducts: doc._id },
  });

  res.status(204).json("color is deleted");
});

export const getDevelopeProductFormSuggestions = Async(async function (
  req,
  res,
  next
) {
  const variants = await Variant.find().select("-__v");

  const colors = await Color.find().select("-__v");

  const sizes = [
    {
      ka: "xs",
      en: "xs",
    },
    {
      ka: "s",
      en: "s",
    },
    {
      ka: "m",
      en: "m",
    },
    {
      ka: "l",
      en: "l",
    },
    {
      ka: "xl",
      en: "xl",
    },
    {
      ka: "xxl",
      en: "xxl",
    },
  ];

  res.status(200).json({ variants, colors, sizes });
});

// UTILS

async function uploadAllDevelopeProductAssets(req: Request) {
  try {
    const downloadUrls: {
      assets: any;
      thumbnails: any;
      mannequin: any;
      modelVideo: any;
      placing: any;
      pick_up: any;
    } = {
      assets: [],
      thumbnails: [],
      mannequin: "",
      modelVideo: "",
      placing: "",
      pick_up: "",
    };

    function isFileArray(files: any): files is FileT[] {
      return (
        Array.isArray(files) &&
        files.every(
          (file) =>
            file &&
            typeof file === "object" &&
            "fieldname" in file &&
            "originalname" in file
        )
      );
    }

    const new_simulation_video_placing =
      req.files["new_simulation_video_placing" as keyof typeof req.files];
    const new_simulation_video_pick_up =
      req.files["new_simulation_video_pick_up" as keyof typeof req.files];
    const new_model_video =
      req.files["new_model_video" as keyof typeof req.files];
    const new_mannequin = req.files["new_mannequin" as keyof typeof req.files];
    const new_thumbnails =
      req.files["new_thumbnails[]" as keyof typeof req.files];
    const new_assets = req.files["new_assets[]" as keyof typeof req.files];

    const allFieldsArr: {
      field: any;
      single: boolean;
      convert: boolean;
      key: keyof typeof downloadUrls;
      folder: UploadFileOnFirebaseT["folder"];
      contentType: UploadFileOnFirebaseT["contentType"];
    }[] = [
      {
        single: true,
        convert: false,
        key: "placing",
        folder: "videos",
        contentType: "video/mp4",
        field: new_simulation_video_placing,
      },
      {
        single: true,
        convert: false,
        key: "pick_up",
        folder: "videos",
        contentType: "video/mp4",
        field: new_simulation_video_pick_up,
      },
      {
        single: true,
        convert: false,
        key: "modelVideo",
        folder: "videos",
        contentType: "video/mp4",
        field: new_model_video,
      },
      {
        single: true,
        convert: true,
        key: "mannequin",
        folder: "products",
        contentType: "image/webp",
        field: new_mannequin,
      },
      {
        single: false,
        convert: true,
        key: "assets",
        folder: "products",
        contentType: "image/webp",
        field: new_assets,
      },
      {
        single: false,
        convert: true,
        key: "thumbnails",
        folder: "products",
        contentType: "image/webp",
        field: new_thumbnails,
      },
    ];

    if (allFieldsArr.every((item) => isFileArray(item.field)))
      await Promise.all(
        allFieldsArr.map(async (block) => {
          downloadUrls[block.key] = block.single
            ? await fileUpload.uploadFileOnFirebase({
                file: block.field[0],
                folder: block.folder,
                contentType: block.contentType,
                convert: block.convert,
              })
            : await fileUpload.uploadMultipleFilesOnFirebase({
                files: block.field,
                folder: block.folder,
                contentType: "image/webp",
              });
        })
      );

    return downloadUrls;
  } catch (error) {
    throw error;
  }
}
