import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Faq } from "../data/site";

export type GoFn = (page: string, countryId?: string) => void;

export const faNum = (v: number | string): string =>
  String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export function Reveal({
  children,
  delay = 0,
  className,
  y = 26,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  badge,
  title,
  desc,
  center = true,
  dark = false,
}: {
  badge: string;
  title: string;
  desc?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <Reveal className={center ? "text-center" : "text-start"}>
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-bold ${
          dark ? "bg-white/10 text-amber-300" : "bg-teal-700/10 text-teal-800"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-amber-400" : "bg-teal-600"}`} />
        {badge}
      </span>
      <h2
        className={`mt-4 text-3xl font-black leading-[1.35] md:text-4xl md:leading-[1.3] ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-3 max-w-2xl text-[15px] leading-8 md:text-base md:leading-9 ${
            center ? "mx-auto" : ""
          } ${dark ? "text-slate-300" : "text-slate-600"}`}
        >
          {desc}
        </p>
      )}
    </Reveal>
  );
}

export function FaqList({ faqs, tone = "light" }: { faqs: Faq[]; tone?: "light" | "sand" }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
              isOpen
                ? "border-teal-600/40 bg-white shadow-[0_10px_36px_-16px_rgba(15,118,110,0.35)]"
                : tone === "sand"
                  ? "border-stone-200 bg-white/70 hover:border-teal-600/30"
                  : "border-stone-200 bg-white hover:border-teal-600/30"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start"
            >
              <span className="text-[15px] font-bold leading-7 text-slate-800">{f.q}</span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                  isOpen ? "rotate-180 bg-teal-700 text-white" : "bg-stone-100 text-slate-500"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <p className="px-5 pb-5 text-sm leading-8 text-slate-600">{f.a}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export function Meter({ value, color = "bg-teal-600" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200/80">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </div>
  );
}
