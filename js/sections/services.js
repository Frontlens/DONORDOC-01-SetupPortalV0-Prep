/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/
export function initServicesReveal() {
  const section = document.querySelector('[data-section="services"]');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll("[data-reveal]"));
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
