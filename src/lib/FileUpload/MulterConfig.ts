import multer from "multer";
import AppError from "../AppError";
import { Request } from "express";
import { MulterConfigT, CreateMulterDestionationT } from "./fileUpload.types";

const MulterConfig = (Base?: any) =>
  class extends Base {
    constructor() {
      super();
    }

    multerConfig({ filename, destination, storage, upload }: MulterConfigT) {
      return multer({
        storage: this.createDestination({ storage, destination }),
        fileFilter: this.mediaFilter,
      })[upload](filename);
    }

    createDestination({ destination, storage }: CreateMulterDestionationT) {
      const filename = ({ req, file }: { req: Request; file: any }) =>
        `user-${req.user.id}-${Date.now()}-${file.originalname}`;

      const mediaStorage = {
        diskStorage: multer.diskStorage({
          destination: (req, file, cb) => cb(null, destination!),
          filename: (req, file, cb) => cb(null, filename({ req, file })),
        }),
        memoryStorage: multer.memoryStorage(),
      };

      return mediaStorage[storage];
    }

    mediaFilter(req: Request, file: Express.Multer.File, cb: any) {
      const ext = file.mimetype;
      if (ext.startsWith("image")) cb(null, true);
      else cb(new AppError(400, "file is not the image"), false);
    }
  };

export default MulterConfig;
