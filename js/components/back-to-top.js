/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
import { throttle } from "../utilities/throttle.js";

export function initBackToTop() {
  const goTopButton = document.getElementById("up-arrow");
  if (!goTopButton) return;

  // Use throttled scroll event for better performance
  window.addEventListener(
    "scroll",
    throttle(function () {
      goTopButton.classList.toggle("show", window.scrollY > 300);
    }, 100),
  );

  goTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
