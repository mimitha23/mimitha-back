import {
  MulterConfigT,
  MulterUploadFieldT,
  MulterUploadFieldsT,
  CreateMulterDestinationT,
} from "./interface/multer.types";
import multer from "multer";
import AppError from "../AppError";
import { Request } from "express";

const MulterConfig = (Base?: any) =>
  class extends Base {
    constructor() {
      super();
    }

    multerConfig({
      filename,
      destination,
      storage,
      upload,
      contentType,
    }: MulterConfigT) {
      if (upload === "fields")
        return multer({
          storage: this.createDestination({ storage, destination }),
          fileFilter: this.mediaFilter(contentType),
          limits: {
            files: 16,
            fileSize: 10 * 1024 * 1024,
          },
        }).fields(filename as MulterUploadFieldsT);
      else
        return multer({
          storage: this.createDestination({ storage, destination }),
          fileFilter: this.mediaFilter(contentType),
        })[upload](filename as MulterUploadFieldT);
    }

    createDestination({ destination, storage }: CreateMulterDestinationT) {
      const mediaStorage = {
        diskStorage: multer.diskStorage({
          destination: (req, file, cb) => cb(null, destination!),
          filename: (req, file, cb) =>
            cb(null, this.generateMulterFileName({ req, file })),
        }),
        memoryStorage: multer.memoryStorage(),
      };

      return mediaStorage[storage];
    }

    mediaFilter(contentType: MulterConfigT["contentType"]) {
      return async (req: Request, file: Express.Multer.File, cb: any) => {
        const ext = file.mimetype;

        if (ext.startsWith(contentType)) cb(null, true);
        else if (contentType === "any") cb(null, true);
        else cb(new AppError(400, "file is not the image"), false);
      };
    }

    generateMulterFileName({ req, file }: { req: Request; file: any }) {
      return `user-${req.user.id}-${Date.now()}-${file.originalname}`;
    }
  };

export default MulterConfig;
