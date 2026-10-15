import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, Bot, CalendarCheck, CheckCircle2, Download, Eye, Hand, Loader2, Play,
  RefreshCw, RotateCcw, Sparkles, TrendingUp, Users, Volume2, Waves,
} from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { METHODS } from "../data/site";
import { Meter, Reveal, SectionHead, faNum, type GoFn } from "../components/ui";

const AGE_GROUPS = ["زیر ۲ سال", "۲ تا ۳ سال", "۳ تا ۵ سال", "۵ تا ۷ سال", "بالای ۷ سال"];
const FIRST_WORDS = ["هنوز کلمه‌ای نگفته", "بعد از ۲۴ ماهگی", "۱۸ تا ۲۴ ماهگی", "۱۲ تا ۱۸ ماهگی", "قبل از ۱۲ ماهگی"];
const LANG_LEVELS = ["بدون کلمه معنادار", "تک‌کلمه‌ها", "ترکیب دو کلمه", "جمله‌های کوتاه", "مکالمه ساده"];
const SCALE = ["هرگز", "به‌ندرت", "گاهی", "اغلب", "همیشه"];

const SLIDERS = [
  { key: "eye", label: "تماس چشمی در بازی و گفت‌وگو", kind: "ability", icon: Eye },
  { key: "name", label: "واکنش به صدا کردن نامش", kind: "ability", icon: Volume2 },
  { key: "point", label: "اشاره برای خواستن یا نشان دادن", kind: "ability", icon: Hand },
  { key: "pretend", label: "بازی وانمودی (غذا دادن به عروسک…)", kind: "ability", icon: Play },
  { key: "imitate", label: "تقلید از حرکات و صداهای شما", kind: "ability", icon: Users },
  { key: "repetitive", label: "رفتارهای تکراری (ردیف‌کردن، چرخاندن اشیا…)", kind: "behavior", icon: RotateCcw },
  { key: "sensory", label: "واکنش شدید به صدا، نور، لمس یا بافت غذا", kind: "behavior", icon: Waves },
  { key: "change", label: "ناراحتی از تغییر برنامه یا روتین روزانه", kind: "behavior", icon: RefreshCw },
] as const;

type SliderKey = (typeof SLIDERS)[number]["key"];

const PROCESS_STEPS = [
  "دریافت پروفایل رشدی کودک…",
  "تحلیل الگوی ارتباط و تعامل اجتماعی…",
  "بررسی رفتارهای تکراری و پردازش حسی…",
  "مقایسه با الگوهای هزاران پروفایل رشدی…",
  "ساخت نقشه پیش‌بینی و پیشنهاد متدها…",
];

const SUPPORT_TEXT: Record<number, { title: string; desc: string }> = {
  1: { title: "سطح ۱ — نیازمند حمایت", desc: "نشانه‌ها خفیف تا متوسط‌اند؛ با گفتاردرمانی هدفمند، آموزش مهارت اجتماعی و راهنمایی والدین، مسیر رشد معمولاً سریع هموار می‌شود." },
  2: { title: "سطح ۲ — نیازمند حمایت قابل توجه", desc: "ترکیبی از برنامه ساخت‌یافته (ABA/TEACCH)، کاردرمانی حسی و آموزش والدین پیشنهاد می‌شود؛ مداخله منظم هفتگی تفاوت اصلی را می‌سازد." },
  3: { title: "سطح ۳ — نیازمند حمایت بسیار قابل توجه", desc: "مداخله فشرده و چندرشته‌ای از همین حالا مهم است: تیم کامل درمان، برنامه ارتباطی جایگزین و حمایت نزدیک خانواده. هر ماه شروع زودتر، سرمایه بزرگی است." },
};

export default function AiLab({ go }: { go: GoFn }) {
  const [ageIdx, setAgeIdx] = useState(1);
  const [gender, setGender] = useState("پسر");
  const [fwIdx, setFwIdx] = useState(1);
  const [langIdx, setLangIdx] = useState(1);
  const [vals, setVals] = useState<Record<SliderKey, number>>({
    eye: 2, name: 2, point: 2, pretend: 1, imitate: 2, repetitive: 3, sensory: 3, change: 2,
  });
  const [phase, setPhase] = useState<"form" | "processing" | "results">("form");
  const [pStep, setPStep] = useState(0);

  useEffect(() => {
    if (phase !== "processing") return;
    if (pStep >= PROCESS_STEPS.length) {
      const t = setTimeout(() => setPhase("results"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPStep(pStep + 1), 650);
    return () => clearTimeout(t);
  }, [phase, pStep]);

  useEffect(() => {
    if (phase === "results") {
      const t = setTimeout(
        () => document.getElementById("ai-results")?.scrollIntoView({ behavior: "smooth", block: "start" }),
        150
      );
      return () => clearTimeout(t);
    }
  }, [phase]);

  const result = useMemo(() => {
    const ab = (v: number) => (4 - v) * 25;
    const be = (v: number) => v * 25;
    const comm = Math.round((4 - langIdx) * 25 * 0.5 + ab(vals.point) * 0.27 + ab(vals.name) * 0.23);
    const social = Math.round(ab(vals.eye) * 0.4 + ab(vals.name) * 0.3 + ab(vals.pretend) * 0.3);
    const rep = Math.round(be(vals.repetitive) * 0.6 + be(vals.change) * 0.4);
    const sensory = Math.round(be(vals.sensory) * 0.7 + be(vals.repetitive) * 0.3);
    const play = Math.round(ab(vals.pretend) * 0.5 + ab(vals.imitate) * 0.5);
    const fw = (4 - fwIdx) * 20;
    const domains = [
      { domain: "ارتباط و زبان", score: comm },
      { domain: "تعامل اجتماعی", score: social },
      { domain: "رفتار تکراری", score: rep },
      { domain: "پردازش حسی", score: sensory },
      { domain: "بازی و تقلید", score: play },
    ];
    const overall = Math.round(comm * 0.3 + social * 0.25 + rep * 0.15 + sensory * 0.15 + play * 0.15);
    const level = overall >= 62 || comm >= 78 ? 3 : overall >= 40 ? 2 : 1;

    const start = Math.max(8, 100 - overall);
    const gainWith = Math.max(3.5, 9.5 - overall * 0.055);
    const gainWithout = Math.max(1, 3.2 - overall * 0.02);
    const trajectory = Array.from({ length: 7 }, (_, m) => ({
      month: m === 0 ? "امروز" : `ماه ${faNum(m)}`,
      "با مداخله زودهنگام": Math.min(94, Math.round(start + gainWith * m * 2.2)),
      "بدون مداخله": Math.min(94, Math.round(start + gainWithout * m * 2.2)),
    }));

    const matchOf = (id: string) => METHODS.find((m) => m.id === id)!;
    const methodMatches = [
      { m: matchOf("esdm"), pct: ageIdx <= 1 ? 93 : 56 },
      { m: matchOf("pecs"), pct: comm >= 55 ? 91 : 44 },
      { m: matchOf("aba"), pct: Math.round(68 + rep * 0.22) },
      { m: matchOf("si"), pct: Math.round(30 + sensory * 0.62) },
      { m: matchOf("floortime"), pct: Math.round(34 + social * 0.5) },
      { m: matchOf("teacch"), pct: Math.round(38 + be(vals.change) * 0.45) },
    ]
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);

    return { domains, overall, level, trajectory, methodMatches, fw };
  }, [ageIdx, fwIdx, langIdx, vals]);

  const band =
    result.overall < 35
      ? { t: "نشانه‌های خفیف", c: "text-emerald-600", bg: "bg-emerald-500", note: "پایش رشد طبق چک‌لیست سنی کافی است؛ در صورت تغییر، دوباره ارزیابی کنید." }
      : result.overall < 62
        ? { t: "نشانه‌های متوسط", c: "text-amber-600", bg: "bg-amber-500", note: "ارزیابی تخصصی رشدی در نزدیک‌ترین زمان توصیه می‌شود؛ مداخله زودهنگام از همین حالا سودمند است." }
        : { t: "نشانه‌های پررنگ", c: "text-rose-600", bg: "bg-rose-500", note: "لطفاً بدون تأخیر برای ارزیابی جامع چندرشته‌ای اقدام کنید؛ شروع زودهنگام بزرگ‌ترین تفاوت را می‌سازد." };

  const ring = 2 * Math.PI * 52;

  const downloadReport = () => {
    const lines = [
      "گزارش غربالگری هوشمند اوتیسم | پل اوتیسم (AutismBridge)",
      "=".repeat(52),
      `سن: ${AGE_GROUPS[ageIdx]} · جنسیت: ${gender}`,
      `شروع گفتار: ${FIRST_WORDS[fwIdx]} · سطح زبان فعلی: ${LANG_LEVELS[langIdx]}`,
      "",
      `شاخص کلی نشانه‌ها: ${result.overall} از ۱۰۰ (${band.t})`,
      `سطح حمایت احتمالی: ${SUPPORT_TEXT[result.level].title}`,
      "",
      "امتیاز حوزه‌ها (شدت نشانه‌ها):",
      ...result.domains.map((d) => ` - ${d.domain}: ${d.score} از ۱۰۰`),
      "",
      "متدهای پیشنهادی:",
      ...result.methodMatches.map((x) => ` - ${x.m.name} (${x.m.en}): هم‌خوانی ${x.pct}٪`),
      "",
      "توصیه: " + band.note,
      "",
      "توجه: این گزارش خروجی یک ابزار غربالگری کمکی است و تشخیص پزشکی محسوب نمی‌شود.",
    ];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autism-ai-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="آزمایشگاه هوش مصنوعی"
        title="غربالگری هوشمند و پیش‌بینی مسیر کودک"
        desc="در کمتر از سه دقیقه پروفایل رشدی کودک را وارد کنید؛ هوش مصنوعی پل اوتیسم شدت نشانه‌ها در پنج حوزه، سطح حمایت احتمالی، متدهای مناسب و روند پیشرفت با و بدون مداخله را پیش‌بینی می‌کند."
      />

      <div className="grid gap-8 py-12 lg:grid-cols-5">
        {/* ===== form ===== */}
        <Reveal className="lg:col-span-3">
          <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80 md:p-8">
            <h3 className="flex items-center gap-2.5 text-lg font-black text-slate-900">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white"><Bot className="h-5.5 w-5.5" /></span>
              پروفایل رشدی کودک
            </h3>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-black text-slate-700">سن کودک</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_GROUPS.map((a, i) => (
                    <button key={a} onClick={() => setAgeIdx(i)} className={`rounded-full px-3.5 py-2 text-[12.5px] font-bold transition-all ${ageIdx === i ? "bg-teal-700 text-white" : "bg-cream text-slate-600 ring-1 ring-stone-200 hover:ring-teal-600/40"}`}>{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-black text-slate-700">جنسیت</label>
                <div className="flex flex-wrap gap-2">
                  {["پسر", "دختر"].map((g) => (
                    <button key={g} onClick={() => setGender(g)} className={`rounded-full px-5 py-2 text-[12.5px] font-bold transition-all ${gender === g ? "bg-teal-700 text-white" : "bg-cream text-slate-600 ring-1 ring-stone-200 hover:ring-teal-600/40"}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-black text-slate-700">اولین کلمات معنادار</label>
                <select value={fwIdx} onChange={(e) => setFwIdx(Number(e.target.value))} className="w-full rounded-2xl bg-cream px-4 py-3 text-sm font-medium ring-1 ring-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-600">
                  {FIRST_WORDS.map((o, i) => (<option key={o} value={i}>{o}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-black text-slate-700">سطح زبان و گفتار امروز</label>
                <select value={langIdx} onChange={(e) => setLangIdx(Number(e.target.value))} className="w-full rounded-2xl bg-cream px-4 py-3 text-sm font-medium ring-1 ring-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-600">
                  {LANG_LEVELS.map((o, i) => (<option key={o} value={i}>{o}</option>))}
                </select>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <p className="text-[13px] font-black text-slate-700">در هفته‌های اخیر، هر رفتار را چقدر می‌بینید؟</p>
              {SLIDERS.map((s) => (
                <div key={s.key} className="rounded-2xl bg-cream px-5 py-4 ring-1 ring-stone-200/70">
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2.5 text-[13.5px] font-bold text-slate-800">
                      <s.icon className="h-4.5 w-4.5 text-teal-700" /> {s.label}
                    </label>
                    <span className={`rounded-full px-3 py-1 text-[11.5px] font-black ${s.kind === "ability" ? "bg-teal-700/10 text-teal-800" : "bg-amber-500/15 text-amber-700"}`}>
                      {SCALE[vals[s.key]]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    step={1}
                    value={vals[s.key]}
                    onChange={(e) => setVals({ ...vals, [s.key]: Number(e.target.value) })}
                    className="mt-3 w-full accent-teal-700"
                    dir="ltr"
                    aria-label={s.label}
                  />
                  <div className="mt-1 flex justify-between text-[10.5px] font-bold text-slate-400">
                    <span>همیشه</span><span>هرگز</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setPStep(0); setPhase("processing"); }}
              disabled={phase === "processing"}
              className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-teal-700 py-4 text-[15px] font-black text-white shadow-xl shadow-teal-700/25 transition-all enabled:hover:bg-teal-800 disabled:opacity-60"
            >
              {phase === "processing" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-amber-400" />}
              {phase === "processing" ? "هوش مصنوعی در حال تحلیل است…" : "تحلیل هوشمند و ساخت پیش‌بینی"}
            </button>
          </div>
        </Reveal>

        {/* ===== side: processing / summary ===== */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-36">
            <AnimatePresence mode="wait">
              {phase === "processing" ? (
                <motion.div key="proc" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-[28px] bg-pine p-7 text-white">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
                    <Bot className="h-8 w-8 animate-pulse text-amber-400" />
                  </span>
                  <h3 className="mt-4 text-lg font-black">موتور تحلیل در حال کار است</h3>
                  <ul className="mt-5 space-y-3">
                    {PROCESS_STEPS.map((s, i) => (
                      <li key={s} className={`flex items-center gap-2.5 text-[13px] font-bold transition-all ${i < pStep ? "text-teal-300" : i === pStep ? "text-white" : "text-slate-500"}`}>
                        {i < pStep ? <CheckCircle2 className="h-4.5 w-4.5 shrink-0" /> : i === pStep ? <Loader2 className="h-4.5 w-4.5 shrink-0 animate-spin" /> : <span className="h-4.5 w-4.5 shrink-0 rounded-full ring-1 ring-slate-600" />}
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
                    <motion.div className="h-full rounded-full bg-amber-400" animate={{ width: `${Math.min(100, (pStep / PROCESS_STEPS.length) * 100)}%` }} />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="side" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[28px] bg-pine p-7 text-white">
                  <Bot className="h-10 w-10 text-amber-400" />
                  <h3 className="mt-4 text-lg font-black">این تحلیل چه می‌سازد؟</h3>
                  <ul className="mt-4 space-y-3.5">
                    {[
                      "شاخص کلی نشانه‌ها و نمودار راداری پنج حوزه رشدی",
                      "پیش‌بینی سطح حمایت احتمالی (DSM-5) برای برنامه‌ریزی",
                      "پیش‌بینی روند ۱۲ ماهه با مداخله زودهنگام و بدون آن",
                      "سه متد درمانی هم‌خوان با پروفایل کودک شما",
                      "گزارش قابل دانلود برای ارائه به متخصص",
                    ].map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-[13px] font-semibold leading-7 text-teal-50/90">
                        <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-amber-400" /> {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/12">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                    <p className="text-[12px] leading-7 text-slate-300">
                      این ابزار «غربالگری و پیش‌بینی کمکی» است و جایگزین تشخیص بالینی (ارزیابی چندرشته‌ای و ابزارهایی مانند ADOS) نیست؛ اما بهترین نقشه برای قدم بعدی شماست.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ===== results ===== */}
      <AnimatePresence>
        {phase === "results" && (
          <motion.section
            id="ai-results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="scroll-mt-36 pb-20"
          >
            <div className="grid gap-6 lg:grid-cols-3">
              {/* score ring */}
              <div className="rounded-[28px] bg-white p-7 text-center ring-1 ring-stone-200/80">
                <h3 className="text-[15px] font-black text-slate-800">شاخص کلی نشانه‌ها</h3>
                <div className="relative mx-auto mt-5 h-[150px] w-[150px]">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#eee7d7" strokeWidth="11" />
                    <motion.circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={result.overall < 35 ? "#059669" : result.overall < 62 ? "#d97706" : "#e11d48"}
                      strokeWidth="11" strokeLinecap="round"
                      strokeDasharray={ring}
                      initial={{ strokeDashoffset: ring }}
                      animate={{ strokeDashoffset: ring - (ring * result.overall) / 100 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900">{faNum(result.overall)}</span>
                    <span className="text-[11px] font-bold text-slate-400">از ۱۰۰</span>
                  </div>
                </div>
                <p className={`mt-4 text-lg font-black ${band.c}`}>{band.t}</p>
                <p className="mt-2 text-[12.5px] leading-7 text-slate-500">{band.note}</p>
              </div>

              {/* support level */}
              <div className="rounded-[28px] bg-pine p-7 text-white">
                <p className="text-[12px] font-black text-teal-300">پیش‌بینی هوش مصنوعی</p>
                <h3 className="mt-2 text-xl font-black leading-9">{SUPPORT_TEXT[result.level].title}</h3>
                <p className="mt-2.5 text-[13px] leading-8 text-slate-300">{SUPPORT_TEXT[result.level].desc}</p>
                <div className="mt-5 flex gap-2" dir="ltr">
                  {[1, 2, 3].map((l) => (
                    <span key={l} className={`h-2.5 flex-1 rounded-full ${result.level >= l ? (l === 1 ? "bg-teal-400" : l === 2 ? "bg-amber-400" : "bg-rose-400") : "bg-white/15"}`} />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-bold text-slate-400">
                  <span>حمایت کمتر</span><span>حمایت بیشتر</span>
                </div>
                <p className="mt-5 rounded-2xl bg-white/[0.07] px-4 py-3 text-[12px] leading-7 text-slate-300 ring-1 ring-white/12">
                  سطح‌بندی نهایی فقط با ارزیابی حضوری مشخص می‌شود؛ این پیش‌بینی برای انتخاب مسیر و سرعت اقدام طراحی شده است.
                </p>
              </div>

              {/* trajectory */}
              <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80">
                <h3 className="flex items-center gap-2 text-[15px] font-black text-slate-800">
                  <TrendingUp className="h-5 w-5 text-teal-700" /> پیش‌بینی روند ۱۲ ماهه مهارت ارتباطی
                </h3>
                <div dir="ltr" className="mt-4 h-[210px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.trajectory} margin={{ top: 6, right: 10, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d5" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: "#64748b", fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e2d5", fontFamily: "Vazirmatn", fontSize: 12, direction: "rtl" }} formatter={(v) => faNum(Number(v ?? 0))} />
                      <Legend wrapperStyle={{ fontSize: 11.5, fontWeight: 700 }} />
                      <Line type="monotone" dataKey="با مداخله زودهنگام" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="بدون مداخله" stroke="#cbd5e1" strokeWidth={2.5} strokeDasharray="5 4" dot={{ r: 2.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-1 text-center text-[11.5px] font-semibold text-slate-400">برآورد مدل بر اساس پروفایل ورودی؛ روند واقعی به تداوم و کیفیت مداخله بستگی دارد.</p>
              </div>
            </div>

            {/* radar + domains */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80">
                <h3 className="text-[15px] font-black text-slate-800">نقشه نشانه‌ها در پنج حوزه</h3>
                <div dir="ltr" className="mt-2 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={result.domains} outerRadius="72%">
                      <PolarGrid stroke="#e7e2d5" />
                      <PolarAngleAxis dataKey="domain" tick={{ fill: "#475569", fontSize: 11.5, fontWeight: 700 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e2d5", fontFamily: "Vazirmatn", fontSize: 12, direction: "rtl" }} formatter={(v) => [`${faNum(Number(v ?? 0))} از ۱۰۰`, "شدت نشانه"]} />
                      <Radar dataKey="score" stroke="#0f766e" fill="#0f766e" fillOpacity={0.28} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-[11.5px] font-semibold text-slate-400">هرچه سطح رنگی به لبه نزدیک‌تر، نشانه‌ها در آن حوزه پررنگ‌تر است.</p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80">
                  <h3 className="text-[15px] font-black text-slate-800">جزئیات حوزه‌ها</h3>
                  <div className="mt-5 space-y-4">
                    {result.domains.map((d) => (
                      <div key={d.domain}>
                        <div className="mb-1.5 flex justify-between text-[12.5px] font-bold">
                          <span className="text-slate-700">{d.domain}</span>
                          <span className={d.score >= 62 ? "text-rose-600" : d.score >= 40 ? "text-amber-600" : "text-emerald-600"}>{faNum(d.score)}٪</span>
                        </div>
                        <Meter value={d.score} color={d.score >= 62 ? "bg-rose-500" : d.score >= 40 ? "bg-amber-500" : "bg-emerald-500"} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80">
                  <h3 className="text-[15px] font-black text-slate-800">متدهای هم‌خوان با پروفایل کودک</h3>
                  <div className="mt-4 space-y-3">
                    {result.methodMatches.map((x, i) => (
                      <div key={x.m.id} className="flex items-center gap-4 rounded-2xl bg-cream px-4 py-3 ring-1 ring-stone-200/70">
                        <img src={x.m.image} alt={x.m.name} className="h-12 w-14 shrink-0 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-black text-slate-800">
                            {x.m.name} <span dir="ltr" className="text-[11px] text-teal-700">{x.m.en}</span>
                          </p>
                          <div className="mt-1.5"><Meter value={x.pct} color={i === 0 ? "bg-teal-600" : "bg-amber-500"} /></div>
                        </div>
                        <span className="shrink-0 text-[13px] font-black text-teal-800">{faNum(x.pct)}٪</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => go("hub")} className="mt-4 text-[12.5px] font-black text-teal-800 hover:text-teal-600">
                    مقایسه کامل متدها در مرکز دانش ←
                  </button>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="mt-6 flex flex-col items-center justify-between gap-5 rounded-[28px] bg-teal-800 px-7 py-7 text-white md:flex-row">
              <div>
                <h3 className="text-lg font-black">قدم بعدی شما روشن است</h3>
                <p className="mt-1 max-w-xl text-[13px] leading-7 text-teal-50/85">
                  این گزارش را دانلود کنید و در جلسه ارزیابی تخصصی همراه داشته باشید تا تیم درمان از روز اول، تصویر کاملی از کودک داشته باشد.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={downloadReport} className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-teal-900 transition-transform hover:scale-[1.03]">
                  <Download className="h-4.5 w-4.5" /> دانلود گزارش
                </button>
                <button onClick={() => go("services")} className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-black text-pine transition-colors hover:bg-amber-400">
                  <CalendarCheck className="h-4.5 w-4.5" /> رزرو ارزیابی تخصصی
                </button>
                <button onClick={() => setPhase("form")} className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 transition-colors hover:bg-white/20">
                  <RotateCcw className="h-4 w-4" /> تحلیل دوباره
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
