import sharp, { AvailableFormatInfo, FormatEnum } from "sharp";
import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";
import multer from "multer";

export default class FileUpload {
  upload;
  storage;
  destination;
  multy;
  quality;
  format;
  resize;
  width;
  height;

  constructor({
    // multer
    upload = "any",
    storage = "diskStorage",
    destination = "",
    // sharp
    multy = true,
    quality = 90,
    format = "webp",
    resize = false,
    width = 500,
    height = undefined,
  }: MulterT) {
    // multer params
    this.upload = upload;
    this.storage = storage;
    this.destination = destination;

    // sharp params
    this.multy = multy;
    this.quality = quality;
    this.format = format;
    this.resize = resize;
    this.width = width;
    this.height = height;
  }

  uploadMedia({ filename }: UploadMediaT) {
    return this.multerConfig({
      filename,
      destination: this.destination,
      upload: this.upload,
      storage: this.storage,
    });
  }

  editMedia() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const key = this.multy ? "files" : "file";

      if (!req[key]) return next();

      const media = key === "files" ? [...[req[key]]] : req[key];

      const isArray = Array.isArray(media);

      const currentDate = Date.now();

      if (!isArray) {
        const { fileName, editedFileName } = this.generateFileName({
          currentDate,
          userId: req.user.id,
        });

        await this.writeOnDisk({
          file: media.buffer,
          fileName,
          editedFileName,
        });

        if (this.resize) req.editedFileName = editedFileName;

        req.originalFileName = fileName;
      } else if (isArray) {
        const editedFileNames: string[] = [];
        const originalFileNames: string[] = [];

        await Promise.allSettled(
          media.map(async (file, index) => {
            const { fileName, editedFileName } = this.generateFileName({
              currentDate,
              sufix: index + 1,
              userId: req.user.id,
            });

            await this.writeOnDisk({
              fileName,
              file: file[0].buffer,
              editedFileName,
            });

            if (this.resize) editedFileNames.push(editedFileName);

            originalFileNames.push(fileName);
          })
        );

        if (this.resize) req.editedFileName = editedFileNames;
        req.originalFileName = originalFileNames;
      }

      next();
    };
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

  async writeOnDisk({ file, fileName, editedFileName }: SharpWriteOnDisk) {
    try {
      await sharp(file)
        .toFormat(this.format)
        .webp({ quality: this.quality })
        .toFile(`${this.destination}${fileName}`);

      if (this.resize)
        await this.editAndWriteOnDisk({ file, fileName: editedFileName });

      return fileName;
    } catch (error) {
      throw error;
    }
  }

  async editAndWriteOnDisk({ file, fileName }: SharpEditAndWriteOnDiskT) {
    try {
      await sharp(file)
        .resize(this.width, this.height)
        .toFormat(this.format)
        .webp({ quality: this.quality })
        .toFile(`${this.destination}${fileName}`);
    } catch (error) {
      throw error;
    }
  }

  generateFileName({ userId, sufix = 1, currentDate }: GenerateFileNameT) {
    const prefix = `user-${userId}-${currentDate}`;

    const widthStr = !this.resize ? "" : this.width;
    const heightStr = !this.resize
      ? ""
      : this.height
      ? `x${this.height}`
      : "xAuto";

    const sufixStr = `original-${sufix}`;
    const sufixEditedStr = `resized-${sufix}`;

    const fileName = (sfx: string) =>
      `${prefix}--${widthStr}${heightStr}${sfx}.webp`;

    return {
      fileName: fileName(sufixStr),
      editedFileName: fileName(sufixEditedStr),
    };
  }
}

interface MulterT {
  upload: "single" | "any";
  storage: "memoryStorage" | "diskStorage";
  destination?: string;
  multy?: boolean;
  quality?: number;
  format?: keyof FormatEnum | AvailableFormatInfo;
  resize?: boolean;
  width?: number;
  height?: number | undefined;
}

interface UploadMediaT {
  filename: string;
}

interface MulterConfigT {
  filename: string;
  destination: MulterT["destination"];
  upload: MulterT["upload"];
  storage: MulterT["storage"];
}

interface CreateMulterDestionationT {
  destination: MulterT["destination"];
  storage: MulterT["storage"];
}

interface GenerateFileNameT {
  sufix?: number;
  userId: string;
  currentDate: number;
}

interface SharpWriteOnDisk {
  file: Buffer;
  fileName: string;
  editedFileName: string;
}

interface SharpEditAndWriteOnDiskT {
  file: Buffer;
  fileName: string;
}
