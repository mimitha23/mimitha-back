import { Field } from "multer";
import { FileUploadT } from "./utils.types";

export type MulterUploadFieldT = string;
export type MulterUploadFieldsT = Field[];

export interface MulterConfigT {
  upload: FileUploadT["upload"];
  storage: FileUploadT["storage"];
  destination: FileUploadT["destination"];
  filename: MulterUploadFieldT | MulterUploadFieldsT;
  contentType: "image" | "video" | "any";
}

export interface CreateMulterDestinationT {
  destination: FileUploadT["destination"];
  storage: FileUploadT["storage"];
}
