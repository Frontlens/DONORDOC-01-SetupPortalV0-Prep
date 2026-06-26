/* 
Template Name: DONORDOC-B01 
Author: FRONTLENS LLC 
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly prohibited without written consent. 
Copyright (c) 2025 FRONTLENS LLC. All rights reserved. 
*/

// Preloader: show secondary background with primary-colored spinner until all assets are loaded
(function initPreloader() {
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
})();

// Throttle function to limit how often a function can fire
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

document.addEventListener("DOMContentLoaded", function () {
  initStickyBar();
  initStickyHeader();
  initNavScroll();
  initMobileMenu();
  initSwipers();
  initServicesReveal();
  initBackToTop();
  initCustomSelects();
  initBlogSection();
  initDropdownBehaviors();
  initLazyImages();
  initImageBlurUp();
  initFooterYear();
  initAppointmentMode();
  initSectionVisibility();
  initAppointmentPickers();
  initConsultationSection();
  initFaqAccordion();

  window.addEventListener("load", () => {
    if (location.hash == "#health-cta") window.scrollTo(0, 0);
  });
});

function initAppointmentMode() {
  try {
    const section = document.getElementById("appointment-cta");
    if (!section) return;

    const internalEl = section.querySelector(
      '[data-appointment-mode="internal"]',
    );
    const externalEl = section.querySelector(
      '[data-appointment-mode="external"]',
    );

    if (!internalEl && !externalEl) {
      console.warn(
        "initAppointmentMode: no appointment mode containers found.",
      );
      return;
    }

    fetch("assets/config/appointment.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load appointment.json");
        }
        return response.json();
      })
      .then(function (config) {
        const mode =
          config && typeof config.mode === "string"
            ? config.mode.toLowerCase()
            : "internal";

        if (mode === "external") {
          if (internalEl) {
            internalEl.remove();
          }
          if (externalEl) {
            externalEl.style.display = "";
          }
        } else {
          if (externalEl) {
            externalEl.remove();
          }
          if (internalEl) {
            internalEl.style.display = "";
          }
        }
      })
      .catch(function (error) {
        console.error("initAppointmentMode error:", error);
      });
  } catch (err) {
    console.error("initAppointmentMode error:", err);
  }
}

const DISABLED_APPOINTMENT_TIMES = [
  "12:00 AM",
  "12:15 AM",
  "12:30 AM",
  "12:45 AM",
  "1:00 AM",
  "1:15 AM",
  "1:30 AM",
  "1:45 AM",
  "2:00 AM",
  "2:15 AM",
  "2:30 AM",
  "2:45 AM",
  "3:00 AM",
  "3:15 AM",
  "3:30 AM",
  "3:45 AM",
  "4:00 AM",
  "4:15 AM",
  "4:30 AM",
  "4:45 AM",
  "5:00 AM",
  "5:15 AM",
  "5:30 AM",
  "5:45 AM",
  "6:00 AM",
  "6:15 AM",
  "6:30 AM",
  "6:45 AM",
  "7:00 AM",
  "7:15 AM",
  "7:30 AM",
  "7:45 AM",
  "8:00 AM",
  "8:15 AM",
  "8:30 AM",
  "8:45 AM",
];

function initAppointmentPickers() {
  try {
    if (typeof window.FLDatePicker !== "function") return;

    const dateEl = document.getElementById("appointment-date");
    const timeEl = document.getElementById("appointment-time");

    if (dateEl) {
      new window.FLDatePicker(dateEl, {
        type: "date",
        placeholder: "Select date",
        disablePast: true,
        closeOnSelect: false,
        closeOnSelectDelay: 400,
      });
    }
    if (timeEl) {
      new window.FLDatePicker(timeEl, {
        type: "time",
        timeStep: 15,
        placeholder: "Select time",
        closeOnSelect: false,
        closeOnSelectDelay: 400,
        disabledTimes: DISABLED_APPOINTMENT_TIMES,
      });
    }

    const appointmentForm = document.querySelector(
      "#appointment-cta .custom-form",
    );
    if (appointmentForm) {
      appointmentForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const selectLabels = appointmentForm.querySelectorAll(
          ".custom-select .selected",
        );
        const department =
          selectLabels[0]?.textContent.trim() || "Not selected";
        const secondary = selectLabels[1]?.textContent.trim() || "Not selected";

        const name =
          appointmentForm
            .querySelector('input[placeholder="Your Name"]')
            ?.value.trim() || "";
        const email =
          appointmentForm
            .querySelector('input[placeholder="Your Email"]')
            ?.value.trim() || "";

        const dateValue =
          document
            .querySelector("#appointment-date .fl-picker-input")
            ?.value.trim() || "";
        const timeValue =
          document
            .querySelector("#appointment-time .fl-picker-input")
            ?.value.trim() || "";

        const payload = {
          department,
          secondary,
          name,
          email,
          date: dateValue,
          time: timeValue,
        };

        alert(JSON.stringify(payload, null, 2));
      });
    }
  } catch (err) {
    console.error("initAppointmentPickers error:", err);
  }
}

function initConsultationSection() {
  try {
    const section = document.getElementById("consultation-cta");
    if (!section) return;

    if (typeof window.FLDatePicker === "function") {
      const dateEl = document.getElementById("consultation-date");
      const timeEl = document.getElementById("consultation-time");

      if (dateEl) {
        new window.FLDatePicker(dateEl, {
          type: "date",
          placeholder: "Select date",
          disablePast: true,
          closeOnSelect: false,
          closeOnSelectDelay: 400,
        });
      }

      if (timeEl) {
        new window.FLDatePicker(timeEl, {
          type: "time",
          timeStep: 15,
          placeholder: "Select time",
          closeOnSelect: false,
          closeOnSelectDelay: 400,
          disabledTimes: DISABLED_APPOINTMENT_TIMES,
        });
      }
    }

    const selects = section.querySelectorAll(".consultation-select");
    let activeSelect = null;

    selects.forEach((select) => {
      const selected = select.querySelector(".selected");
      const options = select.querySelector(".options");
      if (!selected || !options) return;

      selected.addEventListener("click", function (e) {
        e.stopPropagation();

        if (select === activeSelect) {
          options.classList.remove("show-drop");
          activeSelect = null;
          return;
        }

        closeAllDropdowns(selects, select);
        options.classList.add("show-drop");
        activeSelect = select;
      });

      selected.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selected.click();
        }
      });

      select.querySelectorAll(".option").forEach((option) => {
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
      const options = activeSelect.querySelector(".options");
      if (options) options.classList.remove("show-drop");
      activeSelect = null;
    });

    const form = section.querySelector(".consultation-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const coverage =
          section
            .querySelector("#consultation-coverage .selected")
            ?.textContent.trim() || "";
        const contactMethod =
          section
            .querySelector("#consultation-contact .selected")
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

function initSectionVisibility() {
  try {
    fetch("assets/config/sections.json")
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

function initFooterYear() {
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

function getStickyBarTopOffsetPx() {
  try {
    const raw =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--sticky-bar-h",
      ) || "";
    const n = parseFloat(raw.trim());
    return Number.isFinite(n) ? n : 0;
  } catch (_) {
    return 0;
  }
}

window.getStickyBarTopOffsetPx = getStickyBarTopOffsetPx;

function initStickyBar() {
  const root = document.getElementById("sticky-bar-root");
  const bar = document.getElementById("sticky-bar");
  const placeholder = root?.querySelector(".sticky-bar-placeholder");
  const footer = document.getElementById("footer");
  const hero = document.querySelector(".section-health");
  const header = document.getElementById("header");

  if (!root || !bar || !placeholder || !footer || !hero || !header) return;

  const DOCK_BOTTOM_ENTER_PX = 120;
  const DOCK_BOTTOM_EXIT_PX = 280;
  let latchBottom = false;
  let activeState = null;

  function setStickyBarCssVar(px) {
    document.documentElement.style.setProperty(
      "--sticky-bar-h",
      `${Math.max(0, px)}px`,
    );
  }

  /** Match header overlap padding used by `initStickyHeader` */
  function syncHeroOverlapPadding() {
    hero.style.paddingTop = `${header.offsetHeight}px`;
  }

  function computeNextState() {
    const heroRect = hero.getBoundingClientRect();
    const docEl = document.documentElement;
    const vv = window.visualViewport;
    const vh =
      vv && typeof vv.height === "number" ? vv.height : window.innerHeight;
    const scrollBottom = window.scrollY + vh;

    let nearDockBottom =
      scrollBottom >= docEl.scrollHeight - DOCK_BOTTOM_ENTER_PX;

    const belowDockBottomEscape =
      scrollBottom < docEl.scrollHeight - DOCK_BOTTOM_EXIT_PX;

    if (latchBottom) {
      if (belowDockBottomEscape) latchBottom = false;
    } else if (nearDockBottom) latchBottom = true;

    const atHeroBand = heroRect.top >= -40;

    if (latchBottom) return "bottom";
    if (atHeroBand) return "top";
    return "fixed";
  }

  function applyState(nextState) {
    placeholder.style.height = "0px";
    placeholder.classList.remove("is-active");
    footer.style.paddingBottom = "";
    footer.classList.remove("footer-sticky-bar-dock");
    bar.classList.remove("sticky-bar-fixed", "sticky-bar-docked-bottom");
    root.classList.remove("sticky-bar-root-bottom");

    if (footer.contains(root)) {
      header.before(root);
    }

    if (nextState === "bottom") {
      footer.appendChild(root);
      root.classList.add("sticky-bar-root-bottom");
      bar.classList.add("sticky-bar-docked-bottom");
      footer.classList.add("footer-sticky-bar-dock");
      setStickyBarCssVar(0);
    } else if (nextState === "fixed") {
      bar.classList.add("sticky-bar-fixed");
      const hFix = Math.max(bar.offsetHeight, 1);
      placeholder.style.height = `${hFix}px`;
      placeholder.classList.add("is-active");
      setStickyBarCssVar(hFix);
    } else {
      const hTop = Math.max(bar.offsetHeight, 1);
      setStickyBarCssVar(hTop);
    }

    activeState = nextState;
    syncHeroOverlapPadding();
  }

  function syncLayout() {
    if (root.classList.contains("sticky-bar-hidden")) {
      if (activeState !== "hidden") {
        setStickyBarCssVar(0);
        syncHeroOverlapPadding();
        activeState = "hidden";
      }
      return;
    }

    const nextState = computeNextState();
    if (nextState === activeState) return;
    applyState(nextState);
  }

  function forceSync() {
    activeState = null;
    syncLayout();
  }

  const throttledSync = throttle(syncLayout, 50);
  window.addEventListener("scroll", throttledSync, { passive: true });
  window.addEventListener("resize", forceSync);
  window.addEventListener("load", forceSync);
  syncLayout();
}

function initStickyHeader() {
  const header = document.getElementById("header");
  const hero = document.querySelector(".section-health");

  if (!header || !hero) return;

  const updateHeroPadding = () => {
    hero.style.paddingTop = `${header.offsetHeight}px`;
  };

  window.addEventListener("load", updateHeroPadding);

  // Use throttled version for scroll performance
  const throttledUpdate = throttle(updateHeroPadding, 100);

  const obs = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (!entry) return;

      header.classList.toggle("sticky", !entry.isIntersecting);
      if (!entry.isIntersecting) {
        header.style.background = "#fff";
        header.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
      } else {
        header.style.background = "transparent";
        header.style.boxShadow = "none";
      }
      if (!entry.isIntersecting) throttledUpdate();
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-100px",
    },
  );

  obs.observe(hero);
}

function initNavScroll() {
  const sectionToNavHash = {
    "health-cta": "#health-cta",
    featured: "#health-cta",
    "about-cta": "#about-cta",
    "services-cta": "#services-cta",
    "how-it-works-cta": "#services-cta",
    "pricing-cta": "#services-cta",
    "doctors-cta": "#services-cta",
    "find-doctor-cta": "#services-cta",
    "testimonials-cta": "#testimonials-cta",
    "morehelp-cta": "#morehelp-cta",
    "appointment-cta": "#appointment-cta",
    "contact-cta": "#appointment-cta",
  };

  const sections = Array.from(document.querySelectorAll("section[id]")).filter(
    (s) => Object.prototype.hasOwnProperty.call(sectionToNavHash, s.id),
  );

  const navLinks = document.querySelectorAll(
    '#navbarSupportedContent a[href^="#"]:not([href="#"]), #offcanvasNavbar a[href^="#"]:not([href="#"])',
  );

  const linkMap = {};
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!linkMap[href]) linkMap[href] = [];
    linkMap[href].push(link);
  });

  const getScrollAnchorPx = () => {
    const header = document.getElementById("header");
    const h = header ? header.offsetHeight : 0;
    const barExtra =
      typeof window.getStickyBarTopOffsetPx === "function"
        ? window.getStickyBarTopOffsetPx()
        : 0;
    return h + barExtra + 24;
  };

  const updateActiveNav = () => {
    const anchorPx = getScrollAnchorPx();
    const docEl = document.documentElement;
    const scrollBottom = window.innerHeight + window.scrollY;

    let activeHash = "#health-cta";

    const atBottom = scrollBottom >= docEl.scrollHeight - 2;
    if (atBottom) {
      activeHash = "#appointment-cta";
    } else {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        if (rect.top <= anchorPx) {
          activeHash = sectionToNavHash[section.id] || activeHash;
        }
      }
    }

    if (window.innerWidth > 768) {
      history.replaceState(null, null, activeHash);
    }

    navLinks.forEach((l) => l.classList.remove("active"));
    const group = linkMap[activeHash];
    if (group) {
      group.forEach((l) => l.classList.add("active"));
    }
  };

  const throttledUpdate = throttle(updateActiveNav, 50);
  window.addEventListener("scroll", throttledUpdate, { passive: true });
  window.addEventListener("resize", throttledUpdate);
  updateActiveNav();
}

function initMobileMenu() {
  const toggler = document.querySelector(".navbar-toggler");
  const offcanvasElement = document.getElementById("offcanvasNavbar");
  const stickyBarRoot = document.getElementById("sticky-bar-root");
  const offcanvasInstance = offcanvasElement
    ? bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement)
    : null;

  if (toggler) {
    toggler.addEventListener("click", () => {
      toggler.classList.toggle("opened");
    });
  }

  const offcanvasLinks = document.querySelectorAll(
    '#offcanvasNavbar a[href^="#"]:not([href="#"])',
  );
  offcanvasLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }

      if (toggler) {
        toggler.classList.remove("opened");
      }
    });
  });

  if (offcanvasElement && stickyBarRoot) {
    offcanvasElement.addEventListener("show.bs.offcanvas", () => {
      stickyBarRoot.classList.add("sticky-bar-hidden");
      document.documentElement.style.setProperty("--sticky-bar-h", "0px");
    });
  }

  if (offcanvasElement) {
    offcanvasElement.addEventListener("hidden.bs.offcanvas", () => {
      if (toggler) {
        toggler.classList.remove("opened");
      }
      if (stickyBarRoot) {
        stickyBarRoot.classList.remove("sticky-bar-hidden");
      }
      window.dispatchEvent(new Event("resize"));
    });
  }
}

function initSwipers() {
  // Header swiper - optimized with passive events for better scroll performance
  const headerSwiper = new Swiper(".header-swiper", {
    slidesPerView: 3,
    spaceBetween: 0,
    loop: true,
    speed: 5000,
    autoplay: {
      delay: 0,
      pauseOnMouseEnter: false,
      disableOnInteraction: false,
    },
    grabCursor: true,
    allowTouchMove: true,
    passiveListeners: true, // Improve scroll performance
    on: {
      init: scaleMiddleSlide,
      slideChangeTransitionEnd: throttle(scaleMiddleSlide, 100), // Throttle expensive operation
    },
  });

  // Featured swiper removed — Trust & Proof section is static

  // Doctors swiper - disable autoplay by default to improve performance
  const doctorsSwiper = new Swiper(".doctors-swiper", {
    slidesPerView: 2,
    spaceBetween: 40,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 800, // Reduced from 3000 for better UX
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      enabled: false, // Disabled by default to prevent scroll jank
    },
    navigation: {
      nextEl: ".doctors-next",
      prevEl: ".doctors-prev",
    },
    passiveListeners: true,
    breakpoints: {
      0: { slidesPerView: 1 },
      800: { slidesPerView: 2 },
      992: { slidesPerView: 2 },
    },
  });

  // Pricing swiper - disable autoplay by default
  const pricingSwiper = new Swiper(".pricing-swiper", {
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
      el: ".pricing-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".pricing-next",
      prevEl: ".pricing-prev",
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

  // Testimonials swiper
  const testimonialsSwiper = new Swiper(".testimonial-swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 600,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      enabled: false,
    },
    pagination: {
      el: ".testimonials-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".testimonials-next",
      prevEl: ".testimonials-prev",
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

  // Enable autoplay only when swipers are in viewport for better performance
  initSwiperAutoplayInView([doctorsSwiper, pricingSwiper, testimonialsSwiper]);
}

// Enable swiper autoplay only when in viewport
function initSwiperAutoplayInView(swipers) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const swiper = swipers.find((s) => s.el === entry.target);
        if (swiper) {
          if (entry.isIntersecting) {
            swiper.autoplay.start();
          } else {
            swiper.autoplay.stop();
          }
        }
      });
    },
    { threshold: 0.5 },
  );

  swipers.forEach((swiper) => {
    observer.observe(swiper.el);
  });
}

function initServicesReveal() {
  const section = document.querySelector(".services-section");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll(".service-card"));
  if (!cards.length) return;

  const mq = window.matchMedia("(max-width: 1023.98px)");
  const ROW_STAGGER_MS = 120;
  const observers = [];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function resetCards() {
    cards.forEach((card) => {
      card.classList.remove("is-reveal-pending", "is-revealed");
      card.style.removeProperty("--reveal-delay");
    });
  }

  function disconnectObservers() {
    observers.splice(0).forEach((observer) => observer.disconnect());
  }

  function revealRow(rowCards) {
    rowCards.forEach((card) => {
      card.classList.add("is-revealed");
      card.classList.remove("is-reveal-pending");
    });
  }

  function setupReveal() {
    disconnectObservers();
    resetCards();

    if (!mq.matches || prefersReducedMotion) {
      revealRow(cards);
      return;
    }

    const columns = 2;
    const rows = new Map();

    cards.forEach((card, index) => {
      const rowIndex = Math.floor(index / columns);
      if (!rows.has(rowIndex)) rows.set(rowIndex, []);
      rows.get(rowIndex).push(card);
    });

    rows.forEach((rowCards, rowIndex) => {
      rowCards.forEach((card) => {
        card.classList.add("is-reveal-pending");
        card.style.setProperty(
          "--reveal-delay",
          `${rowIndex * ROW_STAGGER_MS}ms`,
        );
      });

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealRow(rowCards);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );

      observer.observe(rowCards[0]);
      observers.push(observer);
    });
  }

  setupReveal();
  mq.addEventListener("change", setupReveal);
}

function initBackToTop() {
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

function initCustomSelects() {
  const handleCustomSelect = (containerClass, selectedClass, optionsClass) => {
    document.querySelectorAll(containerClass).forEach((select) => {
      const selected = select.querySelector(selectedClass);
      const options = select.querySelector(optionsClass);
      const optionItems = select.querySelectorAll(".option, .option-popup");

      selected.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(optionsClass).forEach((opt) => {
          if (opt !== options) opt.classList.remove("show-drop", "active");
        });
        options.classList.toggle("show-drop");
        select.classList.toggle("active");
      });

      optionItems.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          selected.textContent = option.textContent;
          options.classList.remove("show-drop");
          select.classList.remove("active");
        });
      });
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(optionsClass).forEach((options) => {
        options.classList.remove("show-drop");
      });
      document.querySelectorAll(containerClass).forEach((select) => {
        select.classList.remove("active");
      });
    });
  };

  const handleCustomPopup = (containerClass, selectedClass, optionsClass) => {
    document.querySelectorAll(containerClass).forEach((select) => {
      const selected = select.querySelector(selectedClass);
      const options = select.querySelector(optionsClass);
      const optionItems = select.querySelectorAll(".option, .option-popup");

      selected.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(optionsClass).forEach((opt) => {
          if (opt !== options) opt.classList.remove("show-drop", "active");
        });
        options.classList.toggle("show-drop");
        select.classList.toggle("active");

        if (select.classList.contains("active")) {
          document.body.classList.add("no-scroll");
        } else {
          document.body.classList.remove("no-scroll");
        }
      });

      optionItems.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          selected.textContent = option.textContent;
          options.classList.remove("show-drop");
          select.classList.remove("active");
          document.body.classList.remove("no-scroll");
        });
      });
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(optionsClass).forEach((options) => {
        options.classList.remove("show-drop");
      });
      document.querySelectorAll(containerClass).forEach((select) => {
        select.classList.remove("active");
      });
      document.body.classList.remove("no-scroll");
    });
  };

  handleCustomSelect(".custom-select", ".selected", ".options");
  handleCustomPopup(".custom-popup", ".popup", ".options-popup");
}

function initBlogSection() {
  const container = document.querySelector(".blog-section .row");
  if (!container) return;

  const cards = container.querySelectorAll(":scope > .blog-card");
  const toggleBtn = document.getElementById("toggleBlogBtn");
  if (!cards.length || !toggleBtn) return;

  const cardsToShow = 3;
  const SCROLL_OFFSET = 113;
  let visibleCount = cardsToShow;

  cards.forEach((card) => {
    card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  });

  const updateCardsVisibility = () => {
    cards.forEach((card, index) => {
      if (index < visibleCount) {
        card.style.display = "block";
        requestAnimationFrame(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.addEventListener(
          "transitionend",
          function handler() {
            if (card.style.opacity === "0") {
              card.style.display = "none";
              card.removeEventListener("transitionend", handler);
            }
          },
          { once: true },
        );
      }
    });

    toggleBtn.textContent =
      visibleCount >= cards.length ? "Show Less" : "Show More";
    toggleBtn.style.display =
      cards.length <= cardsToShow ? "none" : "inline-block";
  };

  const scrollToWithOffset = (el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const IMAGE_LOAD_DELAY_MS = 500;

  const applyImageLoaderToNewCards = (prevVisible, newVisible) => {
    for (let i = prevVisible; i < newVisible && i < cards.length; i++) {
      const card = cards[i];
      const img = card.querySelector("img.card-img-top");
      const imageWrapper = img?.parentElement;
      if (!imageWrapper) continue;
      imageWrapper.classList.add("blog-image-loading");
      if (img) img.style.opacity = "0";
      setTimeout(() => {
        imageWrapper.classList.remove("blog-image-loading");
        if (img) img.style.opacity = "";
      }, IMAGE_LOAD_DELAY_MS);
    }
  };

  toggleBtn.addEventListener("click", () => {
    toggleBtn.disabled = true;
    const expanding = visibleCount < cards.length;
    const prevVisible = visibleCount;
    visibleCount = expanding
      ? Math.min(visibleCount + cardsToShow, cards.length)
      : cardsToShow;

    if (expanding) applyImageLoaderToNewCards(prevVisible, visibleCount);

    updateCardsVisibility();

    if (expanding) {
      const target = cards[Math.min(visibleCount - 1, cards.length - 1)];
      setTimeout(() => {
        scrollToWithOffset(target);
        toggleBtn.disabled = false;
      }, 400);
    } else {
      setTimeout(() => {
        scrollToWithOffset(container);
        toggleBtn.disabled = false;
      }, 400);
    }
  });

  updateCardsVisibility();
}

function initDropdownBehaviors() {
  const appointmentSection = document.querySelector("#appointment-cta");
  if (appointmentSection) {
    const appointmentSelects =
      appointmentSection.querySelectorAll(".custom-select");
    let activeAppointmentSelect = null;

    appointmentSelects.forEach((select) => {
      const selected = select.querySelector(".selected");
      const options = select.querySelector(".options");

      selected.addEventListener("click", function (e) {
        e.stopPropagation();

        if (select === activeAppointmentSelect) {
          options.classList.remove("show-drop");
          activeAppointmentSelect = null;
          return;
        }

        closeAllDropdowns(appointmentSelects, select);
        options.classList.add("show-drop");
        activeAppointmentSelect = select;
      });

      select.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", function (e) {
          e.stopPropagation();
          selected.textContent = this.textContent;
          options.classList.remove("show-drop");
          activeAppointmentSelect = null;
        });
      });
    });
  }

  const findDoctorSection = document.querySelector("#find-doctor-cta");
  if (findDoctorSection) {
    const doctorSelect = findDoctorSection.querySelector(".custom-select");
    if (doctorSelect) {
      const selected = doctorSelect.querySelector(".selected");
      const options = doctorSelect.querySelector(".options");
      let hideTimeout;

      selected.addEventListener("click", function () {
        options.classList.add("show-drop");
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          options.classList.remove("show-drop");
        }, 2600);
      });

      doctorSelect.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", function () {
          selected.textContent = this.textContent;
          options.classList.remove("show-drop");
          clearTimeout(hideTimeout);
        });
      });
    }
  }
}

function scaleMiddleSlide(swiper) {
  swiper.slides.forEach((slide) => slide.classList.remove("is-scaled"));

  const visibleSlides = Array.from(swiper.slides).filter((slide) =>
    slide.classList.contains("swiper-slide-visible"),
  );

  if (visibleSlides.length === 3) {
    visibleSlides[1].classList.add("is-scaled");
  }
}

function closeAllDropdowns(allDropdowns, exceptThis = null) {
  allDropdowns.forEach((select) => {
    if (select !== exceptThis) {
      const options = select.querySelector(".options");
      options.classList.remove("show-drop");
    }
  });
}

// Lazy-load all images except those inside <header>. Supports data-src/data-srcset and dynamic content.
function initLazyImages() {
  const isInHeader = (el) => !!el.closest("header");

  // 1) Eager-load header images to preserve LCP
  document.querySelectorAll("header img").forEach((img) => {
    img.loading = "eager";
    img.decoding = "async";
    if (!img.hasAttribute("fetchpriority")) {
      img.setAttribute("fetchpriority", "high");
    }
  });

  // 2) Observer for data-src / data-srcset swap (for full control when desired)
  const ioSwap =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const img = entry.target;

              // Swap sources when about to enter viewport
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
              }
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute("data-srcset");
              }

              // Let browser pick the right candidate after swap
              if (!img.hasAttribute("sizes") && img.parentElement) {
                // no-op: keep author control; add sizes in markup if needed
              }

              obs.unobserve(img);
            });
          },
          { rootMargin: "200px 0px" },
        )
      : null;

  // 3) Upgrade every <img> outside header
  const upgradeImg = (img) => {
    if (isInHeader(img)) return; // skip header
    if (img.hasAttribute("data-no-lazy")) return; // per-image opt-out

    // Prefer native lazy for simple cases
    img.decoding = "async";
    if (!img.hasAttribute("loading")) {
      img.loading = "lazy";
    }

    // If developer provided data-src/srcset, use IO swap for precise timing
    if (ioSwap && (img.dataset.src || img.dataset.srcset)) {
      ioSwap.observe(img);
    }
  };

  document.querySelectorAll("img").forEach(upgradeImg);

  // 4) Handle dynamically injected images (e.g., Swiper slides, CMS content)
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;

        if (node.matches?.("img")) upgradeImg(node);
        node.querySelectorAll?.("img").forEach(upgradeImg);
      });
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

// Blur-up image loader: apply blur + skeleton until image fully decoded
function initImageBlurUp() {
  try {
    const images = Array.from(document.querySelectorAll("img"));
    if (!images.length) return;

    const isInHeader = (el) => !!el.closest("header"); // <— add this

    const applyLoaded = (img) => {
      img.classList.add("is-loaded");
    };

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, obs) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                img.classList.add("blur-up");

                const onLoad = () => {
                  if (img.decode) {
                    img
                      .decode()
                      .catch(() => {})
                      .finally(() => applyLoaded(img));
                  } else {
                    applyLoaded(img);
                  }
                  img.removeEventListener("load", onLoad);
                };

                if (img.complete && img.naturalWidth > 0) {
                  applyLoaded(img);
                } else {
                  img.addEventListener("load", onLoad, { once: true });
                }

                obs.unobserve(img);
              });
            },
            { rootMargin: "200px 0px", threshold: 0.01 },
          )
        : null;

    images.forEach((img) => {
      if (img.classList.contains("no-blur")) return; // opt-out
      if (isInHeader(img)) return; // NEW: don't blur header/LCP images

      // Ensure placeholder styles apply before image paints
      img.classList.add("blur-up");

      if (img.complete && img.naturalWidth > 0) {
        applyLoaded(img);
        return;
      }

      if (observer) {
        observer.observe(img);
      } else {
        const onLoad = () => {
          applyLoaded(img);
          img.removeEventListener("load", onLoad);
        };
        img.addEventListener("load", onLoad, { once: true });
      }
    });
  } catch (e) {
    console.error("initImageBlurUp error:", e);
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderFaqItem(item, index) {
  const number = String(index + 1).padStart(2, "0");
  const triggerId = `faq-trigger-${number}`;
  const panelId = `faq-panel-${number}`;
  const isOpen = Boolean(item.open);
  const question = escapeHtml(item.question || "");
  const answer = escapeHtml(item.answer || "");

  return `
    <div class="faq-item${isOpen ? " is-open" : ""}">
      <h3 class="faq-item-heading">
        <button
          type="button"
          class="faq-item-trigger"
          id="${triggerId}"
          aria-expanded="${isOpen ? "true" : "false"}"
          aria-controls="${panelId}"
        >
          <span class="faq-item-number">${number}</span>
          <span class="faq-item-divider" aria-hidden="true"></span>
          <span class="faq-item-question">${question}</span>
          <span class="faq-item-toggle" aria-hidden="true">
            <span class="faq-item-toggle-icon faq-item-toggle-icon-plus">+</span>
            <span class="faq-item-toggle-icon faq-item-toggle-icon-minus">&#8722;</span>
          </span>
        </button>
      </h3>
      <div
        class="faq-item-panel"
        id="${panelId}"
        role="region"
        aria-labelledby="${triggerId}"
        ${isOpen ? "" : "hidden"}
      >
        <div class="faq-item-panel-inner">
          <div class="faq-item-panel-content">
            <p>${answer}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function wireFaqAccordion(section) {
  const items = Array.from(section.querySelectorAll(".faq-item"));
  if (!items.length) return;

  const closePanel = (item, panel, trigger) => {
    if (!item.classList.contains("is-open")) return;

    item.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");

    panel.style.transition =
      "height 300ms ease-in-out, opacity 280ms ease-in-out";
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

  const openPanel = (item, panel, trigger) => {
    item.classList.add("is-open");
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

  items.forEach((item) => {
    const trigger = item.querySelector(".faq-item-trigger");
    const panel = item.querySelector(".faq-item-panel");
    if (!trigger || !panel) return;

    if (item.classList.contains("is-open")) {
      panel.hidden = false;
      panel.style.height = "auto";
      panel.style.opacity = "1";
      trigger.setAttribute("aria-expanded", "true");
    }

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      if (isOpen) {
        closePanel(item, panel, trigger);
        return;
      }

      items.forEach((otherItem) => {
        if (otherItem === item) return;
        const otherTrigger = otherItem.querySelector(".faq-item-trigger");
        const otherPanel = otherItem.querySelector(".faq-item-panel");
        if (otherTrigger && otherPanel) {
          closePanel(otherItem, otherPanel, otherTrigger);
        }
      });

      openPanel(item, panel, trigger);
    });
  });
}

function initFaqAccordion() {
  try {
    const section = document.querySelector(".section-faq");
    const faqList = document.getElementById("faq-list");
    if (!section || !faqList) return;

    fetch("assets/config/faq.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load faq.json");
        }
        return response.json();
      })
      .then(function (config) {
        const items = Array.isArray(config?.items) ? config.items : [];
        if (!items.length) return;

        faqList.innerHTML = items.map(renderFaqItem).join("");
        wireFaqAccordion(section);
      })
      .catch(function (error) {
        console.error("initFaqAccordion error:", error);
      });
  } catch (e) {
    console.error("initFaqAccordion error:", e);
  }
}
