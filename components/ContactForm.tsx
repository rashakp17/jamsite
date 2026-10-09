"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";
import { easeSoft } from "./ui/motion";

type Fields = { name: string; email: string; topic: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const topics = ["An order", "Wholesale", "Gifting & corporate", "Something else"];

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "We'll need a valid email to reply.";
  if (f.message.trim().length < 10) e.message = "A few more words, please. At least 10 characters.";
  return e;
}

const inputClass =
  "peer mt-1 w-full border-0 border-b-2 border-ink/20 bg-transparent px-0 py-3 font-display font-bold text-2xl text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-ink aria-[invalid=true]:border-jam sm:text-3xl";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label text-ink-soft">
        {label}
      </label>
      <div className="relative">
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-jam transition-transform duration-700 ease-[var(--ease-soft)] peer-focus:scale-x-100"
        />
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-jam">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length === 0) setSent(true);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeSoft }}
          role="status"
          className="border-t border-ink/15 pt-10"
        >
          <p className="font-display text-6xl leading-[0.92] tracking-tight sm:text-7xl">
            Thank you, <em className="text-jam">{fields.name.split(" ")[0]}.</em>
          </p>
          <p className="mt-6 max-w-md text-ink-soft">
            Your note has reached the kitchen. We&rsquo;ll write back to {fields.email} within one working day.
          </p>
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={onSubmit} noValidate className="grid gap-10 sm:grid-cols-2">
          <Field id="c-name" label="Your name" error={errors.name}>
            <input
              id="c-name"
              autoComplete="name"
              value={fields.name}
              onChange={set("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "c-name-err" : undefined}
              className={inputClass}
              placeholder="Ananya Rao"
            />
          </Field>
          <Field id="c-email" label="Email" error={errors.email}>
            <input
              id="c-email"
              type="email"
              autoComplete="email"
              value={fields.email}
              onChange={set("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "c-email-err" : undefined}
              className={inputClass}
              placeholder="you@example.com"
            />
          </Field>

          <fieldset className="sm:col-span-2">
            <legend className="label text-ink-soft">What&rsquo;s it about?</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {topics.map((t) => {
                const selected = fields.topic === t;
                return (
                  <label
                    key={t}
                    className={`relative cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 ${
                      selected ? "border-ink text-cream" : "border-ink/20 hover:border-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="topic"
                      value={t}
                      checked={selected}
                      onChange={() => setFields((f) => ({ ...f, topic: t }))}
                      className="sr-only"
                    />
                    {selected && (
                      <motion.span
                        layoutId="topic-pill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{t}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <Field id="c-message" label="Message" error={errors.message}>
              <textarea
                id="c-message"
                rows={3}
                value={fields.message}
                onChange={set("message")}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "c-message-err" : undefined}
                className={`${inputClass} resize-none`}
                placeholder="Tell us everything…"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="h-14" icon={<ArrowRight className="h-4 w-4" />}>
              Send note
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
