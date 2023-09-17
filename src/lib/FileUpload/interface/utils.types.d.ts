import sharp, { AvailableFormatInfo, FormatEnum } from "sharp";
import { Field } from "multer";

export interface FileUploadT {
  upload: "single" | "any" | "fields" | "array";
  storage: "memoryStorage" | "diskStorage";
  destination?: string;
  multy?: boolean;
  quality?: number;
  format?: keyof FormatEnum | AvailableFormatInfo;
  resize?: boolean;
  width?: number;
  height?: number | undefined;
}

export interface GenerateFileNameT {
  sufix?: number;
  userId: string;
  currentDate: number;
}
