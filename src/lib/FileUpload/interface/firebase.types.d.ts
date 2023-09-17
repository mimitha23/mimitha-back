import { firebaseFolders } from "../../../config/config";

export type FileT = Express.Multer.File;

export interface UploadFileOnFirebaseT {
  file: FileT;
  folder: keyof typeof firebaseFolders;
  contentType: "image/svg+xml" | "image/webp" | "video/mp4";
  convert?: boolean;
}

export interface UpdateFileOnFirebaseT extends UploadFileOnFirebaseT {
  downloadUrl: string;
}

export interface UploadMultipleFilesOnFirebaseT
  extends Omit<UploadFileOnFirebaseT, "file"> {
  files: FileT[];
  folder: keyof typeof firebaseFolders;
  contentType: "image/svg+xml" | "image/webp";
}

export interface UpdateMultipleFilesOnFirebaseT
  extends UploadMultipleFilesOnFirebaseT {
  downloadUrls: string[];
}
