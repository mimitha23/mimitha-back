import { model, Schema } from "mongoose";

const CategorySchema = new Schema({
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
  query: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category = model("Category", CategorySchema);
export default Category;
