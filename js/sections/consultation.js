/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
import { getSiteConfig } from "../utilities/site-config.js";

const DROP_CLOSE_MS = 360;
const PICKER_CLOSE_MS = 200;

function stillShowing(el) {
  if (!el) return false;
  const style = getComputedStyle(el);
  return style.visibility !== "hidden" && parseFloat(style.opacity) > 0.02;
}

function afterClose(el, fallbackMs) {
  return new Promise((resolve) => {
    if (!el) {
      resolve();
      return;
    }
    const duration = getComputedStyle(el).transitionDuration || "";
    if (duration.split(",").every((part) => parseFloat(part) === 0)) {
      resolve();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      el.removeEventListener("transitionend", onEnd);
      resolve();
    };
    const seen = new Set();
    const onEnd = (event) => {
      if (event.target !== el) return;
      seen.add(event.propertyName);
      const dropDone = seen.has("opacity") && seen.has("max-height");
      const pickerDone = seen.has("opacity") && seen.has("transform");
      if (dropDone || pickerDone) finish();
    };
    el.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, fallbackMs);
  });
}

function closeOpenControls(selects, pickers) {
  const waits = [];
  selects.forEach((select) => {
    const options = select.querySelector("[data-select-options]");
    if (!options) return;
    if (options.classList.contains("show-drop")) {
      options.classList.remove("show-drop");
      waits.push(afterClose(options, DROP_CLOSE_MS));
    } else if (stillShowing(options)) {
      waits.push(afterClose(options, DROP_CLOSE_MS));
    }
  });
  pickers.forEach((picker) => {
    if (!picker || !picker.popover) return;
    if (picker.isOpen) {
      picker.close(false);
      waits.push(afterClose(picker.popover, PICKER_CLOSE_MS));
    } else if (stillShowing(picker.popover)) {
      waits.push(afterClose(picker.popover, PICKER_CLOSE_MS));
    }
  });
  return Promise.all(waits);
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
    let switchToken = 0;

    const armSwitch = () => {
      switchToken += 1;
      return switchToken;
    };

    const outgoing = (exceptPicker) => {
      if (activeSelect) return true;
      return pickers.some((item) => {
        if (item === exceptPicker) return false;
        return item.isOpen || stillShowing(item.popover);
      }) || [...selects].some((select) => {
        const options = select.querySelector("[data-select-options]");
        return options?.classList.contains("show-drop") || stillShowing(options);
      });
    };

    const holdForOthers = (picker) => {
      if (!outgoing(picker)) return;
      const token = armSwitch();
      activeSelect = null;
      closeOpenControls(
        selects,
        pickers.filter((item) => item !== picker),
      ).then(() => {
        if (token !== switchToken) return;
        picker.open();
      });
      return false;
    };

    if (typeof window.FLDatePicker === "function") {
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
    }

    selects.forEach((select) => {
      const selected = select.querySelector("[data-select-value]");
      const options = select.querySelector("[data-select-options]");
      if (!selected || !options) return;

      selected.addEventListener("click", function (e) {
        e.stopPropagation();

        const token = armSwitch();

        if (select === activeSelect) {
          options.classList.remove("show-drop");
          activeSelect = null;
          return;
        }

        activeSelect = null;
        closeOpenControls(selects, pickers).then(() => {
          if (token !== switchToken) return;
          options.classList.add("show-drop");
          activeSelect = select;
        });
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
      armSwitch();
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
