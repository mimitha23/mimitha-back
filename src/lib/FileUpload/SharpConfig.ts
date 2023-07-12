import sharp from "sharp";
import {
  SharpWriteOnDisk,
  SharpEditAndWriteOnDiskT,
  FileT,
} from "./fileupload";

const SharpConfig = (Base?: any) =>
  class extends Base {
    constructor() {
      super();
    }

    ////////////////////
    // Write On Disk //
    //////////////////

    // write
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

    // edit and write
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

    //////////////
    // Convert //
    ////////////

    // Convert Single
    async convertFile(file: FileT): Promise<FileT> {
      try {
        return await this.convert(file);
      } catch (error) {
        throw error;
      }
    }

    // Convert Multiple Files
    async convertMultipleFiles(files: FileT[]): Promise<FileT[]> {
      try {
        return await Promise.all(
          files.map(async (file) => this.convertFile(file))
        );
      } catch (error) {
        throw error;
      }
    }

    async convert(file: FileT): Promise<FileT> {
      try {
        const fileBuffer = file.buffer;
        const convertedImage = await sharp(fileBuffer)
          .toFormat(this.format)
          .webp({ quality: this.quality })
          .toBuffer();

        return this.generateFileObjectFromBuffer(file, convertedImage);
      } catch (error) {
        throw error;
      }
    }

    async editAndConvert({ file, fileName }: SharpEditAndWriteOnDiskT) {
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
