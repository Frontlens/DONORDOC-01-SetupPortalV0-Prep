/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/

let swiperLoader = null;

export function loadStylesheet(href) {
  if (document.querySelector('link[rel="stylesheet"][href="' + href + '"]')) {
    return Promise.resolve();
  }
  return new Promise(function (resolve, reject) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

export function loadScript(src) {
  if (document.querySelector('script[src="' + src + '"]')) {
    return Promise.resolve();
  }
  return new Promise(function (resolve, reject) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function loadSwiper() {
  if (typeof window.Swiper === "function") return Promise.resolve();
  if (swiperLoader) return swiperLoader;
  swiperLoader = Promise.all([
    loadStylesheet("css/vendor/swiper-bundle.min.css"),
    loadScript("js/vendor/swiper-bundle.min.js"),
  ]);
  return swiperLoader;
}

export function whenNear(el, onNear, rootMargin) {
  if (!el) return;

  const run = function () {
    onNear();
  };

  if (typeof IntersectionObserver !== "function") {
    run();
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      if (!entries.some(function (entry) {
        return entry.isIntersecting;
      })) {
        return;
      }
      observer.disconnect();
      run();
    },
    { root: null, rootMargin: rootMargin || "800px", threshold: 0 },
  );

  observer.observe(el);
}

export function initSwiperAutoplayInView(swipers) {
  const active = (swipers || []).filter((swiper) => swiper && swiper.el);
  if (!active.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const swiper = entry.target.swiper;
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
