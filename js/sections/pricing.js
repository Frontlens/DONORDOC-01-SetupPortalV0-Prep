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

  const pricingSwiper = new window.Swiper(root, {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: false,
    initialSlide: 1,
    grabCursor: true,
    allowTouchMove: true,
    speed: 600,
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
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 16,
        centeredSlides: true,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 24,
        centeredSlides: false,
      },
    },
  });

  initSwiperAutoplayInView([pricingSwiper]);
}
