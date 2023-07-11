import sharp from "sharp";
import { SharpWriteOnDisk, SharpEditAndWriteOnDiskT } from "./fileupload";

const SharpConfig = (Base?: any) =>
  class extends Base {
    constructor() {
      super();
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

    async convertAndSaveToMemory(file: Buffer): Promise<Buffer> {
      try {
        const convertedImage = await sharp(file)
          .toFormat(this.format)
          .webp({ quality: this.quality })
          .toBuffer();

        return convertedImage;
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

    async editAndSaveToMemory({ file, fileName }: SharpEditAndWriteOnDiskT) {
      try {
        await sharp(file)
          .resize(this.width, this.height)
          .toFormat(this.format)
          .webp({ quality: this.quality })
          .toBuffer();
      } catch (error) {
        throw error;
      }
    }
  };

export default SharpConfig;
