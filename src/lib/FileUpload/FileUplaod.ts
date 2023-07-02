import { Request, Response, NextFunction } from "express";

import MulterConfig from "./MulterConfig";
import SharpConfig from "./SharpConfig";
import FileUploadUtils from "./FileUploadUtils";
import FirebaseConfig from "./FirebaseConfig";

import {
  FileUploadT,
  UploadMediaT,
  UploadFileOnFirebaseT,
  UpdateFileOnFirebaseT,
} from "./fileupload";
import { firebaseFolders } from "../../config/config";
import { uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default class FileUpload extends MulterConfig(
  SharpConfig(FileUploadUtils(FirebaseConfig))
) {
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
  }: FileUploadT) {
    super();

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

  async uploadFileOnFirebase({
    file,
    folder,
    contentType,
  }: UploadFileOnFirebaseT): Promise<string> {
    const configuredFileName = this.generateFilenameForFirebase(
      file.originalname
    );

    const storageRef = this.getStorageRef(
      `${firebaseFolders[folder]}/${configuredFileName}`
    );

    const uploadedFileRef = await uploadBytes(
      storageRef,
      Buffer.from(file.buffer),
      {
        contentType,
      }
    );

    const downloadUrl = await getDownloadURL(uploadedFileRef.ref);

    return downloadUrl;
  }

  async deleteFileOnFirebase(downloadUrl: string) {
    const filename = this.getPathStorageFromUrl(downloadUrl);
    const storageRef = this.getStorageRef(filename);
    await deleteObject(storageRef);
  }

  async updateFileOnFirebase({
    downloadUrl,
    contentType,
    file,
    folder,
  }: UpdateFileOnFirebaseT): Promise<string> {
    await this.deleteFileOnFirebase(downloadUrl);
    return await this.uploadFileOnFirebase({ contentType, file, folder });
  }
}
