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

  const docs = await Nav.find(queryObj).populate({ path: "blocks.routes" });

  res.status(200).json(docs);
});

export const saveNav = Async(async function (req, res, next) {
  const body = req.body;

  await Promise.all(
    Object.keys(body).map(async (key) => {
      await Nav.findOneAndUpdate(
        { category: key },
        {
          $set: {
            blocks: body[key].blocks.map((block: any) => ({
              title: block.title,
              routes: block.routes,
            })),
          },
        }
      );
    })
  );

  const nav = await Nav.find().populate({ path: "blocks.routes" });

  res.status(201).json(nav);
});
