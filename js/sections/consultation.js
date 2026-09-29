/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
import { getSiteConfig } from "../utilities/site-config.js";
import {
  loadScript,
  loadStylesheet,
  whenNear,
} from "../utilities/swiper-inview.js";

function stillShowing(el) {
  if (!el) return false;
  const style = getComputedStyle(el);
  return style.visibility !== "hidden" && parseFloat(style.opacity) > 0.02;
}

function snapHide(el) {
  el.classList.add("is-instant");
  el.classList.remove("show-drop");
  void el.offsetWidth;
  el.classList.remove("is-instant");
}

export function initConsultationSection() {
  try {
    const section = document.querySelector('[data-section="consultation"]');
    if (!section) return;

    const scheduling = getSiteConfig()?.sections?.consultation?.scheduling || {};
    const fields = getSiteConfig()?.sections?.consultation?.form?.fields || {};

    const pickers = [];
    const selects = section.querySelectorAll("[data-select]");
    let activeSelect = null;

    const dismissOthers = (exceptSelect, exceptPicker) => {
      selects.forEach((select) => {
        if (select === exceptSelect) return;
        const options = select.querySelector("[data-select-options]");
        if (!options) return;
        if (!options.classList.contains("show-drop") && !stillShowing(options)) return;
        snapHide(options);
      });
      pickers.forEach((picker) => {
        if (!picker || picker === exceptPicker || !picker.popover) return;
        if (!picker.isOpen && !stillShowing(picker.popover)) return;
        picker.popover.classList.add("is-instant");
        picker.close(false);
        void picker.popover.offsetWidth;
        picker.popover.classList.remove("is-instant");
      });
      if (activeSelect && activeSelect !== exceptSelect) activeSelect = null;
    };

    const holdForOthers = (picker) => {
      dismissOthers(null, picker);
    };

    whenNear(section, function () {
      Promise.all([
        loadStylesheet("css/vendor/fl-datepicker.css"),
        loadScript("js/vendor/fl-datepicker.js"),
      ]).then(function () {
        if (typeof window.FLDatePicker !== "function") return;
        const dateEl = document.getElementById("consultation-date");
        const timeEl = document.getElementById("consultation-time");

        if (dateEl) {
          pickers.push(
            new window.FLDatePicker(dateEl, {
              type: "date",
              placeholder: fields.preferredDate?.placeholder || "Select date",
              disablePast: true,
              closeOnSelect: false,
              closeOnSelectDelay: 400,
              onOpen: holdForOthers,
            }),
          );
        }

        if (timeEl) {
          pickers.push(
            new window.FLDatePicker(timeEl, {
              type: "time",
              timeStep: scheduling.timeStepMinutes || 15,
              timeStartMinutes: 9 * 60,
              timeEndMinutes: 23 * 60 + 45,
              placeholder: fields.preferredTime?.placeholder || "Select time",
              closeOnSelect: false,
              closeOnSelectDelay: 400,
              disabledTimes: scheduling.disabledTimes || [],
              onOpen: holdForOthers,
            }),
          );
        }
      });
    });

    selects.forEach((select) => {
      const selected = select.querySelector("[data-select-value]");
      const options = select.querySelector("[data-select-options]");
      if (!selected || !options) return;

      selected.addEventListener("click", function (e) {
        e.stopPropagation();

        if (select === activeSelect) {
          options.classList.remove("show-drop");
          activeSelect = null;
          return;
        }

        dismissOthers(select, null);
        options.classList.add("show-drop");
        activeSelect = select;
      });

      selected.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selected.click();
        }
      });

      select.querySelectorAll("[data-select-option]").forEach((option) => {
        option.addEventListener("click", function (e) {
          e.stopPropagation();
          selected.textContent = this.textContent;
          selected.classList.remove("is-placeholder");
          options.classList.remove("show-drop");
          activeSelect = null;
        });
      });
    });

    document.addEventListener("click", function () {
      if (!activeSelect) return;
      const options = activeSelect.querySelector("[data-select-options]");
      if (options) options.classList.remove("show-drop");
      activeSelect = null;
    });

    const form = section.querySelector("[data-consultation-form]");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const coverage =
          section
            .querySelector("#consultation-coverage [data-select-value]")
            ?.textContent.trim() || "";
        const contactMethod =
          section
            .querySelector("#consultation-contact [data-select-value]")
            ?.textContent.trim() || "";

        const payload = {
          date:
            section
              .querySelector("#consultation-date .fl-picker-input")
              ?.value.trim() || "",
          time:
            section
              .querySelector("#consultation-time .fl-picker-input")
              ?.value.trim() || "",
          coverageType: coverage,
          contactMethod,
          firstName:
            section.querySelector("#consultation-first-name")?.value.trim() ||
            "",
          lastName:
            section.querySelector("#consultation-last-name")?.value.trim() ||
            "",
          email:
            section.querySelector("#consultation-email")?.value.trim() || "",
          phone:
            section.querySelector("#consultation-phone")?.value.trim() || "",
          notes:
            section.querySelector("#consultation-notes")?.value.trim() || "",
        };

        alert(JSON.stringify(payload, null, 2));
      });
    }
  } catch (err) {
    console.error("initConsultationSection error:", err);
  }
}
