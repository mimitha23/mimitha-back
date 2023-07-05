import {
  TextureT,
  TextureMethodsT,
  TextureModelT,
} from "../interface/moderate/texture.types";
import { Schema, model } from "mongoose";

const TextureSchema = new Schema<TextureT, TextureModelT, TextureMethodsT>({
  ka: {
    type: String,
    required: true,
    unique: true,
  },
  en: {
    type: String,
    required: true,
    unique: true,
  },
});

const Texture = model<TextureT, TextureModelT>("Texture", TextureSchema);
export default Texture;
