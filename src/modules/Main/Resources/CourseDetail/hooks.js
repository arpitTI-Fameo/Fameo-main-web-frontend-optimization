'use client';
// modules/Resources/CourseDetail/hooks.js

import { useEffect } from "react";

/* Shared scroll-reveal observer */
export function useReveals(deps = []) {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("shown");
        if (el.dataset.stagger) {
          el.querySelectorAll("[data-child]").forEach((c, i) =>
            setTimeout(() => c.classList.add("shown"), i * (Number(el.dataset.stagger) || 130)));
        }
        io.unobserve(el);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".cx-reveal,.cx-rv,[data-stagger]").forEach(el => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
