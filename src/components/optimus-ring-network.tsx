import { useEffect, useRef } from 'react';

type NetNode = { x: number; y: number; vx: number; vy: number; r: number; angle: number; band: number };

const LINK_FREE = 115;
const LINK_RING = 40;
const CURSOR_LINK = 170;
const CURSOR_PUSH = 140;
const IDLE_MS = 2200;
const BANDS = [-9, 0, 9];
const BIG_NODE_ANGLES = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

/**
 * Animated IoT network background. Fills its parent (position: absolute; inset: 0)
 * and listens for pointer movement on the parent so content on top stays clickable.
 * After 2.2s without pointer movement the nodes gather into the Optimus ring logo.
 */
export default function OptimusRingNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const host = canvas.parentElement ?? canvas;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 1;
    let h = 1;
    let nodes: NetNode[] = [];
    let cx = 0;
    let cy = 0;
    let radius = 0;
    let desktop = true;
    // Start with the ring already formed so the hero never looks empty on load.
    let blend = 1;
    let lastMove = performance.now() - IDLE_MS;
    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;
    let running = false;
    let inView = true;

    const layout = () => {
      const rect = host.getBoundingClientRect();
      const prevW = w;
      const prevH = h;
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      desktop = w > 900;
      // Desktop: ring sits beside the headline. Smaller screens: centred behind it, dimmed.
      radius = Math.min(w, h) * (desktop ? 0.3 : 0.36);
      cx = desktop ? w * 0.72 : w * 0.5;
      cy = h * 0.5;

      const count = Math.max(12, Math.floor(Math.min(130, (w * h) / 9000)));
      // Keep existing nodes on resize (scaled to the new size) so the network
      // doesn't jump or flash while the window is being resized.
      const sx = nodes.length ? w / prevW : 1;
      const sy = nodes.length ? h / prevH : 1;
      for (const n of nodes) { n.x *= sx; n.y *= sy; }
      if (nodes.length > count) nodes.length = count;
      while (nodes.length < count) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() * 2 - 1) * 0.18,
          vy: (Math.random() * 2 - 1) * 0.18,
          r: 1 + Math.random() * 1.6,
          angle: 0,
          band: 0,
        });
      }
      nodes.forEach((n, i) => {
        n.angle = (i / count) * Math.PI * 2;
        n.band = BANDS[i % BANDS.length];
      });
    };

    const draw = () => {
      const e = blend * blend * (3 - 2 * blend);

      const bgX = w * 0.72;
      const bgY = h * 0.5;
      const bg = ctx.createRadialGradient(bgX, bgY, 0, bgX, bgY, Math.max(w, h) * 0.85);
      bg.addColorStop(0, '#0B2B6B');
      bg.addColorStop(0.45, '#031643');
      bg.addColorStop(1, '#020E2E');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // On small screens the network sits behind the headline, so draw it much lighter.
      const dim = desktop ? 1 : 0.28;
      ctx.save();
      ctx.globalAlpha = dim;

      const pts = nodes.map((n) => {
        const rr = radius + n.band;
        const tx = cx + Math.cos(n.angle) * rr;
        const ty = cy + Math.sin(n.angle) * rr;
        return { x: n.x + (tx - n.x) * e, y: n.y + (ty - n.y) * e, r: n.r };
      });

      // Desktop: keep a faint outline of the logo ring visible even while the network is scattered.
      if (desktop && e < 1) {
        const ghost = 1 - e;
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(95,224,168,${(0.09 * ghost).toFixed(3)})`;
        for (const band of BANDS) {
          ctx.beginPath();
          ctx.arc(cx, cy, radius + band, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(95,224,168,${(0.22 * ghost).toFixed(3)})`;
        for (const angle of BIG_NODE_ANGLES) {
          ctx.beginPath();
          ctx.arc(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 12, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      const link = LINK_FREE + (LINK_RING - LINK_FREE) * e;
      const link2 = link * link;
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > link2) continue;
          const alpha = 0.35 * (1 - Math.sqrt(d2) / link);
          ctx.strokeStyle = `rgba(52,195,224,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (pointer.active && e < 1) {
        for (const p of pts) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > CURSOR_LINK) continue;
          const alpha = 0.75 * (1 - d / CURSOR_LINK) * (1 - e);
          ctx.strokeStyle = `rgba(95,224,168,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      const r = Math.round(201 + (95 - 201) * e);
      const g = Math.round(214 + (224 - 214) * e);
      const b = Math.round(227 + (168 - 227) * e);
      ctx.fillStyle = `rgba(${r},${g},${b},${(0.85 + 0.15 * e).toFixed(3)})`;
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      if (e > 0.01) {
        ctx.save();
        ctx.globalAlpha = e * dim;
        ctx.lineWidth = 3;
        ctx.fillStyle = '#031643';
        ctx.strokeStyle = '#5FE0A8';
        for (const angle of BIG_NODE_ANGLES) {
          ctx.beginPath();
          ctx.arc(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        // Light "OPTIMUS" wordmark in the centre of the ring (desktop only).
        if (desktop) {
        const fontSize = Math.max(16, Math.round(radius * 0.22));
        ctx.font = `600 ${fontSize}px Outfit, 'DM Sans', sans-serif`;
        ctx.letterSpacing = `${Math.round(fontSize * 0.28)}px`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(234,243,250,0.95)';
        // letter-spacing adds trailing space after the last glyph; nudge right to re-centre.
        ctx.fillText('OPTIMUS', cx + fontSize * 0.14, cy);
        }
        ctx.restore();
      }
    };

    const frame = (now: number) => {
      const idle = now - lastMove > IDLE_MS;
      blend = idle ? Math.min(1, blend + 0.02) : Math.max(0, blend - 0.035);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) { n.vx *= -1; n.x = Math.min(Math.max(n.x, 0), w); }
        if (n.y < 0 || n.y > h) { n.vy *= -1; n.y = Math.min(Math.max(n.y, 0), h); }
        if (pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 0 && d < CURSOR_PUSH) {
            n.x += (dx / d) * 0.6;
            n.y += (dy / d) * 0.6;
          }
        }
      }

      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      lastMove = performance.now();
    };
    const onPointerLeave = () => { pointer.active = false; };
    const onVisibility = () => (document.hidden ? stop() : start());

    layout();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      layout();
      draw(); // repaint immediately: resizing a canvas clears it
    });
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    });
    intersectionObserver.observe(host);

    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerdown', onPointerMove);
    host.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerdown', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="ring-network" aria-hidden="true" />;
}
