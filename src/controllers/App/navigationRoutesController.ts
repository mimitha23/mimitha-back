import { Async } from "../../lib";
import { NavRoutes, Nav } from "../../models";

export const createNavRoute = Async(async function (req, res, next) {});

async function createRoutes() {
  const routes = [
    {
      ka: "ფასდაკლება",
      en: "sale",
      query: "sale",
    },
    {
      ka: "ყველაზე პოპულარული",
      en: "the most popular",
      query: "popular",
    },
    {
      ka: "შემოსაცმელი",
      en: "to wear",
      query: "wear",
    },
    {
      ka: "ჟილეტი",
      en: "gilet",
      query: "gilet",
    },
    {
      ka: "პალტო",
      en: "coat",
      query: "coat",
    },
    {
      ka: "ჟაკეტი",
      en: "jacket",
      query: "jacket",
    },
    {
      ka: "პულოვერი",
      en: "pullover",
      query: "pullover",
    },
    {
      ka: "მაისური",
      en: "t-shirt",
      query: "t-shirt",
    },
    {
      ka: "პოლო",
      en: "polo",
      query: "polo",
    },
    {
      ka: "პერანგი",
      en: "shirt",
      query: "shirt",
    },
    {
      ka: "ჰუდი",
      en: "hood",
      query: "hood",
    },
    {
      ka: "ნაჭრის შარვალი",
      en: "fabric trousers",
      query: "fabric-trousers",
    },
    {
      ka: "სპორტული შარვალი",
      en: "sport trousers",
      query: "sport-trousers",
    },
    {
      ka: "კარგო შარვალი",
      en: "cargo trousers",
      query: "cargo-trousers",
    },
    {
      ka: "ჯინსის შარვალი",
      en: "jeans",
      query: "jeans",
    },
    {
      ka: "ვილვეტის შარვალი",
      en: "velvet trousers",
      query: "velvet-trousers",
    },
    {
      ka: "ჩაჩები",
      en: "chachi",
      query: "chachi",
    },
    {
      ka: "წელის ჩანთა",
      en: "waist bag",
      query: "waist-bag",
    },
    {
      ka: "ხელჩანთა",
      en: "handbag",
      query: "handbag",
    },
    {
      ka: "რუგზაკი",
      en: "backpack",
      query: "backpack",
    },
    {
      ka: "მესენჯერი",
      en: "messenger",
      query: "messenger",
    },
    {
      ka: "კლასიკური",
      en: "classic",
      query: "classic",
    },
    {
      ka: "ყოველდღიური",
      en: "everyday",
      query: "everyday",
    },
    {
      ka: "თბილი წინდები",
      en: "warm socks",
      query: "warm-socks",
    },
    {
      ka: "სტანდარტული წინდები",
      en: "regullar socks",
      query: "regullar-socks",
    },
    {
      ka: "კლასიკური წინდები",
      en: "classic socks",
      query: "classic-socks",
    },
    {
      ka: "დაბალყელიანი წინდები",
      en: "short socks",
      query: "short-socks",
    },
    {
      ka: "მაღალყელიანი წინდები",
      en: "long socks",
      query: "long-socks",
    },
    {
      ka: "შიდა მაისური მკლავებით",
      en: "undershirt with sleeves",
      query: "undershirt-with-sleeves",
    },
    {
      ka: "შიდა მაისური მკლავების გარეშე",
      en: "Undershirt without sleeves",
      query: "undershirt-without-sleeves",
    },
    {
      ka: "სამკაულები",
      en: "accessories",
      query: "accessories",
    },
    {
      ka: "აჭიმები",
      en: "stretch",
      query: "stretch",
    },
    {
      ka: "სათვალე",
      en: "glasses",
      query: "glasses",
    },
    {
      ka: "ქამარი",
      en: "belt",
      query: "belt",
    },
    {
      ka: "სპორტული ორეული",
      en: "sports double",
      query: "sports,double",
    },
    {
      ka: "ნაჭრის კლასიკური ორეული",
      en: "fabric classic double",
      query: "fabric,double",
    },
    {
      ka: "ჟილეტი და სპორტული",
      en: "gilet and sportwear",
      query: "gilet,sportwear",
    },
    {
      ka: "ტოპი და ხელჩანთა",
      en: "top and bag",
      query: "top,bag",
    },
    {
      ka: "ბოთომი და ხელჩანთა",
      en: "bottom and bag",
      query: "bottom,bag",
    },
    {
      ka: "პოლო და ნაჭრის შარვალი",
      en: "polo and fabric trousers",
      query: "polo,fabric-trousers",
    },
    {
      ka: "პერანგი და ნაჭრის შარვალი",
      en: "t-shirt and fabric trousers",
      query: "t-shirt,fabric-trousers",
    },
    {
      ka: "შემოსაცმელი და შარვალი",
      en: "to wear and trousers",
      query: "top-wear,trousers",
    },
    {
      ka: "ტოპი და წელის ჩანთა",
      en: "top and waist bag",
      query: "top,waist-bag",
    },
    {
      ka: "ბოთომი და წელის ჩანთა",
      en: "bottom and waist bag",
      query: "bottom,waist-bag",
    },
    {
      ka: "ქამარი და წელის ჩანთა",
      en: "belt and waist bag",
      query: "belt,waist-bag",
    },
  ];

  await Promise.all(
    routes.map(async (r) => {
      await NavRoutes.create(r);
    })
  );
}
