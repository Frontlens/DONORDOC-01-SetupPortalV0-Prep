/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
export function initSectionVisibility() {
  try {
    fetch("config/sections.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load sections.json");
        }
        return response.json();
      })
      .then(function (config) {
        if (!config || typeof config !== "object") {
          return;
        }

        Object.keys(config).forEach(function (key) {
          var enabled = !!config[key];
          var section = document.querySelector(
            '[data-section-key="' + key + '"]',
          );

          if (!section) {
            return;
          }

          section.hidden = !enabled;
        });
      })
      .catch(function (error) {
        console.error("Error applying section visibility config:", error);
      });
  } catch (err) {
    console.error("initSectionVisibility error:", err);
  }
}
