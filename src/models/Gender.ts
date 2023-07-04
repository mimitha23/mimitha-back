import { model, Schema } from "mongoose";

const GenderSchema = new Schema({
  ka: String,
  en: String,
  query: String,
});

const Gender = model("Gender", GenderSchema);
export default Gender;
