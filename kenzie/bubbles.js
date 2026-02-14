// kenzie/bubbles.js
// Bubble background animation on a full-screen canvas.
// No dependencies. Safe on GitHub Pages.

(() => {
  const canvas = document.getElementById("bubbleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  // Handle high-DPI screens without blurry canvas
  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // Bubble settings (tweak later)
  const bubbleCount = 28;
  const bubbles = [];
  const rand = (min, max) => Math.random() * (max - min) + min;

  function makeBubble() {
    const r = rand(10, 55);
    return {
      x: rand(0, window.innerWidth),
      y: rand(window.innerHeight + r, window.innerHeight + r + 300),
      r,
      vx: rand(-0.25, 0.25),
      vy: rand(-0.9, -0.25),
      wobble: rand(0.6, 1.8),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.10, 0.22)
    };
  }

  for (let i = 0; i < bubbleCount; i++) bubbles.push(makeBubble());

  let last = performance.now();

  function drawBubble(b) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);

    // Soft bubble look: subtle white highlight, transparent center
    const g = ctx.createRadialGradient(
      b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.2,
      b.x, b.y, b.r
    );
    g.addColorStop(0, `rgba(255,255,255,${b.alpha + 0.10})`);
    g.addColorStop(0.35, `rgba(255,255,255,${b.alpha})`);
    g.addColorStop(1, `rgba(255,255,255,0)`);

    ctx.fillStyle = g;
    ctx.fill();

    // Thin rim
    ctx.strokeStyle = `rgba(255,255,255,${b.alpha + 0.05})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function step(now) {
    const dt = Math.min(32, now - last) / 16.67; // normalize ~60fps
    last = now;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const b of bubbles) {
      b.phase += 0.015 * dt;
      b.x += (b.vx + Math.sin(b.phase) * 0.25 * b.wobble) * dt;
      b.y += b.vy * dt;

      // Wrap / respawn
      if (b.y + b.r < -80) {
        // respawn at bottom
        Object.assign(b, makeBubble());
        b.y = window.innerHeight + b.r + rand(0, 200);
      }
      if (b.x < -b.r - 60) b.x = window.innerWidth + b.r + 60;
      if (b.x > window.innerWidth + b.r + 60) b.x = -b.r - 60;

      drawBubble(b);
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();
