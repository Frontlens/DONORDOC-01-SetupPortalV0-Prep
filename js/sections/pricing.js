/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/

import { initSwiperAutoplayInView } from "../utilities/swiper-inview.js";

export function initPricing() {
  const section = document.querySelector('[data-section="pricing"]');
  if (!section || typeof window.Swiper !== "function") return;

  const root = section.querySelector('[data-swiper="pricing"]');
  if (!root) return;

  const compact = window.matchMedia("(max-width: 991.98px)");
  let pricingSwiper = null;

  const mount = () => {
    const loop = compact.matches;
    if (pricingSwiper) pricingSwiper.destroy(true, true);

    pricingSwiper = new window.Swiper(root, {
      slidesPerView: loop ? 1 : 3,
      spaceBetween: loop ? 16 : 24,
      centeredSlides: loop,
      loop,
      initialSlide: 1,
      grabCursor: true,
      allowTouchMove: true,
      speed: 280,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        enabled: false,
      },
      pagination: {
        el: section.querySelector("[data-swiper-pagination]"),
        clickable: true,
      },
      navigation: {
        nextEl: section.querySelector("[data-swiper-next]"),
        prevEl: section.querySelector("[data-swiper-prev]"),
      },
      passiveListeners: true,
    });

    const rect = root.getBoundingClientRect();
    const visible =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (rect.height && visible / rect.height >= 0.5) {
      pricingSwiper.autoplay.start();
    }
  };

  mount();
  compact.addEventListener("change", mount);
  initSwiperAutoplayInView([pricingSwiper]);
}
