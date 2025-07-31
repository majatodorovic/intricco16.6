import { get, list } from "@/api/api";
import { headers } from "next/headers";
import { generateOrganizationSchema } from "@/_functions";
import BannerWithProducts from "@/components/sections/homepage/BannerWithProducts/BannerWithProducts";
import RecommendedCategories from "@/components/sections/homepage/RecommendedCategories/RecommendedCategories";
import Slider from "@/components/sections/homepage/Slider/Slider";
import SlimBanner from "@/components/sections/homepage/SlimBanner/SlimBanner";
import PromoBanner from "@/components/sections/homepage/PromoBanner/PromoBanner";
import BestSellerProducts from "@/components/sections/homepage/BestSellerProducts/BestSellerProducts";
import Retails from "@/components/sections/homepage/Retails/Retails";

const getSliders = async () => {
  return get("/banners/index_slider").then((res) => res?.payload);
};
const getMobileSliders = async () => {
  return get("/banners/index_slider_mobile").then((res) => res?.payload);
};
const getBannerBeforeProducts = async () => {
  return get("/banners/banner_2").then((res) => res?.payload);
};
const getMobileBannerBeforeProducts = async () => {
  return get("/banners/banner_2_mobile").then((res) => res?.payload);
};

const getRecommendedProducts = async () => {
  return list("/products/section/list/recommendation?limit=4").then(
    (res) => res?.payload?.items,
  );
};

const getRecomendedCategories = async () => {
  return list("/categories/section/recommended?limit=3").then(
    (res) => res?.payload,
  );
};

const Home = async () => {
  const [
    sliders,
    mobileSliders,
    bannerBeforeProducts,
    mobileBannerBeforeProducts,
    recommendedCategories,
    recommendedProducts,
  ] = await Promise.all([
    getSliders(),
    getMobileSliders(),
    getBannerBeforeProducts(),
    getMobileBannerBeforeProducts(),
    getRecomendedCategories(),
    getRecommendedProducts(),
  ]);

  let all_headers = headers();
  let base_url = all_headers.get("x-base_url");

  let schema = generateOrganizationSchema(base_url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="relative block overflow-hidden">
        <div className="relative block" id="slider">
          <Slider banners={sliders} mobileBanners={mobileSliders} />
        </div>
        <RecommendedCategories categories={recommendedCategories} />

        <SlimBanner />
        <BannerWithProducts
          banners={bannerBeforeProducts}
          mobileBanners={mobileBannerBeforeProducts}
          products={recommendedProducts}
        />
        <PromoBanner />
        <BestSellerProducts />
        <Retails />
      </div>
    </>
  );
};

export default Home;

export const revalidate = 30;

const getSEO = () => {
  return get("/homepage/seo").then((response) => response?.payload);
};

export const generateMetadata = async () => {
  const data = await getSEO();
  const header_list = headers();
  let canonical = header_list.get("x-pathname");

  const shareImage =
    data?.social?.share_image ||
    "https://www.intriccounderwear.rs/images/logo/logo.png";

  return {
    title: data?.meta_title ?? "Početna | Intricco Underwear",
    description:
      data?.meta_description ?? "Dobrodošli na Intricco Underwear Online Shop",
    alternates: {
      canonical: data?.meta_canonical_link ?? canonical,
    },
    robots: {
      index: data?.meta_robots?.index ?? true,
      follow: data?.meta_robots?.follow ?? true,
    },
    openGraph: {
      title: data?.social?.share_title ?? "Početna | Intricco Underwear",
      description:
        data?.social?.share_description ??
        "Dobrodošli na Intricco Underwear Online Shop",
      type: "website",
      images: [
        {
          url: shareImage,
          width: 800,
          height: 600,
          alt: "Intricco Underwear",
        },
      ],
      locale: "sr_RS",
    },
  };
};
