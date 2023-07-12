import sharp, { AvailableFormatInfo, FormatEnum } from "sharp";
import { firebaseFolders } from "../../config/config";

export type FileT = Express.Multer.File;

export interface FileUploadT {
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

export interface UploadMediaT {
  filename: string;
}

export interface GenerateFileNameT {
  sufix?: number;
  userId: string;
  currentDate: number;
}

export interface SharpWriteOnDisk {
  file: Buffer;
  fileName: string;
  editedFileName: string;
}

export interface SharpEditAndWriteOnDiskT {
  file: Buffer;
  fileName: string;
}

export interface MulterConfigT {
  filename: string;
  destination: FileUploadT["destination"];
  upload: FileUploadT["upload"];
  storage: FileUploadT["storage"];
}

export interface CreateMulterDestionationT {
  destination: FileUploadT["destination"];
  storage: FileUploadT["storage"];
}

export interface UploadFileOnFirebaseT {
  file: FileT;
  folder: keyof typeof firebaseFolders;
  contentType: "image/svg+xml" | "image/webp";
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
