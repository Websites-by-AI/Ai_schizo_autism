import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, BookOpenCheck, Bot, Building2, CalendarCheck, CheckCircle2,
  Globe2, GraduationCap, HeartHandshake, Languages, LineChart, MapPin, Mic, Newspaper, PlayCircle,
  Route, Sparkles, Stethoscope, Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COUNTRIES, HOME_FAQS, IMG, METHODS, PAPERS, SALARY_CHART, SALARY_CHART_EN, TESTIMONIALS } from "../data/site";
import { FaqList, Meter, Reveal, SectionHead, faNum, type GoFn } from "../components/ui";
import { FacebookIcon, InstagramIcon, TelegramIcon, YoutubeIcon } from "../components/icons";

const KEYWORDS = ["Anerkennung", "Ausbildung", "ABA", "مدل دنور ESDM", "TÖMER", "آزمون STS", "مجوز بهزیستی", "TEACCH", "یکپارچگی حسی", "PECS", "اتاق حسی", "کارت آبی اروپا", "IEP", "فلورتایم DIR"];

const HERO_STATS = [
  { v: "۳", l: "کشور تحت پوشش تخصصی" },
  { v: "+۴۵۰", l: "متخصص در شبکه هم‌مسیر" },
  { v: "+۱۲٬۰۰۰", l: "خانواده همراه انجمن" },
  { v: "۹۶٪", l: "رضایت از جلسات مشاوره" },
];

export default function Home({ go }: { go: GoFn }) {
  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pt-[132px] lg:pt-[148px]">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-64 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid items-center gap-12 pb-16 lg:grid-cols-2 lg:pb-20">
            {/* text */}
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-teal-800 shadow-sm ring-1 ring-teal-700/15">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  شبکه بین‌المللی متخصصان اوتیسم — ایران · آلمان · ترکیه
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-6 text-4xl font-black leading-[1.3] text-slate-900 md:text-[52px] md:leading-[1.25]">
                  مسیر حرفه‌ای شما در دنیای اوتیسم؛
                  <span className="text-teal-700"> از تهران تا برلین و استانبول</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 max-w-xl text-base leading-9 text-slate-600 md:text-lg md:leading-9">
                  راهنمای گام‌به‌گام و به‌روزِ کار درمانی، معادلسازی مدرک، آوسبیلدونگ و تأسیس مرکز اوتیسم؛ همراه با جدیدترین متدهای مداخله زودهنگام و انجمنی زنده از متخصصان هر سه کشور.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => go("pathfinder")}
                    className="group flex items-center gap-2.5 rounded-full bg-teal-700 px-7 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-teal-700/25 transition-all hover:bg-teal-800"
                  >
                    <Route className="h-5 w-5" />
                    مسیر‌یاب هوشمند را شروع کنید
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </button>
                  <button
                    onClick={() => go("services")}
                    className="flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-slate-800 ring-1 ring-stone-300 transition-all hover:ring-teal-600/50"
                  >
                    <CalendarCheck className="h-5 w-5 text-teal-700" />
                    رزرو مشاوره تخصصی
                  </button>
                </div>
              </Reveal>
              <Reveal delay={0.32}>
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {HERO_STATS.map((s) => (
                    <div key={s.l} className="rounded-2xl bg-white/70 px-3 py-3 ring-1 ring-stone-200/70">
                      <p className="text-xl font-black text-teal-800">{s.v}</p>
                      <p className="mt-1 text-[11.5px] font-medium leading-5 text-slate-500">{s.l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* visual */}
            <Reveal delay={0.15} y={36}>
              <div className="relative mx-auto max-w-[560px]">
                <div className="overflow-hidden rounded-[28px] shadow-2xl shadow-teal-900/25 ring-1 ring-black/5">
                  <img src={IMG.hero} alt="درمانگر و کودک در جلسه آموزش با کارت‌های تصویری" className="h-[420px] w-full object-cover md:h-[500px]" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="absolute -right-3 top-8 animate-float rounded-2xl bg-white/95 p-3.5 shadow-xl ring-1 ring-stone-200/80 backdrop-blur md:-right-8"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700/10 text-teal-700"><BadgeCheck className="h-5 w-5" /></span>
                    <div>
                      <p className="text-[12.5px] font-black text-slate-800">Anerkennung تأیید شد</p>
                      <p className="text-[11px] text-slate-500">کاردرمانی · ایالت برلین</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.6 }}
                  className="absolute -left-3 bottom-24 animate-float-late rounded-2xl bg-white/95 p-3.5 shadow-xl ring-1 ring-stone-200/80 backdrop-blur md:-left-8"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/15 text-amber-600"><Languages className="h-5 w-5" /></span>
                    <div>
                      <p className="text-[12.5px] font-black text-slate-800">زبان آلمانی B2</p>
                      <p className="text-[11px] text-slate-500">گام اول نقشه راه شما</p>
                    </div>
                  </div>
                  <div className="mt-2.5 w-40"><Meter value={78} color="bg-amber-500" /></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.15, duration: 0.5 }}
                  className="absolute -bottom-5 right-8 flex items-center gap-2 rounded-full bg-pine py-2 pe-4 ps-2 text-white shadow-xl"
                >
                  <span className="flex -space-x-2 space-x-reverse">
                    {["bg-teal-500", "bg-amber-500", "bg-rose-500"].map((c, i) => (
                      <span key={i} className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-black ring-2 ring-pine ${c}`}>{["م", "ح", "ل"][i]}</span>
                    ))}
                  </span>
                  <span className="text-[12px] font-bold">+۴۵۰ متخصص هم‌مسیر در انجمن</span>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* marquee */}
        <div className="border-y border-teal-900/10 bg-white/60 py-3.5" dir="ltr">
          <div className="flex w-max animate-marquee gap-10">
            {[...KEYWORDS, ...KEYWORDS].map((k, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap text-[13px] font-bold tracking-wide text-teal-900/60">
                {k}
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500/70" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= AUDIENCE PATHS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <SectionHead
          badge="از کجا شروع کنم؟"
          title="مسیر شما در پل اوتیسم از کدام در وارد می‌شود؟"
          desc="سه گروه اصلی مخاطب داریم؛ برای هرکدام نقشه راه، محتوا و خدمت جداگانه طراحی کرده‌ایم."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Stethoscope,
              color: "bg-teal-700",
              soft: "bg-teal-700/8 ring-teal-700/15",
              title: "درمانگر و متخصص هستم",
              desc: "کاردرمانگر، گفتاردرمانگر، روانشناس یا مربی آموزش ویژه‌ام و می‌خواهم در آلمان یا ترکیه کار کنم یا در ایران پیشرفت کنم.",
              points: ["نقشه راه Anerkennung و STS", "چک‌لیست مدارک قابل دانلود", "فرصت‌های آوسبیلدونگ"],
              cta: "ساخت نقشه راه من",
              action: () => go("pathfinder"),
            },
            {
              icon: HeartHandshake,
              color: "bg-amber-600",
              soft: "bg-amber-600/8 ring-amber-600/20",
              title: "والد یا خانواده هستم",
              desc: "دنبال تشخیص درست، انتخاب متد مناسب و مرکز معتبرم؛ یا قصد مهاجرت با فرزندم را دارم و از سیستم کشور مقصد سؤال دارم.",
              points: ["غربالگری تعاملی بر اساس سن", "راهنمای انتخاب متد و مرکز", "انجمن والدین مهاجر"],
              cta: "ورود به مرکز دانش",
              action: () => go("hub"),
            },
            {
              icon: Building2,
              color: "bg-rose-700",
              soft: "bg-rose-700/8 ring-rose-700/15",
              title: "می‌خواهم مرکز تأسیس کنم",
              desc: "قصد راه‌اندازی مرکز توانبخشی یا مشاوره اوتیسم در ایران یا استانبول را دارم و دنبال مسیر قانونی و مدل کسب‌وکار درست هستم.",
              points: ["مجوز بهزیستی و MEB قدم‌به‌قدم", "استاندارد اتاق حسی و تیم درمان", "مشاوره راه‌اندازی اختصاصی"],
              cta: "مشاهده خدمات راه‌اندازی",
              action: () => go("services"),
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="group flex h-full flex-col rounded-3xl bg-white p-7 shadow-[0_14px_44px_-24px_rgba(29,42,39,0.25)] ring-1 ring-stone-200/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_54px_-24px_rgba(15,118,110,0.35)]">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg ${c.color}`}>
                  <c.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-lg font-black text-slate-900">{c.title}</h3>
                <p className="mt-2.5 text-sm leading-8 text-slate-600">{c.desc}</p>
                <ul className="mt-4 space-y-2">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" /> {p}
                    </li>
                  ))}
                </ul>
                <button onClick={c.action} className="mt-auto flex items-center gap-2 pt-6 text-sm font-black text-teal-800 transition-colors hover:text-teal-600">
                  {c.cta}
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= COUNTRIES ================= */}
      <section className="bg-white py-20 ring-1 ring-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHead
            badge="راهنمای کشورها"
            title="سه کشور، سه مسیر متفاوت؛ کدام برای شما ساخته شده؟"
            desc="هر راهنما شامل نقشه راه گام‌به‌گام، چک‌لیست مدارک تعاملی، جدول حقوق و تقاضا و پاسخ پرسش‌های پرتکرار است."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {COUNTRIES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.1}>
                <article className="group overflow-hidden rounded-3xl bg-cream ring-1 ring-stone-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-24px_rgba(12,59,57,0.4)]">
                  <div className="relative h-52 overflow-hidden">
                    <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-pine/25 transition-colors group-hover:bg-pine/10" />
                    <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[12px] font-black text-slate-800 shadow">
                      {c.code} · {c.en}
                    </span>
                    <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur">
                      <MapPin className="h-3.5 w-3.5" /> {c.cities}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-black text-slate-900">{c.name}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-7 text-slate-600">{c.tagline}</p>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {c.stats.slice(1, 3).map((s) => (
                        <div key={s.label} className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-stone-200/70">
                          <p className={`text-[13px] font-black ${c.accentText}`}>{s.value}</p>
                          <p className="mt-0.5 text-[11px] leading-4.5 text-slate-500">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => go("country", c.id)}
                      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white transition-all ${c.accent} hover:opacity-90`}
                    >
                      مشاهده راهنمای کامل {c.name}
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CHART / COMPARISON ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <SectionHead
              center={false}
              badge="مقایسه داده‌محور"
              title="حقوق متخصصان اوتیسم در سه کشور چقدر متفاوت است؟"
              desc="میانگین حقوق ناخالص ماهانه (معادل یورو) برای نقش‌های کلیدی؛ داده‌ها از آگهی‌های استخدامی و گزارش‌های بازار کار ۲۰۲۴–۲۰۲۵ گردآوری و هر فصل به‌روز می‌شوند."
            />
            <div className="mt-7 space-y-3.5">
              {[
                { c: "bg-teal-600", t: "آلمان بالاترین حقوق و امنیت شغلی را دارد؛ اما ورود به آن زبان و زمان می‌خواهد." },
                { c: "bg-rose-600", t: "ترکیه تعادل سرعت شروع، هزینه زندگی و درآمد بخش خصوصی است." },
                { c: "bg-emerald-600", t: "در ایران درآمد دلاری پایین‌تر است، اما هزینه ورود و رقابت کمتر و امکان تأسیس مرکز واقعی‌تر است." },
              ].map((x) => (
                <p key={x.t} className="flex items-start gap-2.5 text-sm leading-7 text-slate-600">
                  <span className={`mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full ${x.c}`} />
                  {x.t}
                </p>
              ))}
            </div>
            <button onClick={() => go("pathfinder")} className="mt-7 flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-pine-light">
              <LineChart className="h-4 w-4" />
              تحلیل شخصی بر اساس شرایط من
            </button>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-3">
            <div className="rounded-3xl bg-white p-5 shadow-[0_18px_50px_-28px_rgba(29,42,39,0.35)] ring-1 ring-stone-200/70 md:p-7">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[15px] font-black text-slate-800">میانگین حقوق ماهانه (یورو) بر اساس نقش</h3>
                <span className="rounded-full bg-sand px-3 py-1 text-[11.5px] font-bold text-slate-600">منبع: برآورد بازار ۲۰۲۵</span>
              </div>
              <div dir="ltr" className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SALARY_CHART_EN} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barCategoryGap="26%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d5" vertical={false} />
                    <XAxis dataKey="role" tick={{ fontSize: 11.5, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} interval={0} angle={-14} textAnchor="end" height={52} />
                    <YAxis tick={{ fontSize: 11.5, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v, name) => [`€${faNum(Number(v ?? 0).toLocaleString("en-US"))}`, String(name)]}
                      contentStyle={{ borderRadius: 14, border: "1px solid #e7e2d5", fontFamily: "Vazirmatn", fontSize: 12.5, direction: "rtl" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12.5, fontWeight: 700 }} formatter={(v: string) => ({ Germany: "آلمان", Turkey: "ترکیه", Iran: "ایران" })[v] ?? v} />
                    <Bar dataKey="germany" name="Germany" fill="#0f766e" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="turkey" name="Turkey" fill="#e11d63" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="iran" name="Iran" fill="#d97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-center text-[12px] text-slate-400">ارقام ایران معادل تقريبي یورویی درآمد متخصصان باتجربه در مراکز خصوصی کلان‌شهرهاست.</p>
            </div>
          </Reveal>
        </div>

        {/* mini table hidden on small? include roles fa labels */}
        <Reveal delay={0.1}>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SALARY_CHART.map((r) => (
              <div key={r.role} className="rounded-2xl bg-white px-5 py-4 ring-1 ring-stone-200/70">
                <p className="text-sm font-black text-slate-800">{r.role}</p>
                <div className="mt-3 space-y-1.5 text-[12.5px] font-semibold">
                  <p className="flex justify-between"><span className="text-teal-700">آلمان</span><span>{faNum(r.germany.toLocaleString("en-US"))} €</span></p>
                  <p className="flex justify-between"><span className="text-rose-700">ترکیه</span><span>{faNum(r.turkey.toLocaleString("en-US"))} €</span></p>
                  <p className="flex justify-between"><span className="text-amber-600">ایران</span><span>{faNum(r.iran.toLocaleString("en-US"))} €</span></p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ================= METHODS PREVIEW ================= */}
      <section className="bg-pine py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHead
            dark
            badge="مرکز دانش اوتیسم"
            title="متدهای مداخله زودهنگام؛ قلب تپنده هر سه کشور"
            desc="از ABA و مدل دنور تا TEACCH و یکپارچگی حسی؛ در مرکز دانش، هر متد با شواهد پژوهشی، بازه سنی و کاربرد واقعی در کلینیک بررسی شده است."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {METHODS.map((m, i) => (
              <Reveal key={m.id} delay={(i % 3) * 0.09}>
                <button
                  onClick={() => go("hub")}
                  className="group block h-full w-full overflow-hidden rounded-3xl bg-white/[0.06] text-start ring-1 ring-white/12 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.1]"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={m.image} alt={m.name} className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-[11.5px] font-bold text-white backdrop-blur">{m.en} · {m.age}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[16px] font-black text-white">{m.name}</h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-7 text-slate-300">{m.desc}</p>
                    <div className="mt-4">
                      <div className="mb-1.5 flex justify-between text-[11.5px] font-bold">
                        <span className="text-slate-400">قدرت شواهد پژوهشی</span>
                        <span className="text-amber-300">{faNum(m.evidence)}٪</span>
                      </div>
                      <Meter value={m.evidence} color="bg-amber-400" />
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <button onClick={() => go("hub")} className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-sm font-black text-pine shadow-xl shadow-amber-500/20 transition-colors hover:bg-amber-400">
              <BookOpenCheck className="h-5 w-5" />
              ورود به مرکز دانش و غربالگری تعاملی
            </button>
          </Reveal>
        </div>
      </section>

      {/* ================= AI & NEW TOOLS ================= */}
      <section className="bg-white py-20 ring-1 ring-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHead
            badge="نسل تازه ابزارها"
            title="هوش مصنوعی، پژوهش روز و نقشه خانواده‌ها"
            desc="سه ابزار تازه پل اوتیسم: پیش‌بینی هوشمند مسیر کودک، خلاصه ساده جدیدترین مقالات جهان و یافتن خانواده‌ها و مراکز نزدیک روی نقشه."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Bot, color: "bg-teal-700", page: "ailab", cta: "شروع تحلیل هوشمند",
                title: "آزمایشگاه هوش مصنوعی",
                desc: "پروفایل رشدی کودک را وارد کنید؛ هوش مصنوعی شدت نشانه‌ها در پنج حوزه، سطح حمایت احتمالی و روند پیشرفت ۱۲ ماهه با و بدون مداخله را پیش‌بینی می‌کند و گزارش قابل دانلود می‌سازد.",
              },
              {
                icon: MapPin, color: "bg-rose-600", page: "familymap", cta: "باز کردن نقشه",
                title: "نقشه خانواده‌ها و مراکز",
                desc: "مثل نقشه‌های اجتماعی؛ مراکز توانبخشی، مدرسه‌های فراگیر و گروه‌های حمایت والدین در ایران، آلمان و ترکیه را روی نقشه پیدا کنید و به خانواده‌های هم‌تجربه وصل شوید.",
              },
              {
                icon: Newspaper, color: "bg-amber-600", page: "news", cta: "خواندن تازه‌ها",
                title: "تازه‌های پژوهش و اخبار",
                desc: "جدیدترین مقاله‌های آکادمیک و خبرهای قوانین سه کشور، با دو خلاصه: نسخه تخصصی برای درمانگران و نسخه ساده و کاربردی برای خانواده‌ها.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.09}>
                <button
                  onClick={() => go(c.page)}
                  className="group block h-full w-full rounded-3xl bg-cream p-7 text-start ring-1 ring-stone-200/75 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_48px_-24px_rgba(12,59,57,0.4)]"
                >
                  <span className={`grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg ${c.color}`}>
                    <c.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-lg font-black text-slate-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-8 text-slate-600">{c.desc}</p>
                  <span className="mt-5 flex items-center gap-2 text-sm font-black text-teal-800">
                    {c.cta} <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {PAPERS.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => go("news")}
                  className="group flex items-start gap-3 rounded-2xl bg-cream px-5 py-4 text-start ring-1 ring-stone-200/70 transition-all hover:ring-teal-600/40"
                >
                  <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-black ring-1 ${p.kind === "پژوهش" ? "bg-teal-700/10 text-teal-800 ring-teal-700/20" : "bg-amber-500/15 text-amber-700 ring-amber-500/30"}`}>
                    {p.kind}
                  </span>
                  <span>
                    <span className="block text-[13px] font-bold leading-6.5 text-slate-800 transition-colors group-hover:text-teal-800">{p.title}</span>
                    <span className="mt-1 block text-[11px] font-semibold text-slate-400">{p.source} · {p.date}</span>
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= COMMUNITY PREVIEW ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <SectionHead
          badge="انجمن و شبکه‌های اجتماعی"
          title="یادگیری ما در چهار کانال زنده ادامه دارد"
          desc="ویدیوهای عمیق یوتیوب، نکته‌های روزانه اینستاگرام، اخبار فوری تلگرام و گفت‌وگوهای والدین در فیسبوک و کلاب‌هاوس؛ همه به سایت وصل‌اند."
        />

        {/* clubhouse room banner */}
        <Reveal className="mt-10">
          <div className="relative flex flex-col items-start gap-5 overflow-hidden rounded-[28px] bg-pine px-7 py-7 text-white md:flex-row md:items-center md:px-9">
            <div className="pointer-events-none absolute -left-14 -top-14 h-48 w-48 rounded-full bg-red-500/20 blur-3xl" />
            <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-900/40">
              <Mic className="h-7 w-7" />
              <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-80" />
                <span className="h-3.5 w-3.5 rounded-full border-2 border-pine bg-amber-400" />
              </span>
            </span>
            <div className="relative flex-1">
              <p className="text-[12px] font-black text-red-300">اتاق هفتگی کلاب‌هاوس · پنجشنبه‌ها ۲۱:۰۰ تهران</p>
              <h3 className="mt-1 text-lg font-black leading-8 md:text-xl">این هفته: «اتاق حسی در خانه؛ نسخه کم‌هزینه برای والدین»</h3>
              <p className="mt-1 text-[13px] leading-7 text-teal-50/85">لینک ورود به اتاق، شمارش معکوس جلسه و متن آماده دعوت در صفحه اختصاصی اتاق؛ سخنران‌ها و همکاران هم از مسیر همکاری هوشمند وارد می‌شوند.</p>
            </div>
            <div className="relative flex shrink-0 flex-wrap gap-3">
              <button onClick={() => go("room")} className="rounded-full bg-white px-6 py-3 text-sm font-black text-pine transition-transform hover:scale-[1.03]">
                صفحه اتاق و لینک ورود
              </button>
              <button onClick={() => go("collaborate")} className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/35 transition-colors hover:bg-white/20">
                مسیر همکاری
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: YoutubeIcon, name: "یوتیوب", handle: "AutismBridgeTV@", stat: "۴۸٬۰۰۰+ دنبال‌کننده", desc: "راهنمای قدم‌به‌قدم مهاجرت و جلسات ضبط‌شده کلاب‌هاوس", color: "bg-red-600", soft: "hover:ring-red-600/40" },
            { icon: InstagramIcon, name: "اینستاگرام", handle: "autismbridge.ir@", stat: "۱۱۲٬۰۰۰+ دنبال‌کننده", desc: "کروسل‌های علائم، ریلز «یک روز در برلین/استانبول» و لایو هفتگی", color: "bg-pink-600", soft: "hover:ring-pink-600/40" },
            { icon: TelegramIcon, name: "تلگرام", handle: "AutismBridge@", stat: "۲۳٬۰۰۰+ عضو", desc: "فرصت‌های شغلی، تغییرات قوانین و فایل‌های راهنما", color: "bg-sky-600", soft: "hover:ring-sky-600/40" },
            { icon: FacebookIcon, name: "فیسبوک", handle: "Autism Bridge Global", stat: "۳۱٬۰۰۰+ عضو گروه", desc: "شبکه حمایتی والدین مهاجر و بحث‌های طولانی تخصصی", color: "bg-blue-700", soft: "hover:ring-blue-700/40" },
          ].map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <button onClick={() => go("community")} className={`block h-full w-full rounded-3xl bg-white p-6 text-start ring-1 ring-stone-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${s.soft}`}>
                <span className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-black text-slate-900">{s.name}</h3>
                <p dir="ltr" className="mt-0.5 text-end text-[12px] font-semibold text-slate-400">{s.handle}</p>
                <p className="mt-2 text-[13px] leading-7 text-slate-600">{s.desc}</p>
                <p className="mt-4 flex items-center gap-1.5 text-[13px] font-black text-teal-800">
                  <Users className="h-4 w-4" /> {s.stat}
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-white py-20 ring-1 ring-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHead badge="تجربه هم‌مسیرها" title="آن‌ها این مسیر را قبل از شما رفته‌اند" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <figure className="flex h-full flex-col rounded-3xl bg-cream p-7 ring-1 ring-stone-200/70">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} viewBox="0 0 24 24" className="h-4 w-4 fill-amber-500"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.2l7.1-.6L12 2z" /></svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[14.5px] leading-8.5 text-slate-700">«{t.text}»</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-stone-200 pt-5">
                    <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white" />
                    <div>
                      <p className="text-sm font-black text-slate-900">{t.name}</p>
                      <p className="text-[12px] font-semibold text-teal-700">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ + CTA ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <SectionHead center={false} badge="پرسش‌های پرتکرار" title="قبل از شروع، این‌ها را بدانید" desc="پاسخ کوتاه به سؤال‌هایی که هر هفته در مشاوره‌ها و دایرکت اینستاگرام از ما پرسیده می‌شود." />
            <div className="mt-7 rounded-3xl bg-pine p-7 text-white">
              <GraduationCap className="h-9 w-9 text-amber-400" />
              <h3 className="mt-4 text-lg font-black">هنوز مطمئن نیستید کدام کشور؟</h3>
              <p className="mt-2 text-sm leading-8 text-slate-300">مسیر‌یاب هوشمند در چهار سؤال، بر اساس رشته، زبان و هدف شما، نقشه راه و برآورد زمان می‌سازد.</p>
              <button onClick={() => go("pathfinder")} className="mt-5 flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-black text-pine transition-colors hover:bg-amber-400">
                <Route className="h-4 w-4" /> شروع مسیر‌یاب (۳ دقیقه)
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-3">
            <FaqList faqs={HOME_FAQS} />
          </Reveal>
        </div>

        {/* final CTA */}
        <Reveal>
          <div className="relative mt-16 overflow-hidden rounded-[32px] bg-teal-800 px-7 py-12 md:px-12">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-1/4 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h3 className="flex items-center gap-3 text-2xl font-black leading-snug text-white md:text-3xl">
                  <PlayCircle className="h-9 w-9 shrink-0 text-amber-400" />
                  اولین قدم را همین امروز بردارید
                </h3>
                <p className="mt-3 text-[15px] leading-8 text-teal-50/85">
                  در یک جلسه مشاوره ۶۰ دقیقه‌ای، پرونده‌تان بررسی و نقشه راه مکتوب با زمان‌بندی، هزینه‌ها و چک‌لیست مدارک تحویل می‌گیرید؛ بدون حدس و گمان.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => go("services")} className="rounded-full bg-white px-7 py-3.5 text-sm font-black text-teal-900 shadow-xl transition-transform hover:scale-[1.03]">
                  رزرو جلسه مشاوره
                </button>
                <button onClick={() => go("community")} className="rounded-full bg-white/10 px-7 py-3.5 text-sm font-bold text-white ring-1 ring-white/40 backdrop-blur transition-colors hover:bg-white/20">
                  عضویت رایگان در انجمن
                </button>
              </div>
            </div>
            <p className="relative mt-6 flex items-center gap-2 text-[12.5px] font-semibold text-teal-100/80">
              <Globe2 className="h-4 w-4" />
              مشاوره به فارسی، انگلیسی، آلمانی و ترکی استانبولی برگزار می‌شود.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
