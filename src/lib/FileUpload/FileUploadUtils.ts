import { GenerateFileNameT } from "./fileupload";
import { FileT } from "./fileupload";

const FileUploadUtils = (Base?: any) =>
  class extends Base {
    constructor() {
      super();
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

    generateFileObjectFromBuffer(file: FileT, convertedImage: any): FileT {
      return {
        fieldname: file.fieldname,
        originalname: file.originalname.replace(/\.[^/.]+$/, "") + ".webp",
        encoding: file.encoding,
        mimetype: "image/webp",
        buffer: convertedImage,
        size: convertedImage.length,
        destination: file.destination || "",
        filename: file.filename || "",
        path: file.path || "",
        stream: file.stream || "",
      };
    }
  };

export default FileUploadUtils;
