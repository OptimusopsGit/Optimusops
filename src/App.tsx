import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import OptimusRingNetwork from '@/components/optimus-ring-network';
import SignalToDecision from '@/components/signal-to-decision';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  Activity, ArrowRight, Check, Clock, ChevronRight, CircleHelp,
  Cloud, Cpu, Gauge, Globe, Layers3, LockKeyhole, MapPin, Menu, Network, Radio,
  Mail, Phone, ShieldCheck, Truck, Users, X,
} from 'lucide-react';
import optimusLogo from '@assets/optimus-logo.png';
import optimusLogoFooter from '@assets/optimus-logo-footer.png';

const queryClient = new QueryClient();
const CONTACT_EMAIL = 'sales@optimusqc.com';
const CONTACT_PHONE = '+1 (989) 372-0023';
const CONTACT_PHONE_HREF = 'tel:+19893720023';
const WEBSITE_LABEL = 'www.optimusqc.com';
const WEBSITE_URL = 'https://www.optimusqc.com';
const OFFICE_LOCATION = '3965 Fortune Blvd, Saginaw, MI 48603';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=3965+Fortune+Blvd%2C+Saginaw%2C+MI+48603';
const LINKEDIN_URL = 'https://www.linkedin.com/company/optimus-ops/';
const X_URL = 'https://x.com/OptimusOpsLLC';

function LinkedInLogo({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0h.01Z"/></svg>;
}

function XLogo({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z"/></svg>;
}

function SocialLinks({ className = '' }: { className?: string }) {
  return <div className={`social-links ${className}`}>
    <a className="social-btn" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Optimus on LinkedIn" data-testid="link-social-linkedin"><LinkedInLogo /></a>
    <a className="social-btn" href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="Optimus on X" data-testid="link-social-x"><XLogo /></a>
  </div>;
}

const services = [
  { title: 'Custom Software and Web Platforms', description: 'Build purpose-fit software that brings people, processes, and business data together.', capabilities: ['Business web platforms', 'Customer and partner portals', 'Admin tools and dashboards', 'API and system integrations'] },
  { title: 'Web Applications', description: 'Fast, secure web apps your teams and customers can use from any browser.', capabilities: ['Responsive, modern UI', 'Secure sign-in and roles', 'Cloud hosting and scaling', 'Ongoing support and updates'] },
  { title: 'Mobile Apps', description: 'Give field and operations teams useful tools wherever the work happens.', capabilities: ['iOS and Android apps', 'Real-time alerts', 'Digital checklists and forms', 'Offline-ready use'] },
  { title: 'AI and Data Analytics', description: 'Make business and operational data easier to understand, with analysis built around real decisions.', capabilities: ['Trend analysis', 'Anomaly detection', 'Predictive models', 'Reporting and KPIs'] },
  { title: 'CRM Optimization', description: 'Improve the systems and workflows teams rely on to manage customer relationships.', capabilities: ['Workflow automation', 'Data cleanup and migration', 'Integrations', 'Custom dashboards'] },
  { title: 'Fleet Management Systems', description: 'Bring vehicle and equipment health, utilization, and maintenance into one clear operating view.', capabilities: ['Equipment health monitoring', 'Usage and running hours', 'Maintenance scheduling', 'Fleet-wide dashboards'] },
  { title: 'IoT Solutions and Monitoring', description: 'Connect equipment and assets with dependable sensing, secure connectivity and timely alerts.', capabilities: ['Sensor selection and integration', 'Cellular gateways and firmware', 'Configurable alert rules', 'Secure device management'] },
  { title: 'Asset Tracking and Location', description: 'Understand where assets are and how they are being used across your operation.', capabilities: ['Indoor and outdoor location', 'Live asset maps', 'Inventory visibility', 'Utilization reports'] },
];
const serviceIcons = [Layers3, Globe, Phone, Activity, Users, Truck, Radio, MapPin];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Optimus', description: 'Optimus delivers fleet management, IoT, and AI software that turns equipment and business data into clear decisions.' },
  '/services': { title: 'Services | Optimus', description: 'Explore Optimus services for fleet management, connected devices, industrial monitoring, analytics, tracking, CRM, and software.' },
  '/solutions': { title: 'Solutions | Optimus', description: 'Connect equipment, surface operational signals, and give teams a clear way to act across sites with Optimus.' },
  '/about': { title: 'About | Optimus', description: 'Meet the Optimus team: multidisciplinary engineers, designers, and innovators building secure connected systems.' },
  '/careers': { title: 'Careers | Optimus', description: 'Explore career opportunities at Optimus in Saginaw, Michigan, building software, IoT, and AI solutions for real-world operations.' },
  '/contact': { title: 'Contact | Optimus', description: 'Tell Optimus about your fleet, equipment, or software challenge. Our Saginaw, Michigan team will be in touch.' },
  '/privacy': { title: 'Privacy Policy | Optimus', description: 'Learn how Optimus uses information submitted through its website contact form.' },
};

function usePageMeta(path: string) {
  useEffect(() => {
    const meta = pageMeta[path] ?? { title: 'Page not found | Optimus', description: 'The page you are looking for could not be found.' };
    document.title = meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', meta.description);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', meta.title);
    const twDescription = document.querySelector('meta[name="twitter:description"]');
    if (twDescription) twDescription.setAttribute('content', meta.description);
    const pageUrl = new URL(path, window.location.origin).toString();
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;
    const updateSocialMeta = (property: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    const updateTwitterImage = (content: string) => {
      let element = document.querySelector<HTMLMetaElement>('meta[name="twitter:image"]');
      if (!element) {
        element = document.createElement('meta');
        element.name = 'twitter:image';
        document.head.appendChild(element);
      }
      element.content = content;
    };
    updateSocialMeta('og:url', pageUrl);
    const imageUrl = new URL(optimusLogo, window.location.origin).toString();
    updateSocialMeta('og:image', imageUrl);
    updateTwitterImage(imageUrl);
  }, [path]);
}

function Reveal({ children, className = '', stagger = false, testId }: { children: ReactNode; className?: string; stagger?: boolean; testId?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`${stagger ? 'stagger' : 'reveal'} ${className}`} data-testid={testId}>{children}</div>;
}

function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const onResize = () => { if (window.innerWidth > 1024) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [open]);
  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);
  const links = [['Home', '/'], ['Services', '/services'], ['Solutions', '/solutions'], ['About', '/about'], ['Careers', '/careers'], ['Contact', '/contact']];
  return <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="container-wide nav-inner">
      <Link href="/" className="nav-logo" aria-label="Optimus home" data-testid="link-logo-home">
        <img src={optimusLogoFooter} alt="Optimus — Smarter systems. Stronger companies." width="67" height="72" decoding="async" fetchPriority="high" />
      </Link>
      <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation" id="main-navigation">
        {links.map(([label, href]) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} aria-current={location === href ? 'page' : undefined} data-testid={`link-nav-${label.toLowerCase()}`}>{label}</Link>)}
        <Link href="/contact" className="btn btn-primary nav-menu-cta" data-testid="link-menu-contact">Contact us <ArrowRight size={15} /></Link>
      </nav>
       <Link href="/contact" className="btn btn-primary nav-cta" data-testid="link-nav-contact">Contact us <ArrowRight size={15} /></Link>
      <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)} data-testid="button-mobile-menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </div>
  </header>;
}

function Footer() {
  return <footer className="footer">
    <div className="container-wide">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="Optimus home" data-testid="link-footer-logo"><img src={optimusLogoFooter} alt="Optimus — Smarter systems. Stronger companies." width="89" height="96" decoding="async" /></Link>
          <p>Smarter systems. Stronger companies. Connected technology for the work that keeps business moving.</p>
          <p className="footer-editable">{OFFICE_LOCATION}</p>
        </div>
        <div><h3>Explore</h3><div className="footer-links">
          <Link href="/services" data-testid="link-footer-services">Services</Link><Link href="/solutions" data-testid="link-footer-solutions">Solutions</Link><Link href="/about" data-testid="link-footer-about">About Optimus</Link><Link href="/careers" data-testid="link-footer-careers">Careers</Link><Link href="/contact" data-testid="link-footer-contact">Contact</Link>
        </div></div>
        <div><h3>Services</h3><div className="footer-links">
          {services.map((service, index) => <Link href="/services" key={service.title} data-testid={`link-footer-service-${index + 1}`}>{service.title}</Link>)}
        </div></div>
        <div><h3>Get in touch</h3><div className="footer-links">
          <a href={`mailto:${CONTACT_EMAIL}`} data-testid="link-footer-email"><Mail size={14} />{CONTACT_EMAIL}</a>
          <a href={CONTACT_PHONE_HREF} data-testid="link-footer-phone"><Phone size={14} />{CONTACT_PHONE}</a>
          <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" data-testid="link-footer-website"><Globe size={14} />{WEBSITE_LABEL}</a>
          <span><MapPin size={14} />{OFFICE_LOCATION}</span>
        </div></div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Optimus. All rights reserved.</span>
        <div className="footer-bottom-right"><Link href="/privacy" data-testid="link-footer-privacy">Privacy policy</Link><SocialLinks className="social-dark" /></div>
      </div>
    </div>
  </footer>;
}

function Layout({ children }: { children: ReactNode }) {
  return <div className="site-shell"><Header />{children}<Footer /></div>;
}

function HomePage() {
  return <Layout>
    <main>
      <section className="hero">
        <OptimusRingNetwork />
        <div className="container-wide hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">CONNECTED OPERATIONS, MADE CLEAR</div>
            <h1>Transforming Ideas Into <span>Intelligent Digital Solutions</span></h1>
            <p className="hero-connected-line">Connected systems that keep your operations moving.</p>
            <p>Optimus builds custom software, web platforms and apps, plus fleet, IoT and AI solutions that turn business data into clear decisions.</p>
            <div className="hero-actions"><Link href="/contact" className="btn btn-primary" data-testid="link-hero-contact">Contact us <ArrowRight size={16} /></Link><Link href="/services" className="btn btn-outline" data-testid="link-hero-services">Explore our services</Link></div>
            <p className="hero-hint"><i aria-hidden="true" /> Move your cursor through the network.</p>
          </div>
        </div>
      </section>
      <section className="trust-strip" aria-label="Optimus capabilities">
        <div className="container-wide trust-row"><div className="trust-label">One connected view of work in the real world</div><div className="trust-item"><Layers3 size={17} /> Custom software</div><div className="trust-item"><Globe size={17} /> Web platforms and apps</div><div className="trust-item"><Activity size={17} /> AI and analytics</div><div className="trust-item"><Truck size={17} /> Fleet management</div><div className="trust-item"><Radio size={17} /> IoT and monitoring</div></div>
      </section>
      <section className="section-pad">
        <div className="container-wide">
          <Reveal className="split-head"><div><div className="eyebrow">HOW IT WORKS</div><h2 className="section-title">See the whole operation.<br />Act with confidence.</h2></div><p className="section-copy">Sensors and cellular gateways connect vehicles and industrial equipment, giving teams a real-time view of health, usage, and alerts across sites.</p></Reveal>
          <Reveal className="s2d-wrap"><SignalToDecision /></Reveal>
          <div className="feature-layout">
            <Reveal className="feature-card">
              <div className="feature-icon"><Gauge size={22} /></div><h3>Fleet management that sees beyond the dashboard</h3><p>Bring equipment condition, running hours, usage patterns, and maintenance needs into a view your team can use every day.</p>
              <div className="mini-dashboard" aria-label="Illustrative equipment health dashboard"><div className="dash-top"><span>Equipment health</span><span>Demo view</span></div><div className="dash-metric" style={{fontSize:15}}>Asset visibility <small>health · usage · alerts</small></div><div className="bars" aria-hidden="true">{[36,52,42,74,58,92,65,78,49,84,68,96,62,78].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div></div>
            </Reveal>
            <Reveal className="feature-card dark-card">
              <div className="feature-icon"><Network size={22} /></div><h3>Industrial IoT, grounded in your environment</h3><p>Connect the machines, vehicles, and infrastructure you already depend on. Choose the right sensors and connectivity for the way your sites work.</p>
              <div className="device-rings" aria-hidden="true" />
            </Reveal>
          </div>
          <Reveal className="operating-fit">
            <div className="fit-intro"><div className="eyebrow">WHY OPTIMUS</div><h3>Designed around the realities of your operation.</h3></div>
            <div className="fit-points">{[
              ['Hardware to software','One team delivers connected devices and the software around them.'],
              ['Secure by design','Security and customer data ownership belong in the system from the start.'],
              ['Works with what you have','Connect existing equipment and systems where practical.'],
              ['Ready for demanding environments','Solutions are shaped for industrial and field conditions.'],
              ['One team through support','Stay with your team from discovery through deployment and ongoing support.'],
            ].map(([title,copy])=><article className="fit-point" key={title}><Check size={16}/><div><h4>{title}</h4><p>{copy}</p></div></article>)}</div>
          </Reveal>
        </div>
      </section>
      <section className="section-pad home-services">
        <div className="container-wide">
          <Reveal className="split-head"><div><div className="eyebrow">OPTIMUS CAPABILITIES</div><h2 className="section-title">Connected services.<br />Built around your work.</h2></div><p className="section-copy">From connected fleets and industrial IoT to the software your teams use, bring the capabilities you need together.</p></Reveal>
          <Reveal className="home-service-grid stagger">
            {services.map((service, index) => {
              const Icon = serviceIcons[index];
              return <Link href="/services" className="home-service-card" key={service.title} data-testid={`card-home-service-${index + 1}`}>
                <div className="home-service-icon"><Icon size={19} /></div>
                <span className="service-kicker">CAPABILITY / 0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="home-service-link">Explore services <ArrowRight size={14} /></span>
              </Link>;
            })}
          </Reveal>
        </div>
      </section>
      <section className="industries-band"><div className="container-wide industries-row"><div className="eyebrow">INDUSTRIES WE SUPPORT</div><div className="industries">{["Manufacturing","Warehousing and logistics","Distribution","Industrial equipment","Field services","Public sector"].map(item=><span className="industry-pill" key={item}>{item}</span>)}</div></div></section>
      <section className="section-pad">
        <div className="container-wide">
          <Reveal><div className="eyebrow">A PRACTICAL PARTNER</div><h2 className="section-title">Technology that fits the way<br />your business already works.</h2><p className="section-copy">We bring hardware and software together without asking you to start from scratch.</p></Reveal>
          <Reveal className="process-line stagger">
            {[['01','Discover','Understand the equipment, teams, and outcomes that matter.'],['02','Design','Shape a connected system around your environment.'],['03','Build','Integrate devices, data, and useful software.'],['04','Deploy','Put the system to work across your operation.'],['05','Support','Stay alongside your team as needs evolve.']].map(([n,title,copy])=><div className="process-step" key={n}><div className="step-node">{n}</div><h3>{title}</h3><p>{copy}</p></div>)}
          </Reveal>
        </div>
      </section>
      <ContactSection id="contact-us" />
      <section className="cta-band"><div className="container-wide cta-inner"><div><h2>Planning a fleet, IoT or software project? Let&apos;s talk.</h2><p>Tell us about your equipment, your data, and what your team needs next.</p></div><Link href="/contact" className="btn btn-primary" data-testid="link-home-cta">Contact us <ArrowRight size={16}/></Link></div></section>
    </main>
  </Layout>;
}

function SubHero({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className="subhero"><div className="container-wide subhero-content"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{children}</p></div></section>;
}

function ServicesPage() {
  return <Layout><main>
    <SubHero eyebrow="CAPABILITIES" title="Connected technology for real operations.">From fleet and industrial IoT to the software that brings your data together, Optimus builds practical systems around the way your business runs.</SubHero>
    <section className="section-pad"><div className="container-wide">
      <Reveal><div className="eyebrow">WHAT WE DO</div><h2 className="section-title">A full capability set.<br />Built to work together.</h2><p className="section-copy" style={{marginBottom:36}}>Start with a specific need or connect multiple capabilities into one system. Every engagement is shaped around your operation.</p></Reveal>
      <div className="service-grid">
        {services.map((service,index)=><Reveal className="service-card" key={service.title} testId={`card-service-${index+1}`}>
          <div className="service-kicker">SERVICE / 0{index+1}</div><h2>{service.title}</h2><p>{service.description}</p>
          <ul>{service.capabilities.map(cap=><li key={cap}><Check size={14}/>{cap}</li>)}</ul>
          <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="text-link" data-testid={`link-discuss-service-${index+1}`}>Discuss this service <ArrowRight size={15}/></Link>
        </Reveal>)}
      </div>
    </div></section>
    <section className="flow-section"><div className="container-wide"><div className="eyebrow">CONNECTED BY DESIGN</div><h2 className="section-title">From the equipment to your team.</h2>
      <div className="flow-row">{[['Devices and sensors',Radio],['Secure connectivity',LockKeyhole],['Cloud and AI',Cloud],['Dashboards and apps',Layers3],['Your team',Users]].map(([label,Icon],index)=><div className="flow-group" key={label as string} style={{display:'contents'}}><div className="flow-step"><span><Icon size={20}/></span>{label as string}</div>{index<4&&<ChevronRight className="flow-arrow" size={18}/>}</div>)}</div>
    </div></section>
    <section className="cta-band"><div className="container-wide cta-inner"><div><h2>Have a specific system in mind?</h2><p>Tell us what needs to connect, improve, or work differently.</p></div><Link href="/contact" className="btn btn-primary" data-testid="link-services-contact">Discuss your project <ArrowRight size={16}/></Link></div></section>
  </main></Layout>;
}

function SolutionsPage() {
  const pains = ['Unplanned downtime disrupting schedules and output','Equipment stress that is hard to see until it becomes a problem','Maintenance that stays reactive instead of informed','No unified view of assets and conditions across multiple sites'];
  const steps = [['Measure','Rugged sensors capture the conditions that matter.'],['Check','Secure cloud and AI analytics surface signals and patterns.'],['Send','Useful alerts reach the right people, in context.'],['Act','Web and mobile dashboards help teams respond.']];
  return <Layout><main>
    <SubHero eyebrow="SOLUTIONS" title="Operational clarity, from the asset to every site.">Optimus connects equipment data to the people who need it—helping teams see developing issues, coordinate a response, and make informed decisions.</SubHero>
    <section className="section-pad"><div className="container-wide solution-grid">
      <Reveal><div className="eyebrow">THE CHALLENGES</div><h2 className="section-title">The cost of not knowing adds up.</h2><p className="section-copy">When critical signals stay buried in disconnected systems, teams often learn about a problem too late.</p><div className="pain-list">{pains.map((item,i)=><div className="pain-row" key={item}><CircleHelp size={18}/><span>{item}</span></div>)}</div></Reveal>
      <Reveal className="approach-card"><div className="eyebrow">A CONNECTED RESPONSE</div><h2>Measure → Check → Send → Act</h2><p>Connect what is happening in the field to an informed next step—without adding unnecessary complexity to the operation.</p><div className="approach-steps">{steps.map(([title,copy])=><div className="approach-step" key={title}><b>{title}</b><span>{copy}</span></div>)}</div>
        <div className="stack-row">{['Rugged sensors','Industrial CAN networks','Cellular gateways · no plant network needed','Secure cloud','AI analytics','Web / mobile dashboards'].map(item=><span className="stack-chip" key={item}>{item}</span>)}</div>
      </Reveal>
    </div></section>
    <section className="capability-band section-pad"><div className="container-wide">
      <Reveal><div className="eyebrow">SECURITY IS PART OF THE SYSTEM</div><h2 className="section-title">Designed for trust, from device to decision.</h2><p className="section-copy">A connected operation depends on keeping the right data accessible to the right people—and yours under your control.</p></Reveal>
      <Reveal className="security-grid stagger">{[
        [LockKeyhole,'Encrypted communication','Device-to-cloud communication is encrypted.'],
        [Radio,'Over-the-air updates','Devices can receive software updates remotely.'],
        [Users,'Role-based access','Access can be shaped around team roles.'],
        [ShieldCheck,'Customer-owned data','Your operational data remains yours.'],
      ].map(([Icon,title,copy],i)=><article className="security-item" key={i}><Icon size={20}/><h3>{title as string}</h3><p>{copy as string}</p></article>)}</Reveal>
    </div></section>
    <section className="cta-band"><div className="container-wide cta-inner"><div><h2>Make the next operational decision a clearer one.</h2><p>Contact us about what your teams need to see.</p></div><Link href="/contact" className="btn btn-primary" data-testid="link-solutions-contact">Contact us <ArrowRight size={16}/></Link></div></section>
  </main></Layout>;
}

function AboutPage() {
  const statRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const node = statRef.current;
    if (!node) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setCount(12); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1150, 1);
          setCount(Math.round(12 * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: .4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <Layout><main>
    <SubHero eyebrow="ABOUT OPTIMUS" title="Built for the places where work gets done.">We are multidisciplinary engineers, designers, and innovators turning operational challenges into scalable connected systems.</SubHero>
    <section className="section-pad"><div className="container-wide">
      <div className="about-intro">
        <Reveal><div className="eyebrow">WHO WE ARE</div><h2 className="section-title">Technology with an understanding of the work.</h2><p className="section-copy">Optimus brings hardware, software, and operational thinking together. We work across the details—from a sensor mounted on a machine to a dashboard used across sites—so connected systems are useful where they matter most.</p><p className="section-copy">Optimus began in quality consulting, running tracking, assessments, and process improvement for manufacturers. We then spent years alongside an industrial IoT software company, working directly with its customers in the field. That experience is the foundation for the software, IoT, and AI solutions we build today.</p><p className="section-copy">Based in Saginaw, Michigan, USA, we partner with organizations navigating complex equipment, environments, and workflows.</p></Reveal>
        <Reveal><div className="stat-panel" ref={statRef} data-testid="stat-experience"><div className="stat-number"><span>{count}+</span></div><p>years of experience</p></div></Reveal>
      </div>
    </div></section>
    <section className="capability-band section-pad"><div className="container-wide">
      <Reveal><div className="eyebrow">OUR MISSION</div><h2 className="section-title">Reliable, secure systems that help companies work smarter and scale with confidence.</h2></Reveal>
      <Reveal><div className="eyebrow" style={{marginTop:44}}>HOW WE WORK</div><div className="values-grid">{[['Practical','Start with the problem at hand and build toward a useful outcome.'],['Reliable','Design for the realities of daily operations and demanding environments.'],['Secure','Treat trust and customer data ownership as part of good engineering.'],['Partnership-focused','Stay alongside your team from first conversation through support.']].map(([title,copy])=><article className="value-item" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></Reveal>
    </div></section>
    <section className="section-pad"><div className="container-wide">
      <Reveal className="split-head"><div><div className="eyebrow">FROM DISCOVERY TO SUPPORT</div><h2 className="section-title">One team, all the way through.</h2></div><p className="section-copy">Our process gives the work enough structure to move forward—and enough room to fit the systems and people already in place.</p></Reveal>
      <Reveal className="process-line stagger">{[['01','Discover','Understand your needs and environment.'],['02','Design','Plan a system that fits.'],['03','Build','Bring devices and software together.'],['04','Deploy','Put the solution into use.'],['05','Support','Stay available as you grow.']].map(([n,title,copy])=><div className="process-step" key={n}><div className="step-node">{n}</div><h3>{title}</h3><p>{copy}</p></div>)}</Reveal>
    </div></section>
    <section className="cta-band"><div className="container-wide cta-inner"><div><h2>Let's make something dependable and useful.</h2><p>Start with a conversation about your operation.</p></div><Link href="/contact" className="btn btn-primary" data-testid="link-about-contact">Contact Optimus <ArrowRight size={16}/></Link></div></section>
  </main></Layout>;
}

// Email: name@domain.tld (TLD of 2+ letters, no spaces).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
// Phone characters allowed while typing: digits, spaces, + ( ) - .
const PHONE_ALLOWED = /[^\d+()\-.\s]/g;

function validateEmail(value: string) {
  if (!value.trim()) return 'Please enter your email address.';
  return EMAIL_PATTERN.test(value.trim()) ? '' : 'Please enter a valid email address, e.g. name@company.com.';
}

// Optional field. US numbers: 10 digits (or 11 starting with 1). International: starts with + and has 8-15 digits.
function validatePhone(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const invalid = 'Please enter a valid phone number, e.g. (555) 123-4567 or +1 555 123 4567.';
  if (!/^\+?[\d\s().-]+$/.test(trimmed) || trimmed.indexOf('+') > 0) return invalid;
  const digits = trimmed.replace(/\D/g, '');
  if (trimmed.startsWith('+')) return digits.length >= 8 && digits.length <= 15 ? '' : invalid;
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1')) ? '' : invalid;
}

type FormValues = { name: string; email: string; phone: string; service: string; message: string; consent: boolean };
type FieldName = 'name' | 'email' | 'phone' | 'message';

function validateField(field: FieldName, values: FormValues) {
  switch (field) {
    case 'name': return values.name.trim() ? '' : 'Please enter your name.';
    case 'email': return validateEmail(values.email);
    case 'phone': return validatePhone(values.phone);
    case 'message': return values.message.trim() ? '' : 'Please tell us a little about your project.';
  }
}

function ContactForm({ initialService = '' }: { initialService?: string }) {
  const emptyValues: FormValues = { name: '', email: '', phone: '', service: initialService, message: '', consent: false };
  const [values, setValues] = useState<FormValues>(emptyValues);
  // Errors are only shown for fields the visitor has already left (or after a submit attempt).
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fields: FieldName[] = ['name', 'email', 'phone', 'message'];
  const errors = Object.fromEntries(fields.map((f) => [f, validateField(f, values)])) as Record<FieldName, string>;
  const isValid = fields.every((f) => !errors[f]) && values.consent;
  const shownError = (f: FieldName) => (touched[f] ? errors[f] : '');

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setSuccess(false);
  };
  const markTouched = (f: FieldName) => setTouched((t) => ({ ...t, [f]: true }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess(false);
    if (!isValid) {
      setTouched({ name: true, email: true, phone: true, message: true });
      return;
    }
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!accessKey) {
      setError('Contact form setup is incomplete. Please configure VITE_WEB3FORMS_KEY before accepting inquiries.');
      return;
    }
    const form = event.currentTarget;
    const botcheck = (form.elements.namedItem('botcheck') as HTMLInputElement | null)?.checked ?? false;
    const payload = {
      access_key: accessKey,
      subject: `New Optimus inquiry: ${values.service || 'General inquiry'}`,
      from_name: 'Optimus Website',
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      service: values.service || 'Not specified',
      message: values.message.trim(),
      consent: 'I agree',
      botcheck,
    };
    setLoading(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Your message could not be sent. Please try again.');
      setValues({ ...emptyValues, service: '' });
      setTouched({});
      setSuccess(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Your message could not be sent. Please try again.');
    } finally { setLoading(false); }
  }

  const fieldClass = (f: FieldName) => `form-field ${shownError(f) ? 'has-error' : ''}`;
  const errorText = (f: FieldName, id: string) => shownError(f) ? <p className="field-error" id={id} data-testid={`error-${f}`}>{shownError(f)}</p> : null;
  const a11y = (f: FieldName, id: string) => ({ 'aria-invalid': Boolean(shownError(f)), 'aria-describedby': shownError(f) ? id : undefined });

  return <form className="contact-form" onSubmit={handleSubmit} noValidate data-testid="form-contact">
    {success && <div className="form-feedback form-success" role="status" data-testid="status-contact-success">Thank you. Our team will get back to you within one business day.</div>}
    {error && <div className="form-feedback form-error" role="alert" data-testid="status-contact-error">{error}</div>}
    <div className="form-stack">
      <div className={fieldClass('name')}><label htmlFor="fullName">Full Name</label><input id="fullName" name="name" autoComplete="name" maxLength={100} placeholder="Enter your name" value={values.name} onChange={(e) => update('name', e.target.value)} onBlur={() => markTouched('name')} {...a11y('name', 'fullName-error')} data-testid="input-full-name" />{errorText('name', 'fullName-error')}</div>
      <div className={fieldClass('email')}><label htmlFor="workEmail">Email Address</label><input id="workEmail" name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} placeholder="Enter your email" value={values.email} onChange={(e) => update('email', e.target.value)} onBlur={() => markTouched('email')} {...a11y('email', 'workEmail-error')} data-testid="input-work-email" />{errorText('email', 'workEmail-error')}</div>
      <div className={fieldClass('phone')}><label htmlFor="phone">Phone Number <span className="optional-label">(optional)</span></label><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="e.g. (555) 123-4567" value={values.phone} onChange={(e) => update('phone', e.target.value.replace(PHONE_ALLOWED, ''))} onBlur={() => markTouched('phone')} {...a11y('phone', 'phone-error')} data-testid="input-phone" />{errorText('phone', 'phone-error')}</div>
      <div className="form-field"><label htmlFor="service">Area of Interest</label><select id="service" name="service" value={values.service} onChange={(e) => update('service', e.target.value)} data-testid="select-service"><option value="">Select a service area</option>{services.map(s=><option value={s.title} key={s.title}>{s.title}</option>)}<option value="Other">Other</option></select></div>
      <div className={fieldClass('message')}><label htmlFor="message">Message</label><textarea id="message" name="message" maxLength={3000} placeholder="Tell us about your project goals..." value={values.message} onChange={(e) => update('message', e.target.value)} onBlur={() => markTouched('message')} {...a11y('message', 'message-error')} data-testid="input-message" />{errorText('message', 'message-error')}</div>
      <div className="botcheck" aria-hidden="true"><label htmlFor="botcheck">Leave this box unchecked</label><input id="botcheck" name="botcheck" type="checkbox" value="true" tabIndex={-1} autoComplete="off" data-testid="input-botcheck" /></div>
    </div>
    <label className="consent-row"><input type="checkbox" name="consent" checked={values.consent} onChange={(e) => update('consent', e.target.checked)} data-testid="checkbox-consent" /><span>I agree that Optimus may use the information I provide to respond to my inquiry. See the <Link href="/privacy" data-testid="link-contact-privacy">Privacy Policy</Link>.</span></label>
    <button className="btn btn-primary btn-block" type="submit" disabled={!isValid || loading} aria-disabled={!isValid || loading} data-testid="button-submit-contact">{loading ? <>Sending your message <span aria-hidden="true">…</span></> : <>Send Message <ArrowRight size={17}/></>}</button>
    {!isValid && !loading && <p className="form-hint" data-testid="text-form-hint">Fill in your name, a valid email and a message, then tick the consent box to send.</p>}
  </form>;
}

function ContactSection({ initialService = '', id }: { initialService?: string; id?: string }) {
  const details = [
    { label: 'Email us', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, Icon: Mail, testId: 'link-contact-email', external: false },
    { label: 'Call us', value: CONTACT_PHONE, href: CONTACT_PHONE_HREF, Icon: Phone, testId: 'link-contact-phone', external: false },
    { label: 'Website', value: WEBSITE_LABEL, href: WEBSITE_URL, Icon: Globe, testId: 'link-contact-website', external: true },
    { label: 'Office', value: OFFICE_LOCATION, href: MAPS_URL, Icon: MapPin, testId: 'link-contact-office', external: true },
  ];
  return <section className="section-pad contact-section" id={id}><div className="container-wide contact-layout">
    <div className="contact-intro">
      <div className="eyebrow">CONTACT US</div>
      <h2>Let&apos;s build the future together</h2>
      <p>Ready to scale your business with AI and intelligent software? Our team of experts is standing by to turn your vision into digital reality.</p>
      <ul className="contact-list">
        {details.map(({ label, value, href, Icon, testId, external }) => <li key={label}>
          <a className="contact-item" href={href} data-testid={testId} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <span className="contact-icon"><Icon size={21} /></span>
            <span><small>{label}</small><strong>{value}</strong></span>
          </a>
        </li>)}
      </ul>
      <div className="contact-follow"><span>Follow Optimus</span><SocialLinks /></div>
      <div className="map-card">
        <svg className="map-roads" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M0 100 C60 95 70 115 90 120" stroke="#a9d3e6" strokeWidth="14" fill="none" opacity=".6"/>
          <rect x="170" y="20" width="70" height="44" rx="6" fill="#cfe5dc" opacity=".8"/>
          <rect x="300" y="140" width="80" height="60" rx="6" fill="#cfe5dc" opacity=".7"/>
          <path d="M-10 160 C80 140 120 170 210 150 S330 110 420 120" stroke="#fff" strokeWidth="10" fill="none" opacity=".85"/>
          <path d="M120 -10 C140 60 110 120 150 230" stroke="#fff" strokeWidth="7" fill="none" opacity=".75"/>
          <path d="M280 -10 C270 70 300 140 280 230" stroke="#fff" strokeWidth="5" fill="none" opacity=".7"/>
          <path d="M-10 60 L420 85" stroke="#fff" strokeWidth="4" fill="none" opacity=".6"/>
          <path d="M20 200 C110 190 170 205 400 190" stroke="#c9dbe6" strokeWidth="3" fill="none"/>
        </svg>
        <div className="map-chip"><MapPin size={15} /> {OFFICE_LOCATION}</div>
        <span className="map-pin"><MapPin size={22} /></span>
        <a className="btn btn-outline map-directions" href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="link-map-directions">Get directions</a>
      </div>
    </div>
    <ContactForm initialService={initialService} />
  </div></section>;
}

function ContactPage() {
  const params = new URLSearchParams(window.location.search);
  const initialService = services.some(s => s.title === params.get('service')) ? params.get('service')! : '';
  return <Layout><main>
    <SubHero eyebrow="CONTACT US" title="Tell us what your operation needs.">Share a little about your equipment, systems, or goals. Our team will review your message and get back to you within one business day.</SubHero>
    <ContactSection initialService={initialService} />
  </main></Layout>;
}

// Open roles shown on the Careers page. Leave the list empty when not hiring and the
// page shows a "no open positions" message. To post a role, add an entry like:
// { title: 'Software Engineer', location: 'Saginaw, MI', type: 'Full-time', summary: 'Build web and IoT platforms with our engineering team.' },
type JobOpening = { title: string; location: string; type: string; summary: string };
const openPositions: JobOpening[] = [];

function careersMailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

function CareersPage() {
  const hiring = openPositions.length > 0;
  return <Layout><main>
    <SubHero eyebrow="CAREERS" title="Build what keeps operations moving.">Join a team that brings quality, software, IoT, and AI together to solve real problems for the businesses we serve.</SubHero>
    <section className="section-pad"><div className="container-wide">
      <Reveal className="split-head"><div><div className="eyebrow">OPEN POSITIONS</div><h2 className="section-title">{hiring ? 'Current openings.' : 'No open positions right now.'}</h2></div><p className="section-copy">{hiring ? 'Find a role that fits your experience and send us your resume. We review every application.' : 'We are not hiring at the moment, but we are growing. Check back here for future openings.'}</p></Reveal>
      {hiring
        ? <Reveal className="job-list stagger">{openPositions.map((job) => <article className="job-card" key={job.title} data-testid="card-job">
            <div className="job-main"><h3>{job.title}</h3><p>{job.summary}</p><div className="job-meta"><span><MapPin size={14} />{job.location}</span><span><Clock size={14} />{job.type}</span></div></div>
            <a className="btn btn-primary" href={careersMailto(`Application: ${job.title}`)}>Apply <ArrowRight size={15} /></a>
          </article>)}</Reveal>
        : null}
    </div></section>
    <section className="capability-band section-pad"><div className="container-wide">
      <Reveal><div className="eyebrow">WHY OPTIMUS</div><h2 className="section-title">Work that shows up in the real world.</h2></Reveal>
      <Reveal><div className="values-grid">{[['Real impact','Your work runs on vehicles, machines, and sites that businesses depend on every day.'],['Broad experience','Work across quality, hardware, software, and data instead of one narrow slice.'],['Small team','Ideas move quickly, and everyone has a voice in how we build.'],['Room to grow','Take on new challenges as we expand into new services and industries.']].map(([title,copy])=><article className="value-item" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></Reveal>
    </div></section>
    <section className="cta-band"><div className="container-wide cta-inner"><div><h2>Have a question about working at Optimus?</h2><p>Reach out and our team will get back to you.</p></div><Link href="/contact" className="btn btn-primary" data-testid="link-careers-contact">Contact us <ArrowRight size={16}/></Link></div></section>
  </main></Layout>;
}

function PrivacyPage() {
  return <Layout><main>
    <SubHero eyebrow="PRIVACY" title="A clear approach to your information.">This policy describes how Optimus handles information submitted through this website.</SubHero>
    <section className="section-pad"><div className="container-wide privacy-content">
      <div className="eyebrow">WEBSITE CONTACT PRIVACY</div>
      <h2>Contact form information</h2><p>Information you submit through the Optimus contact form is used only to review and respond to your inquiry. We do not use contact form information for unrelated purposes.</p>
      <h2>What you may provide</h2><p>The form asks for your name, email address, and message, with optional details such as your phone number and area of interest. It also includes a consent checkbox and a hidden botcheck field.</p>
      <h2>How information is handled</h2><p>Contact submissions are sent to Optimus using Web3Forms so our team can respond. Please do not include sensitive personal or confidential information in your message. Optimus does not claim that this website contact form is intended for sensitive data.</p>
      <h2>Your choices</h2><p>You may choose not to submit the form. If you have questions about information you have sent, contact Optimus through the contact page.</p>
      <h2>Changes to this policy</h2><p>We may update this page as our website or contact process changes. Any update will be reflected here.</p>
      <Link href="/contact" className="text-link" data-testid="link-privacy-contact">Go to contact page <ArrowRight size={15}/></Link>
    </div></section>
  </main></Layout>;
}

function BrandedNotFound() {
  return <Layout><main className="notfound"><div><div className="eyebrow" style={{justifyContent:'center'}}>PAGE NOT FOUND</div><h1>Not this route.</h1><p>The page may have moved, or the address may be incomplete.</p><Link href="/" className="btn btn-primary" data-testid="link-notfound-home">Return to Optimus <ArrowRight size={15}/></Link></div></main></Layout>;
}

function Router() {
  const [location] = useLocation();
  const route = location.split('?')[0].replace(/\/$/, '') || '/';
  usePageMeta(route);
  return <RoutedErrorBoundary>
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/solutions" component={SolutionsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route component={BrandedNotFound} />
    </Switch>
  </RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
