(() => {
  const root = document.querySelector("[data-composition-id]");
  if (!root || !window.gsap) {
    throw new Error(
      "HyperFrames composition requires a root element and the pinned GSAP runtime.",
    );
  }

  const compositionId = root.dataset.compositionId;
  const duration = 36;
  const timeline =
    window.__timelines?.[compositionId] ??
    window.gsap.timeline({ paused: true });
  window.__timelines = window.__timelines || {};
  window.__timelines[compositionId] = timeline;
  const scenes = Array.from(root.querySelectorAll(".scene"));

  timeline.to(".progress-value", { width: "100%", duration, ease: "none" }, 0);

  scenes.forEach((scene) => {
    const start = Number(scene.dataset.start);
    const sceneDuration = Number(scene.dataset.duration);
    const end = start + sceneDuration;
    const copy = scene.querySelector(".copy-block");
    const visual = scene.querySelector(".visual-block");

    timeline.set(scene, { opacity: 1 }, start);
    timeline.fromTo(
      copy,
      { y: 54, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      start,
    );
    timeline.fromTo(
      visual,
      { y: 38, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
      start + 0.12,
    );
    timeline.to(
      [copy, visual],
      { y: -22, opacity: 0, duration: 0.65, ease: "power2.in" },
      end - 0.65,
    );
    timeline.set(scene, { opacity: 0 }, end);
  });

  timeline.to(".orbit", { rotation: 112, duration: 6, ease: "none" }, 0);
  timeline.to(
    ".orbit-core",
    { scale: 1.14, duration: 1, repeat: 5, yoyo: true, ease: "sine.inOut" },
    0,
  );
  document.querySelectorAll(".orbit-dot").forEach((dot, index) => {
    const angle = (index / 8) * Math.PI * 2;
    const radius = index % 2 === 0 ? 202 : 139;
    window.gsap.set(dot, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  });

  document.querySelectorAll(".meaning-bar").forEach((bar, index) => {
    timeline.to(
      bar,
      {
        scaleY: 0.78 + (index % 3) * 0.09,
        transformOrigin: "bottom",
        duration: 0.75,
        repeat: 7,
        yoyo: true,
        ease: "sine.inOut",
      },
      6 + index * 0.08,
    );
  });

  timeline.fromTo(
    ".runtime-card",
    { y: 18, opacity: 0.35 },
    { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out" },
    13.3,
  );
  timeline.to(
    ".runtime-card",
    {
      borderColor: "rgba(118,169,255,.58)",
      duration: 1,
      stagger: 0.16,
      repeat: 3,
      yoyo: true,
    },
    14.4,
  );

  document.querySelectorAll(".frame-card i").forEach((bar, index) => {
    timeline.fromTo(
      bar,
      { width: "4%" },
      { width: "92%", duration: 1.8, repeat: 3, ease: "none" },
      21.4 + index * 0.2,
    );
  });

  timeline.to(
    ".landscape-frame",
    { rotation: 2.5, duration: 1.2, repeat: 4, yoyo: true, ease: "sine.inOut" },
    29.2,
  );
  timeline.to(
    ".portrait-frame",
    {
      rotation: -2.5,
      duration: 1.2,
      repeat: 4,
      yoyo: true,
      ease: "sine.inOut",
    },
    29.2,
  );
})();
