import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { Check } from "lucide-react";
import logoNav from "../assets/logo-nav.png";
import { submitFollowup, submitInterest, type BestTime, type Interest, type Method } from "../lib/api";

const EMAIL = "sikelelasompali5@gmail.com";
const ROLES = ["Founder / CEO", "COO / Operations", "Finance manager / Bookkeeper", "Other"];
const ERR = "text-[#b4533a]";

const inputCls = (err?: string) =>
  `w-full rounded-lg border bg-card px-3.5 py-3 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 ${
    err ? "border-[#b4533a]" : "border-line"
  }`;

type Step = "form" | "followup" | "done";
type Errors = Partial<Record<"name" | "email" | "role" | "interest" | "consent", string>>;

function Header() {
  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoNav} alt="" className="h-8 w-auto" />
          <span className="font-display text-xl font-semibold tracking-tight">Compass</span>
        </Link>
        <Link to="/" className="text-sm font-medium underline-offset-4 hover:underline">
          Back to home
        </Link>
      </div>
    </header>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
        {label}
        {optional && (
          <span className="rounded-full bg-alt px-2 py-0.5 text-xs font-normal text-muted">optional</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && (
        <p role="alert" className={`mt-1.5 text-xs ${ERR}`}>
          {error}
        </p>
      )}
    </div>
  );
}

function Choice({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
        selected ? "border-brand bg-brand/5" : "border-line bg-card hover:border-brand/50"
      }`}
    >
      <input type="radio" name="interest" checked={selected} onChange={onSelect} className="sr-only" />
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-brand bg-brand text-brand-ink" : "border-line"
        }`}
      >
        {selected && <Check className="h-4 w-4" aria-hidden />}
      </span>
      <span className="font-medium">{children}</span>
    </label>
  );
}

function Pill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        selected ? "border-brand bg-brand text-brand-ink" : "border-line bg-card hover:border-brand/50"
      }`}
    >
      {children}
    </button>
  );
}

export default function Join() {
  const [step, setStep] = useState<Step>("form");
  const [leadId, setLeadId] = useState<string | null>(null);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [interest, setInterest] = useState<Interest | "">("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot, humans never see it
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  // Step 2
  const [wantsTalk, setWantsTalk] = useState(false);
  const [method, setMethod] = useState<Method | null>(null);
  const [time, setTime] = useState<BestTime | null>(null);
  const [decision, setDecision] = useState("");
  const [extraPhone, setExtraPhone] = useState("");
  const [followErr, setFollowErr] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = "Please tell me your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Please enter a valid email address.";
    if (!role) e.role = "Please choose your role.";
    if (!interest) e.interest = "Please choose one.";
    if (!consent) e.consent = "I need your OK to contact you.";
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setSendError(false);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (website) {
      setStep("done"); // bot filled the hidden field; pretend success, save nothing
      return;
    }

    setSending(true);
    try {
      const id = await submitInterest({
        name,
        email,
        phone,
        role,
        interest: interest as Interest,
        consent,
      });
      setLeadId(id);
      setStep("followup");
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  const needsPhone = (method === "whatsapp" || method === "phone") && !phone.trim();

  async function onNotNow() {
    if (leadId) {
      try {
        await submitFollowup(leadId, { wantsToTalk: false, method: null, time: null, decision: "", phone: null });
      } catch {
        /* the lead is already saved; don't block the thank-you */
      }
    }
    setStep("done");
  }

  async function onConfirm() {
    setFollowErr("");
    if (!method) {
      setFollowErr("Please choose how you'd like me to reach you.");
      return;
    }
    if (needsPhone && !extraPhone.trim()) {
      setFollowErr("Add a number so I can reach you that way.");
      return;
    }
    if (!leadId) return;
    setSending(true);
    try {
      await submitFollowup(leadId, {
        wantsToTalk: true,
        method,
        time,
        decision,
        phone: needsPhone ? extraPhone : null,
      });
      setStep("done");
    } catch {
      setFollowErr(`Something went wrong. Please email ${EMAIL} instead.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="px-5 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-line bg-card p-6 sm:p-8">
          {step === "form" && (
            <>
              <div className="text-center">
                <span className="inline-block rounded-full border border-line bg-alt px-3 py-1 text-xs text-muted">
                  Early stage · Not launched · Talking to founders
                </span>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  Tell me what you&rsquo;d want
                </h1>
                <p className="mx-auto mt-4 max-w-md text-muted">
                  Compass isn&rsquo;t built yet. I&rsquo;m shaping it with founders, so what you share here directly
                  influences what gets built.
                </p>
              </div>

              <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
                <Field label="Your name" htmlFor="name" error={errors.name}>
                  <input
                    id="name"
                    className={inputCls(errors.name)}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    maxLength={120}
                  />
                </Field>

                <Field
                  label="Personal email"
                  htmlFor="email"
                  hint="A personal email is fine."
                  error={errors.email}
                >
                  <input
                    id="email"
                    type="email"
                    className={inputCls(errors.email)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    maxLength={254}
                  />
                </Field>

                <Field label="WhatsApp or phone number" htmlFor="phone" optional>
                  <input
                    id="phone"
                    type="tel"
                    className={inputCls()}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    maxLength={40}
                  />
                </Field>

                <Field label="Your role" htmlFor="role" error={errors.role}>
                  <select
                    id="role"
                    className={inputCls(errors.role)}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select…</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                <fieldset>
                  <legend className="mb-1.5 text-sm font-semibold">How interested are you?</legend>
                  <div className="space-y-3">
                    <Choice selected={interest === "use"} onSelect={() => setInterest("use")}>
                      I&rsquo;d like to use this when it exists
                    </Choice>
                    <Choice selected={interest === "watching"} onSelect={() => setInterest("watching")}>
                      Just keeping an eye on it
                    </Choice>
                  </div>
                  {errors.interest && (
                    <p role="alert" className={`mt-1.5 text-xs ${ERR}`}>
                      {errors.interest}
                    </p>
                  )}
                </fieldset>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
                    />
                    <span>
                      I agree that Sikelela may contact me about Compass using these details. I can ask for them to
                      be deleted at any time.
                    </span>
                  </label>
                  {errors.consent && (
                    <p role="alert" className={`mt-1.5 text-xs ${ERR}`}>
                      {errors.consent}
                    </p>
                  )}
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <button type="submit" disabled={sending} className="btn w-full disabled:opacity-60">
                  {sending ? "Sending…" : "Send"}
                </button>

                {sendError && (
                  <p role="alert" className={`text-center text-sm ${ERR}`}>
                    Something went wrong. Please email {EMAIL} instead.
                  </p>
                )}

                <p className="text-center text-xs text-muted">
                  Your details are only used to contact you about Compass and are never sold or shared.
                </p>
              </form>
            </>
          )}

          {step === "followup" && (
            <>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-ink">
                  <Check className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-sm text-muted">Got it, thank you.</span>
              </div>

              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-[2.6rem]">
                Would you like to help me shape Compass?
              </h1>
              <p className="mt-5 text-muted">
                Tell me how you currently make decisions about your company&rsquo;s finances: how you track spending,
                how you decide whether you can afford something, and what you&rsquo;re planning next. A 20-minute
                chat. I&rsquo;m not selling anything.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setWantsTalk(true)} className="btn">
                  Yes, let&rsquo;s talk
                </button>
                <button
                  type="button"
                  onClick={onNotNow}
                  className="rounded-lg border border-brand px-6 py-3 font-semibold text-brand transition hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Not right now
                </button>
              </div>

              {wantsTalk && (
                <div className="mt-6 space-y-6 rounded-xl border border-line bg-alt p-5">
                  <div>
                    <p className="mb-2 text-sm font-semibold">Best way to reach you</p>
                    <div role="radiogroup" aria-label="Best way to reach you" className="flex flex-wrap gap-2">
                      <Pill selected={method === "email"} onClick={() => setMethod("email")}>
                        Email
                      </Pill>
                      <Pill selected={method === "whatsapp"} onClick={() => setMethod("whatsapp")}>
                        WhatsApp
                      </Pill>
                      <Pill selected={method === "phone"} onClick={() => setMethod("phone")}>
                        Phone call
                      </Pill>
                    </div>
                  </div>

                  {needsPhone && (
                    <Field label="Your number" htmlFor="extra-phone">
                      <input
                        id="extra-phone"
                        type="tel"
                        className={inputCls()}
                        value={extraPhone}
                        onChange={(e) => setExtraPhone(e.target.value)}
                        autoComplete="tel"
                        maxLength={40}
                      />
                    </Field>
                  )}

                  <div>
                    <p className="mb-2 text-sm font-semibold">Best time</p>
                    <div role="radiogroup" aria-label="Best time" className="flex flex-wrap gap-2">
                      {(["mornings", "afternoons", "evenings", "weekends"] as BestTime[]).map((t) => (
                        <Pill key={t} selected={time === t} onClick={() => setTime(t)}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <Field label="What decision are you weighing right now?" htmlFor="decision" optional>
                    <textarea
                      id="decision"
                      rows={3}
                      maxLength={1000}
                      className={inputCls()}
                      placeholder="e.g. Whether we can afford two more hires this year"
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                    />
                  </Field>

                  {followErr && (
                    <p role="alert" className={`text-sm ${ERR}`}>
                      {followErr}
                    </p>
                  )}

                  <button type="button" onClick={onConfirm} disabled={sending} className="btn w-full disabled:opacity-60">
                    {sending ? "Sending…" : "Confirm"}
                  </button>
                </div>
              )}
            </>
          )}

          {step === "done" && (
            <div className="py-6 text-center">
              <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Check className="h-12 w-12" strokeWidth={3} aria-hidden />
              </span>
              <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight">Thank you</h1>
              <p className="mx-auto mt-4 max-w-sm text-lg text-muted">
                I&rsquo;ll be in touch personally, and I&rsquo;ll be honest about where Compass stands when I do.
              </p>
              <Link
                to="/"
                className="mt-8 inline-flex rounded-lg border border-brand px-8 py-3 font-semibold text-brand transition hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Back to home
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}