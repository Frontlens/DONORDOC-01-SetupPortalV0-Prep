/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
export function initLazyImages() {
  document.querySelectorAll("header img").forEach((img) => {
    img.loading = "eager";
    img.decoding = "async";
    if (!img.hasAttribute("fetchpriority")) {
      img.setAttribute("fetchpriority", "high");
    }
  });
}
