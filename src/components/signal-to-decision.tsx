import { useEffect, useRef, useState } from 'react';

const NODES: Array<[number, number]> = [[60, 90], [220, 75], [380, 75], [540, 75], [700, 75]];
const PATH_D = 'M60 90 C110 40 170 120 220 75 S330 30 380 75 S490 120 540 75 S650 30 700 75';
const LABELS = ['Capture', 'Connect', 'Cloud', 'Insight', 'Action'];
const TRAVEL_MS = 4200;
const HOLD_MS = 1600;
const FADE_MS = 400;

const STEPS = [
  { title: 'Capture', text: 'Devices, equipment and business apps record what is happening.' },
  { title: 'Connect', text: 'Data is collected securely and checked against your rules.' },
  { title: 'Cloud', text: 'Everything comes together in one secure cloud platform.' },
  { title: 'Insight', text: 'Analytics and AI surface trends and what needs attention.' },
  { title: 'Action', text: 'Your team sees it in web and mobile apps, and acts on it.' },
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

type Props = { title?: string; intro?: string };

/** Auto-playing loop that follows one equipment reading from sensor to decision. */
export default function SignalToDecision({
  title = 'From signal to decision',
  intro = 'See how data moves from your equipment and software to a clear decision for your team.',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const overlayRef = useRef<SVGPathElement>(null);
  const packetRef = useRef<SVGGElement>(null);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [active, setActive] = useState(reduced ? NODES.length : 0);
  const steps = STEPS;

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    const overlay = overlayRef.current;
    const packet = packetRef.current;
    if (!root || !path || !overlay || !packet) return;

    const total = path.getTotalLength();
    overlay.style.strokeDasharray = `${total}`;
    if (reduced) {
      overlay.style.strokeDashoffset = '0';
      packet.style.display = 'none';
      return;
    }

    // Where each step node sits along the path.
    const nodeLengths = NODES.map(([nx, ny]) => {
      let best = 0;
      let bestDist = Infinity;
      for (let s = 0; s <= 600; s++) {
        const len = (total * s) / 600;
        const p = path.getPointAtLength(len);
        const d = (p.x - nx) ** 2 + (p.y - ny) ** 2;
        if (d < bestDist) { bestDist = d; best = len; }
      }
      return best;
    });

    const placePacket = (len: number, opacity: number) => {
      const p = path.getPointAtLength(len);
      packet.setAttribute('transform', `translate(${p.x} ${p.y})`);
      packet.style.opacity = String(opacity);
      overlay.style.strokeDashoffset = String(total - len);
      overlay.style.opacity = String(opacity);
    };
    placePacket(0, 0);

    const cycleLength = TRAVEL_MS + HOLD_MS + FADE_MS;
    let elapsed = 0;
    let last = 0;
    let shown = -1;
    let raf = 0;
    let running = false;
    let inView = false;

    const frame = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      elapsed += dt;
      if (elapsed >= cycleLength) {
        elapsed -= cycleLength;
      }

      let len = total;
      let opacity = 1;
      if (elapsed < TRAVEL_MS) len = total * easeInOut(elapsed / TRAVEL_MS);
      else if (elapsed > TRAVEL_MS + HOLD_MS) opacity = Math.max(0, 1 - (elapsed - TRAVEL_MS - HOLD_MS) / FADE_MS);

      const count = elapsed >= TRAVEL_MS + HOLD_MS ? 0 : nodeLengths.filter((l) => len >= l - 1).length;
      if (count !== shown) { shown = count; setActive(count); }
      placePacket(len, opacity);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !inView || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    }, { threshold: 0.25 });
    observer.observe(root);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return <div className="s2d-panel" ref={rootRef} data-testid="signal-to-decision">
    <div className="s2d-head">
      <h3>{title}</h3>
      <p>{intro}</p>
    </div>
    <svg className="s2d-svg" viewBox="0 0 760 150" aria-hidden="true">
      <defs>
        <linearGradient id="s2d-gradient" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#34C3E0" />
          <stop offset="1" stopColor="#5FE0A8" />
        </linearGradient>
        <filter id="s2d-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path ref={pathRef} d={PATH_D} fill="none" stroke="#2A4C86" strokeWidth="3" />
      <path ref={overlayRef} d={PATH_D} fill="none" stroke="url(#s2d-gradient)" strokeWidth="4" strokeLinecap="round" />
      {NODES.map(([x, y], i) => <g key={LABELS[i]} className={`s2d-node ${i < active ? 'is-lit' : ''}`} transform={`translate(${x} ${y})`}>
        {i < active && !reduced && <circle className="s2d-pulse" r="15" />}
        <circle className="s2d-dot" r="15" />
        <text y="36" textAnchor="middle">{LABELS[i]}</text>
      </g>)}
      <g ref={packetRef} className="s2d-packet" filter="url(#s2d-glow)"><circle r="7" fill="#5FE0A8" /></g>
    </svg>
    <ol className="s2d-cards">
      {steps.map((step, i) => <li key={step.title} className={`s2d-card ${i < active ? 'is-active' : ''}`}>
        <span className="s2d-num">0{i + 1}</span>
        <h4>{step.title}</h4>
        <p>{step.text}</p>
      </li>)}
    </ol>
    <p className="s2d-note">Illustrative flow.</p>
    <p className="sr-only" aria-live="polite">{active > 0 && !reduced ? `Step ${active}: ${steps[active - 1].title}` : ''}</p>
  </div>;
}
