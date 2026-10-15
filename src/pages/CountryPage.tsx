import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Briefcase, CalendarCheck, CheckCircle2, ClipboardCheck, Clock3, Download,
  FileCheck2, Globe2, Languages, ListChecks, MapPin, Route, TrendingUp,
} from "lucide-react";
import { COUNTRIES, type CountryId } from "../data/site";
import { FaqList, Meter, Reveal, SectionHead, faNum, type GoFn } from "../components/ui";

export default function CountryPage({ countryId, go }: { countryId: CountryId; go: GoFn }) {
  const country = COUNTRIES.find((c) => c.id === countryId) ?? COUNTRIES[0];
  const others = COUNTRIES.filter((c) => c.id !== country.id);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const progress = useMemo(
    () => Math.round((checked.size / country.documents.length) * 100),
    [checked, country.documents.length]
  );

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const downloadChecklist = () => {
    const lines = [
      `چک‌لیست مدارک — مسیر ${country.name} | پل اوتیسم (AutismBridge)`,
      "=".repeat(46),
      ...country.documents.map((d, i) => `${checked.has(i) ? "[✓]" : "[ ]"} ${d}`),
      "",
      `پیشرفت آماده‌سازی: ${progress}٪`,
      "منبع: autismbridge — راهنمای کشورها",
    ];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-${country.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-[132px] lg:pt-[148px]">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <nav className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-semibold text-slate-500">
              <button onClick={() => go("home")} className="hover:text-teal-700">خانه</button>
              <span>/</span>
              <span>راهنمای کشورها</span>
              <span>/</span>
              <span className={country.accentText}>{country.name}</span>
            </nav>
          </Reveal>

          <div className="relative mt-5 overflow-hidden rounded-[28px] shadow-2xl shadow-slate-900/20">
            <img src={country.image} alt={country.name} className="h-[380px] w-full object-cover md:h-[440px]" />
            <div className="absolute inset-0 bg-pine/45" />
            <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-10">
              <Reveal>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[12.5px] font-bold text-white ring-1 ring-white/30 backdrop-blur">
                  <MapPin className="h-4 w-4" /> {country.cities}
                </span>
                <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">
                  راهنمای کار و فعالیت در {country.name}
                  <span dir="ltr" className="ms-3 align-middle text-2xl font-bold text-white/70 md:text-3xl">{country.en}</span>
                </h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-8 text-white/85">{country.tagline}</p>
              </Reveal>
            </div>
            <span className={`absolute left-6 top-6 grid h-14 w-14 place-items-center rounded-2xl text-lg font-black text-white shadow-xl ${country.accent}`}>
              {country.code}
            </span>
          </div>

          {/* stats */}
          <div className="relative z-10 mx-auto -mt-10 grid max-w-5xl grid-cols-2 gap-3 px-2 lg:grid-cols-4">
            {country.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.07}>
                <div className="h-full rounded-2xl bg-white px-4 py-4 text-center shadow-[0_16px_40px_-20px_rgba(29,42,39,0.35)] ring-1 ring-stone-200/70">
                  <p className={`text-lg font-black md:text-xl ${country.accentText}`}>{s.value}</p>
                  <p className="mt-1 text-[11.5px] font-medium leading-5 text-slate-500">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OVERVIEW ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <SectionHead center={false} badge="تصویر کلی" title={`واقعیت کار در حوزه اوتیسم در ${country.name}`} />
            <div className="mt-5 space-y-4">
              {country.overview.map((p, i) => (
                <p key={i} className="text-[15px] leading-9 text-slate-600">{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="rounded-3xl bg-pine p-7 text-white">
              <Languages className="h-9 w-9 text-amber-400" />
              <p className="mt-4 text-[12px] font-bold uppercase tracking-wider text-teal-300">سطح زبان موردنیاز</p>
              <h3 className="mt-1.5 text-xl font-black">{country.language.level}</h3>
              <h4 className="mt-3 text-[15px] font-bold text-amber-300">{country.language.title}</h4>
              <p className="mt-2 text-sm leading-8 text-slate-300">{country.language.desc}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ROADMAP ============ */}
      <section className="bg-white py-16 ring-1 ring-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHead badge="نقشه راه" title={country.stepsTitle} desc="ترتیب مراحل مهم است؛ شروع زودهنگام مرحله زبان، کل زمان مسیر را ماه‌ها کوتاه می‌کند." />
          <div className="relative mx-auto mt-14 max-w-3xl">
            <span className="absolute bottom-4 right-[27px] top-4 w-px bg-stone-200 md:right-1/2" />
            {country.steps.map((s, i) => (
              <Reveal key={s.title} delay={0.05}>
                <div className={`relative flex gap-5 pb-10 last:pb-0 md:w-1/2 ${i % 2 === 0 ? "md:pe-14" : "md:me-auto md:ps-14"}`}>
                  <span className={`absolute right-0 top-0 z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-black text-white shadow-lg ${i % 2 === 0 ? "md:-left-7 md:right-auto" : "md:-right-7"} ${country.accent}`}>
                    {faNum(i + 1)}
                  </span>
                  <div className="ms-16 flex-1 rounded-3xl bg-cream p-6 ring-1 ring-stone-200/70 md:ms-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-[15.5px] font-black text-slate-900">{s.title}</h3>
                      <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-500 ring-1 ring-stone-200">
                        <Clock3 className="h-3.5 w-3.5" /> {s.duration}
                      </span>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-8 text-slate-600">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ROLES + DOCUMENTS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* roles */}
          <Reveal>
            <div className="h-full rounded-3xl bg-white p-7 shadow-[0_16px_44px_-26px_rgba(29,42,39,0.3)] ring-1 ring-stone-200/70">
              <h3 className="flex items-center gap-2.5 text-lg font-black text-slate-900">
                <span className={`grid h-10 w-10 place-items-center rounded-xl text-white ${country.accent}`}><Briefcase className="h-5 w-5" /></span>
                مشاغل پرتقاضا و بازه درآمدی
              </h3>
              <div className="mt-6 space-y-5">
                {country.roles.map((r) => (
                  <div key={r.title}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800">
                        {r.title}
                        <span dir="ltr" className="ms-2 text-[11.5px] font-semibold text-slate-400">{r.local}</span>
                      </p>
                      <p className={`text-[13px] font-black ${country.accentText}`}>{r.salary}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1"><Meter value={r.demand} color={country.accent} /></div>
                      <span className="flex items-center gap-1 text-[11.5px] font-bold text-slate-500">
                        <TrendingUp className="h-3.5 w-3.5" /> تقاضا {faNum(r.demand)}٪
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-2xl bg-sand/70 px-4 py-3 text-[12.5px] leading-7 text-slate-600">
                بازه‌ها میانگین آگهی‌های استخدامی مراکز اوتیسم و توانبخشی در سال ۲۰۲۵ است و با سابقه، زبان و شهر مقصد تغییر می‌کند.
              </p>
            </div>
          </Reveal>

          {/* documents checklist */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl bg-white p-7 shadow-[0_16px_44px_-26px_rgba(29,42,39,0.3)] ring-1 ring-stone-200/70">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2.5 text-lg font-black text-slate-900">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl text-white ${country.accent}`}><ListChecks className="h-5 w-5" /></span>
                  چک‌لیست تعاملی مدارک
                </h3>
                <span className={`rounded-full px-3 py-1 text-[12px] font-black ring-1 ${country.ring} ${country.accentText} bg-white`}>
                  {faNum(progress)}٪ آماده
                </span>
              </div>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-stone-200/80">
                <motion.div
                  className={`h-full rounded-full ${country.accent}`}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <ul className="mt-5 space-y-2">
                {country.documents.map((d, i) => {
                  const done = checked.has(i);
                  return (
                    <li key={d}>
                      <button
                        onClick={() => toggle(i)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-start text-[13.5px] font-semibold transition-all ${
                          done ? "bg-teal-700/8 text-slate-500 ring-1 ring-teal-600/25" : "bg-cream text-slate-700 ring-1 ring-stone-200/70 hover:ring-teal-600/30"
                        }`}
                      >
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg transition-colors ${done ? "bg-teal-700 text-white" : "bg-white text-transparent ring-1 ring-stone-300"}`}>
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <span className={done ? "line-through decoration-teal-600/50" : ""}>{d}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={downloadChecklist}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90 ${country.accent}`}
                >
                  <Download className="h-4 w-4" /> دانلود چک‌لیست من
                </button>
                {checked.size > 0 && (
                  <button onClick={() => setChecked(new Set())} className="rounded-full px-5 py-2.5 text-[13px] font-bold text-slate-500 ring-1 ring-stone-300 transition-colors hover:text-slate-700">
                    شروع دوباره
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ALT PATHS ============ */}
      <section className="bg-white py-16 ring-1 ring-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHead badge="مسیرهای جایگزین" title={`فقط یک راه برای ورود به ${country.name} وجود ندارد`} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {country.altPaths.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.09}>
                <div className="flex h-full flex-col rounded-3xl bg-cream p-7 ring-1 ring-stone-200/70 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl text-white ${country.accent}`}>
                    <Route className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[15.5px] font-black leading-7 text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-8 text-slate-600">{p.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-[12.5px] font-semibold leading-6 text-slate-700">
                        <FileCheck2 className={`mt-1 h-4 w-4 shrink-0 ${country.accentText}`} /> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ + OTHERS + CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionHead center={false} badge="پرسش‌های پرتکرار" title={`سؤال‌های رایج درباره ${country.name}`} />
            <div className="mt-7">
              <FaqList faqs={country.faqs} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <SectionHead center={false} badge="مقایسه کنید" title="دو مقصد دیگر را هم ببینید" />
            <div className="mt-7 space-y-4">
              {others.map((o) => (
                <button
                  key={o.id}
                  onClick={() => { go("country", o.id); setChecked(new Set()); }}
                  className="group flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-start ring-1 ring-stone-200/80 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <img src={o.image} alt={o.name} className="h-16 w-20 shrink-0 rounded-2xl object-cover" />
                  <span className="flex-1">
                    <span className="block text-[15px] font-black text-slate-900">{o.name}</span>
                    <span className="mt-0.5 block text-[12px] leading-5 text-slate-500">{o.tagline}</span>
                  </span>
                  <ArrowLeft className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:-translate-x-1 group-hover:text-teal-700" />
                </button>
              ))}
              <div className="rounded-3xl bg-pine p-7 text-white">
                <ClipboardCheck className="h-8 w-8 text-amber-400" />
                <h3 className="mt-3 text-lg font-black">پرونده شما برای {country.name} چقدر آماده است؟</h3>
                <p className="mt-2 text-sm leading-8 text-slate-300">در جلسه ارزیابی پرونده، مدارک و سطح زبانتان بررسی و فاصله تا استخدام یا تأسیس مرکز دقیق برآورد می‌شود.</p>
                <button onClick={() => go("services")} className="mt-5 flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-black text-pine transition-colors hover:bg-amber-400">
                  <CalendarCheck className="h-4 w-4" /> رزرو ارزیابی پرونده
                </button>
                <p className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-teal-200/80">
                  <Globe2 className="h-4 w-4" /> آخرین به‌روزرسانی این راهنما: دی ۱۴۰۴
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
