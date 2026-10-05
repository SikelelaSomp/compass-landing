import type { ReactNode } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import RunwayChart from "./components/RunwayChart";
import logoNav from "./assets/logo-nav.png";
import heroImage from "./assets/hero.png";
import logoFooter from "./assets/logo-footer.png";

const EMAIL = "sikelelasompali5@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/sikelela-sompali";
const CTA = "Tell me what you'd want";

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const steps = [
  {
    title: "Connect what you already use",
    body: "Read-only access to Xero, Sage, or Zoho, so Compass can look but never change anything, with no new tool to switch to.",
  },
  {
    title: "See your forecast",
    body: "Your history turned into a clear view of cash and runway, shown as a range of likely outcomes rather than one fragile number.",
  },
  {
    title: "Test a decision first",
    body: "Ask \u201Cwhat if we hire two people in March?\u201D or \u201Cwhat if our biggest client leaves?\u201D and see the effect before committing.",
  },
];

const icp = [
  "South African software and digital businesses with recurring revenue",
  "Roughly 5 to 40 people",
  "Books kept in Xero, Sage, or Zoho",
  "No dedicated finance or data team",
  "A decision coming up that depends on cash (a hire, a raise, a funder report)",
];

export default function App() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <img src={logoNav} alt="" className="h-8 w-auto" />
            <span className="font-display text-xl font-semibold tracking-tight">Compass</span>
          </a>
          <Link to="/join" className="btn !px-4 !py-2 text-sm">
            Share your interest
          </Link>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.25fr_1fr] md:py-20">
          <div>
            <span className="inline-block rounded-full border border-line bg-card px-3 py-1 text-xs text-muted">
              Early stage · Not launched · Talking to founders
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Know what your cash will do before you make the decision.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Compass is a forecasting tool I&rsquo;m building for startup founders. It&rsquo;s meant to answer
              questions like &lsquo;can we afford this hire?&rsquo; and &lsquo;how many months of runway do we
              really have?&rsquo; using the numbers you already keep in Xero, Sage, or Zoho.
            </p>
            <p className="mt-4 max-w-xl text-muted">
              It isn&rsquo;t built yet. I&rsquo;m designing it with founders, so what you tell me shapes what gets
              built.
            </p>
            <Link to="/join" className="btn mt-8">
              {CTA}
            </Link>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src={heroImage}
              alt="Compass illustration"
              className="h-auto w-full max-w-sm md:max-w-md"
              fetchPriority="high"
            />
          </div>
        </section>

        {/* Problem */}
        <section className="bg-alt">
          <Reveal className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:px-8 md:grid-cols-2 md:gap-12">
            <div>
              <p className="eyebrow">The problem</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Your accounting tool shows you what already happened.
              </h2>
            </div>
            <p className="self-center text-lg text-muted">
              The decisions that matter are about what happens next: a hire, a raise, a new product, a client who pays
              late. Most small teams answer those in a spreadsheet they rebuild every month, or on instinct.
            </p>
          </Reveal>
        </section>

        {/* What Compass is meant to do */}
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <Reveal>
            <p className="eyebrow">What Compass is meant to do</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="rounded-2xl border border-line bg-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-brand-ink">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold leading-snug">{s.title}</h3>
                  </div>
                  <p className="mt-4 text-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-6">
            <RunwayChart />
            <p className="mt-3 text-sm text-muted">
              This is the plan, not a finished product. Details will change based on what founders tell me.
            </p>
          </Reveal>
        </section>

        {/* Who + where things stand */}
        <section className="bg-alt">
          <Reveal className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-2">
            <div>
              <p className="eyebrow">Who I&rsquo;m looking for</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
                I&rsquo;m looking for founders with:
              </h2>
              <ul className="mt-6 space-y-3">
                {icp.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-brand-ink">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-muted">
                Not quite you? You can still sign up, but you may not be who I can build for first.
              </p>
            </div>
            <div>
              <p className="eyebrow">Where things stand</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
                Still in the idea and validation stage.
              </h2>
              <p className="mt-6 text-lg text-muted">
                I&rsquo;m having conversations with founders to understand how they track money and forecast today, and
                I&rsquo;m looking for one or two companies to work with closely once there is something to try. There
                are no customers yet, and nothing here is a live product.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Final call to action */}
        <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{CTA}</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              You don&rsquo;t have to book a call. If you&rsquo;d rather just tell me you&rsquo;d use this, that&rsquo;s
              useful too.
            </p>
            <Link to="/join" className="btn mt-8">
              {CTA}
            </Link>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-footer text-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <img src={logoFooter} alt="Compass" className="footer-logo h-8 w-auto self-start" />
          <div className="space-y-2 text-sm">
            <p>Built by Sikelela Sompali, data engineer, Eastern Cape.</p>
            <p className="flex flex-wrap gap-x-5 gap-y-1">
              <a className="underline-offset-4 hover:underline" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <a className="underline-offset-4 hover:underline" href={LINKEDIN} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </p>
          </div>
          <p className="max-w-xs text-xs text-white/60">
            Your details are only used to contact you about Compass and are never sold or shared.
          </p>
        </div>
      </footer>
    </div>
  );
}