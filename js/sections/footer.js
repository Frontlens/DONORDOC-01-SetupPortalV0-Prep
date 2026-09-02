/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
export function initFooterYear() {
  try {
    const yearEl = document.getElementById("footer-year");
    if (!yearEl) return;

    const currentYear = new Date().getFullYear();
    yearEl.textContent = currentYear;
    yearEl.setAttribute("datetime", String(currentYear));
  } catch (err) {
    console.error("Footer year init error:", err);
  }
}

function wireFooterAccordion(footer) {
  const groups = Array.from(footer.querySelectorAll(".footer__nav-group"));
  if (!groups.length) return;

  const mq = window.matchMedia("(max-width: 991.98px)");

  const closePanel = (group, panel, trigger) => {
    if (!group.classList.contains("is-open")) return;

    group.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");

    panel.style.transition = "height 350ms ease-out, opacity 350ms ease-out";
    panel.style.height = `${panel.scrollHeight}px`;
    panel.style.opacity = "1";

    requestAnimationFrame(() => {
      panel.style.height = "0px";
      panel.style.opacity = "0";
    });

    const onCloseEnd = (event) => {
      if (event.propertyName !== "height") return;
      panel.removeEventListener("transitionend", onCloseEnd);
      panel.hidden = true;
      panel.style.height = "";
      panel.style.opacity = "";
      panel.style.transition = "";
    };

    panel.addEventListener("transitionend", onCloseEnd);
  };

  const openPanel = (group, panel, trigger) => {
    group.classList.add("is-open");
    panel.hidden = false;
    panel.style.transition = "height 350ms ease-out, opacity 350ms ease-out";
    panel.style.height = "0px";
    panel.style.opacity = "0";

    const targetHeight = panel.scrollHeight;

    requestAnimationFrame(() => {
      panel.style.height = `${targetHeight}px`;
      panel.style.opacity = "1";
    });

    const onOpenEnd = (event) => {
      if (event.propertyName !== "height") return;
      panel.removeEventListener("transitionend", onOpenEnd);
      panel.style.height = "auto";
      trigger.setAttribute("aria-expanded", "true");
    };

    panel.addEventListener("transitionend", onOpenEnd);
  };

  const resetDesktopPanels = () => {
    groups.forEach((group) => {
      const trigger = group.querySelector(".footer__nav-trigger");
      const panel = group.querySelector(".footer__nav-panel");
      if (!trigger || !panel) return;

      group.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      panel.hidden = false;
      panel.style.height = "";
      panel.style.opacity = "";
      panel.style.transition = "";
    });
  };

  const bindAccordion = () => {
    groups.forEach((group) => {
      const trigger = group.querySelector(".footer__nav-trigger");
      const panel = group.querySelector(".footer__nav-panel");
      if (!trigger || !panel) return;

      if (trigger.dataset.footerBound === "true") return;
      trigger.dataset.footerBound = "true";

      trigger.addEventListener("click", () => {
        if (!mq.matches) return;

        const isOpen = group.classList.contains("is-open");

        if (isOpen) {
          closePanel(group, panel, trigger);
          return;
        }

        groups.forEach((otherGroup) => {
          if (otherGroup === group) return;
          const otherTrigger = otherGroup.querySelector(".footer__nav-trigger");
          const otherPanel = otherGroup.querySelector(".footer__nav-panel");
          if (otherTrigger && otherPanel) {
            closePanel(otherGroup, otherPanel, otherTrigger);
          }
        });

        openPanel(group, panel, trigger);
      });
    });
  };

  const syncMode = () => {
    if (mq.matches) {
      groups.forEach((group) => {
        const trigger = group.querySelector(".footer__nav-trigger");
        const panel = group.querySelector(".footer__nav-panel");
        if (!trigger || !panel || group.classList.contains("is-open")) return;
        panel.hidden = true;
        panel.style.height = "0px";
        panel.style.opacity = "0";
        trigger.setAttribute("aria-expanded", "false");
      });
    } else {
      resetDesktopPanels();
    }
  };

  bindAccordion();
  syncMode();

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", syncMode);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(syncMode);
  }
}

export function initFooterAccordion() {
  try {
    const footer = document.getElementById("footer");
    if (!footer) return;
    wireFooterAccordion(footer);
  } catch (e) {
    console.error("initFooterAccordion error:", e);
  }
}
