"use client";
import RenderSlimBanner from "./RenderSlimBanner";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/api";
const SlimBanner = () => {
  const { data: banners } = useQuery({
    queryKey: ["banner_1"],
    queryFn: async () => {
      return await get(`/banners/banner_1`).then((res) => {
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  const { data: mobileBanners } = useQuery({
    queryKey: ["banner_1_mobile"],
    queryFn: async () => {
      return await get(`/banners/banner_1_mobile`).then((res) => {
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="sectionWidth mt-8 lg:mt-12" data-aos="fade-up">
      <div className={`max-md:hidden`}>
        {banners && <RenderSlimBanner banners={banners} />}
      </div>
      <div className={`md:hidden`}>
        {mobileBanners && <RenderSlimBanner banners={mobileBanners} />}
      </div>
    </div>
  );
};

export default SlimBanner;
