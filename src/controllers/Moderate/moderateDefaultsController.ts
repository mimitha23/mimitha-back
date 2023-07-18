import { Async } from "../../lib";
import { Seasons, Category, Gender } from "../../models";

export const createDBDefaults = Async(async function (req, res, next) {
  const seasons = [
    {
      ka: "გაზაფხული",
      en: "spring",
      query: "spring",
    },
    {
      ka: "ზაფხული",
      en: "summer",
      query: "summer",
    },
    {
      ka: "შემოდგომა",
      en: "autumn",
      query: "autumn",
    },
    {
      ka: "ზამთარი",
      en: "winter",
      query: "winter",
    },
  ];

  await Promise.all(
    seasons.map(async (season) => {
      await Seasons.create({
        ka: season.ka,
        en: season.en,
        query: season.query,
      });
    })
  );

  const gender = [
    {
      ka: "მამაკაცი",
      en: "male",
      query: "male",
    },
    {
      ka: "ქალბატონი",
      en: "female",
      query: "female",
    },
    {
      ka: "უნისექსი",
      en: "unisex",
      query: "unisex",
    },
  ];

  await Promise.all(
    gender.map(async (gender) => {
      await Gender.create({
        ka: gender.ka,
        en: gender.en,
        query: gender.query,
      });
    })
  );

  const categories = [
    { ka: "მამაკაცი", en: "male", query: "male" },
    { ka: "ქალბატონი", en: "female", query: "female" },
    { ka: "საოჯახო", en: "family", query: "family" },
    { ka: "მოზარდი", en: "adult", query: "adult" },
  ];

  await Promise.all(
    categories.map(async (category) => {
      await Category.create({
        ka: category.ka,
        en: category.en,
        query: category.query,
      });
    })
  );

  res.status(201).json("defaults are created");
});
