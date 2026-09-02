/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/

export function initSwiperAutoplayInView(swipers) {
  const active = (swipers || []).filter((swiper) => swiper && swiper.el);
  if (!active.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const swiper = active.find((item) => item.el === entry.target);
        if (!swiper || !swiper.autoplay) return;
        if (entry.isIntersecting) {
          swiper.autoplay.start();
        } else {
          swiper.autoplay.stop();
        }
      });
    },
    { threshold: 0.5 },
  );

  active.forEach((swiper) => {
    observer.observe(swiper.el);
  });
}
