/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
// Preloader: show secondary background with primary-colored spinner until all assets are loaded
export function initPreloader() {
  try {
    const body = document.body;
    if (!body) return;
    body.classList.add("loading");

    const preloader = document.createElement("div");
    preloader.id = "preloader";
    preloader.innerHTML =
      '<div class="preloader-spinner" role="status" aria-label="Loading"></div>';
    body.appendChild(preloader);

    window.addEventListener("load", () => {
      // Hide overlay after load; allow CSS transition to finish before removal
      preloader.classList.add("preloader-hidden");
      body.classList.remove("loading");
      setTimeout(() => preloader.remove(), 450);
    });
  } catch (err) {
    // Fail-safe: never block load if something goes wrong
    console.error("Preloader init error:", err);
  }
}
