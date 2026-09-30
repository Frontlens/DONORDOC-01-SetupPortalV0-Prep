/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
(function () {
  var HERO_SIZES = "(max-width: 1023.98px) 75vw, 560px";
  var THEME_HERO = {
    trustGreen: "assets/images/hero-image.webp",
    professionalBlue: "assets/images/hero-professional-blue.webp",
    executiveNavy: "assets/images/hero-executive-navy.webp",
    healthcareTeal: "assets/images/hero-healthcare-teal.webp",
  };
  var THEME_SRCSET = {
    "assets/images/hero-image.webp":
      "assets/images/hero-image-742w.webp 742w, assets/images/hero-image.webp 1024w",
    "assets/images/hero-professional-blue.webp":
      "assets/images/hero-professional-blue-742w.webp 742w, assets/images/hero-professional-blue.webp 1254w",
    "assets/images/hero-executive-navy.webp":
      "assets/images/hero-executive-navy-742w.webp 742w, assets/images/hero-executive-navy.webp 1254w",
    "assets/images/hero-healthcare-teal.webp":
      "assets/images/hero-healthcare-teal-742w.webp 742w, assets/images/hero-healthcare-teal.webp 1254w",
  };

  function resolveHero(config) {
    var image =
      (config &&
        config.sections &&
        config.sections.hero &&
        config.sections.hero.image) ||
      {};
    if (image.mode === "custom" && image.customSrc) {
      return { src: image.customSrc, single: true };
    }
    var variant = config && config.theme && config.theme.variant;
    return {
      src: THEME_HERO[variant] || THEME_HERO.trustGreen,
      single: false,
    };
  }

  function applyHeroEarly(src, single) {
    var spec = single ? null : THEME_SRCSET[src] || null;
    var link = document.querySelector('link[rel="preload"][as="image"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      var css = document.querySelector('link[rel="stylesheet"]');
      if (css) document.head.insertBefore(link, css);
      else document.head.appendChild(link);
    }
    link.href = src;
    link.setAttribute("fetchpriority", "high");
    if (spec) {
      link.setAttribute("imagesrcset", spec);
      link.setAttribute("imagesizes", HERO_SIZES);
    } else {
      link.removeAttribute("imagesrcset");
      link.removeAttribute("imagesizes");
    }

    function stamp() {
      var img = document.querySelector("[data-hero-image]");
      if (!img) return;
      img.setAttribute("src", src);
      if (spec) {
        img.setAttribute("srcset", spec);
        img.setAttribute("sizes", HERO_SIZES);
      } else {
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
      }
    }

    stamp();
    if (!document.querySelector("[data-hero-image]")) {
      document.addEventListener("DOMContentLoaded", stamp);
    }
  }

  window.__donordocConfigReady = fetch("config/siteConfig.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Failed to load siteConfig.json");
      return response.json();
    })
    .then(function (config) {
      var hero = resolveHero(config);
      applyHeroEarly(hero.src, hero.single);
      return config;
    })
    .catch(function () {
      applyHeroEarly(THEME_HERO.trustGreen, false);
      return null;
    });
})();
