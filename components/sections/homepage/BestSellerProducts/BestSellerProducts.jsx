"use client";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Thumb } from "@/components/Thumb/Thumb";
import { useQuery } from "@tanstack/react-query";
import { list } from "@/api/api";

const LoadingSkeleton = () => (
  <div className={`flex gap-[25px]`}>
    <div className="flex h-[340px] w-full animate-pulse bg-slate-300"></div>
    <div className="hidden h-[340px] w-full animate-pulse bg-slate-300 sm:flex"></div>
    <div className="hidden h-[340px] w-full animate-pulse bg-slate-300 lg:flex"></div>
    <div className="hidden h-[340px] w-full animate-pulse bg-slate-300 2xl:flex"></div>
  </div>
);

const BestSellerProducts = () => {
  const { data: products } = useQuery({
    queryKey: ["best_sell"],
    queryFn: async () => {
      return await list(`/products/section/list/best_sell`).then((res) => {
        return res?.payload?.items;
      });
    },
    refetchOnWindowFocus: false,
  });

  const swiperRef = useRef(null);
  const thumbRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [isSwiperReady, setSwiperReady] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(50);

  useEffect(() => {
    if (products && products.length > 0) {
      setSwiperReady(true);
    }
  }, [products]);

  useEffect(() => {
    if (!products) return;

    const updateShowArrows = () => {
      const screenWidth = window.innerWidth;
      let slidesPerView = 1;

      if (screenWidth >= 1440) slidesPerView = 4;
      else if (screenWidth >= 1024) slidesPerView = 3;
      else if (screenWidth >= 640) slidesPerView = 2;

      setShowArrows(products.length > slidesPerView);
    };

    updateShowArrows();
    window.addEventListener("resize", updateShowArrows);
    return () => window.removeEventListener("resize", updateShowArrows);
  }, [products]);

  useEffect(() => {
    if (thumbRef.current) {
      setThumbHeight(thumbRef.current.clientHeight);
    }
  }, [isSwiperReady]);

  if (!products || products?.length == 0) {
    return <></>;
  }

  return (
    <div className="sectionWidth mt-8 lg:mt-12">
      <div className="relative mx-auto">
        {!isSwiperReady ? (
          <LoadingSkeleton />
        ) : (
          <>
            <Swiper
              data-aos="fade-up"
              modules={[Autoplay]}
              slidesPerView={1}
              spaceBetween={12}
              loop={true}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1440: { slidesPerView: 4 },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className={`${showArrows ? "!mx-[60px]" : ""}`}
            >
              {products?.map((product, index) => (
                <SwiperSlide key={index}>
                  <Thumb
                    ref={thumbRef}
                    slug={product.slug}
                    category_id={product.id ?? "*"}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
        {showArrows && (
          <>
            <button
              data-aos="fade-up"
              className="absolute left-0 top-0 z-[50] flex w-10 items-center justify-center bg-gray"
              style={{ height: `${thumbHeight}px` }}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <Image
                src="/icons/chevron.png"
                alt="Arrow"
                width={24}
                height={24}
                className="rotate-90"
              />
            </button>
            <button
              data-aos="fade-up"
              className="absolute right-0 top-0 z-10 flex w-10 items-center justify-center bg-gray"
              style={{ height: `${thumbHeight}px` }}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <Image
                src="/icons/chevron.png"
                alt="Arrow"
                width={24}
                height={24}
                className="-rotate-90"
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BestSellerProducts;
