import { Async } from "../../lib";
import { Nav } from "../../models";

export const getNavigation = Async(async function (req, res, next) {
  const { category } = req.query;

  const queryObj: any = {};

  if (
    category &&
    ["men", "female", "adult", "family"].includes(category as string)
  )
    queryObj.category = category;

  const docs = await Nav.find(queryObj);

  res.status(200).json(docs);
});
