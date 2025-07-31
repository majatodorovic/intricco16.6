"use client";
import RenderPromoBanner from "./RenderPromoBanner";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/api";

const PromoBanner = () => {
  const { data: banners } = useQuery({
    queryKey: ["promo_page_banner"],
    queryFn: async () => {
      return await get(`/banners/promo_page_banner`).then((res) => {
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  const { data: mobileBanners } = useQuery({
    queryKey: ["promo_page_banner_mobile"],
    queryFn: async () => {
      return await get(`/banners/promo_page_banner_mobile`).then((res) => {
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="sectionWidth mt-8 lg:mt-12" data-aos="fade-up">
      <div className={`max-md:hidden`}>
        {banners && <RenderPromoBanner banners={banners} />}
      </div>
      <div className={`md:hidden`}>
        {mobileBanners && <RenderPromoBanner banners={mobileBanners} />}
      </div>
    </div>
  );
};

export default PromoBanner;
