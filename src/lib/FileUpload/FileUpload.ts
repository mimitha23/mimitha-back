import { Request, Response, NextFunction } from "express";

import MulterConfig from "./MulterConfig";
import SharpConfig from "./SharpConfig";
import FileUploadUtils from "./FileUploadUtils";
import FirebaseConfig from "./FirebaseConfig";

import {
  UploadFileOnFirebaseT,
  UpdateFileOnFirebaseT,
  UploadMultipleFilesOnFirebaseT,
  UpdateMultipleFilesOnFirebaseT,
} from "./interface/firebase.types";
import { FileT } from "./interface/firebase.types";
import { FileUploadT } from "./interface/utils.types";
import { MulterConfigT } from "./interface/multer.types";
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
    destination = "/public/assets",
    // sharp
    multy = true,
    quality = 30,
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

  uploadMedia({
    filename,
    contentType = "image",
  }: {
    filename: MulterConfigT["filename"];
    contentType?: MulterConfigT["contentType"];
  }) {
    return this.multerConfig({
      filename,
      contentType,
      upload: this.upload,
      storage: this.storage,
      destination: this.destination,
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

  // Upload Single On Firebase
  async uploadFileOnFirebase({
    file,
    folder,
    contentType,
    convert = true,
  }: UploadFileOnFirebaseT): Promise<string> {
    try {
      console.log("fb upload");
      let convertedFile;
      if (convert) convertedFile = await this.convertFile(file);

      const configuredFileName = this.generateFilenameForFirebase(
        convert ? convertedFile.originalname : file.originalname
      );

      const storageRef = this.getStorageRef(
        `${firebaseFolders[folder]}/${configuredFileName}`
      );

      const uploadedFileRef = await uploadBytes(
        storageRef,
        Buffer.from(convert ? convertedFile.buffer : file.buffer),
        {
          contentType,
        }
      );

      const downloadUrl = getDownloadURL(uploadedFileRef.ref);

      return downloadUrl;
    } catch (error) {
      throw error;
    }
  }

  async deleteFileOnFirebase(downloadUrl: string): Promise<any> {
    try {
      const filename = this.getPathStorageFromUrl(downloadUrl);
      const storageRef = this.getStorageRef(filename);
      return deleteObject(storageRef);
    } catch (error) {
      throw error;
    }
  }

  async updateFileOnFirebase({
    file,
    folder,
    contentType,
    downloadUrl,
  }: UpdateFileOnFirebaseT): Promise<string> {
    try {
      if (downloadUrl) await this.deleteFileOnFirebase(downloadUrl);
      return await this.uploadFileOnFirebase({ contentType, file, folder });
    } catch (error) {
      throw error;
    }
  }

  // Upload Multiple On Firebase
  async uploadMultipleFilesOnFirebase({
    files,
    contentType,
    folder,
  }: UploadMultipleFilesOnFirebaseT): Promise<string[]> {
    try {
      const convertedFiles: FileT[] = await this.convertMultipleFiles(files);

      return await Promise.all(
        convertedFiles.map(async (file: FileT) => {
          return this.uploadFileOnFirebase({ file, contentType, folder });
        })
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteMultipleFilesOnFirebase(downloadUrls: string[]): Promise<any> {
    try {
      return await Promise.all(
        downloadUrls.map(async (url) => {
          return this.deleteFileOnFirebase(url);
        })
      );
    } catch (error) {
      throw error;
    }
  }

  async updateMultipleFilesOnFirebase({
    files,
    folder,
    contentType,
    downloadUrls,
  }: UpdateMultipleFilesOnFirebaseT): Promise<string[]> {
    try {
      if (Array.isArray(downloadUrls) && downloadUrls[0])
        await this.deleteMultipleFilesOnFirebase(downloadUrls);

      return await this.uploadMultipleFilesOnFirebase({
        contentType,
        files,
        folder,
      });
    } catch (error) {
      throw error;
    }
  }
}
