import { model, Schema } from "mongoose";

const SeasonSchema = new Schema({
  ka: String,
  en: String,
  query: String,
});

const Season = model("Season", SeasonSchema);
export default Season;
