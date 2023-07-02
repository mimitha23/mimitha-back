import { GenerateFileNameT } from "./fileupload";

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
  };

export default FileUploadUtils;
