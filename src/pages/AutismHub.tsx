import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, ArrowLeft, Baby, BookOpen, Brain, CheckCircle2, ClipboardList, Download,
  FileText, Filter, Info, PlayCircle, Puzzle, RotateCcw, Search, ShieldAlert, Sparkles,
} from "lucide-react";
import { IMG, METHODS, RESOURCES, SCREENING, SIGNS_BY_AGE } from "../data/site";
import { Meter, Reveal, SectionHead, faNum, type GoFn } from "../components/ui";

const SUPPORT_LEVELS = [
  {
    level: 1,
    title: "سطح ۱ — نیازمند حمایت",
    color: "bg-teal-600",
    desc: "کودک گفتار جمله‌ای دارد اما شروع و ادامه مکالمه، دوست‌یابی و سازگاری با تغییر برایش دشوار است. با حمایت آموزشی و گفتاردرمانی هدفمند، معمولاً در مدرسه عادی با موفقیت حضور دارد.",
    needs: ["آموزش مهارت‌های اجتماعی", "گفتاردرمانی و مکالمه", "مدیریت اضطراب و انعطاف"],
  },
  {
    level: 2,
    title: "سطح ۲ — نیازمند حمایت قابل توجه",
    color: "bg-amber-500",
    desc: "ارتباط کلامی محدود یا غیرمعمول است و رفتارهای تکراری به‌وضوح در زندگی روزمره دیده می‌شود. به برنامه ساخت‌یافته (ترکیب ABA/TEACCH)، کاردرمانی حسی و آموزش ویژه منظم نیاز دارد.",
    needs: ["برنامه درمانی ساخت‌یافته روزانه", "ارتباط تقویتی (PECS)", "کاردرمانی و یکپارچگی حسی"],
  },
  {
    level: 3,
    title: "سطح ۳ — نیازمند حمایت بسیار قابل توجه",
    color: "bg-rose-600",
    desc: "گفتار بسیار محدود یا غایب است و انعطاف‌پذیری رفتاری پایین، عملکرد روزانه را به‌شدت تحت تأثیر قرار می‌دهد. مداخله فشرده چندرشته‌ای و حمایت مداوم خانواده و مربی سایه ضروری است.",
    needs: ["مداخله فشرده چندرشته‌ای", "درمانگر سایه و حمایت فردی", "برنامه ایمنی و مدیریت بحران"],
  },
];

const CLUBHOUSE = [
  { title: "«اشتباهات رایج در شروع ABA» — با حضور سه BCBA از برلین و تهران", meta: "۲ ساعت · ۴٫۲۰۰ شنونده", tag: "متدها" },
  { title: "«مدرسه در استانبول برای کودک اوتیستیک؛ تجربه ۵ خانواده مهاجر»", meta: "۹۰ دقیقه · ۲٫۸۰۰ شنونده", tag: "والدین" },
  { title: "«از B2 تا قرارداد کاری؛ پرسش و پاسخ زنده با درمانگران آلمان»", meta: "۲٫۵ ساعت · ۵٫۱۰۰ شنونده", tag: "مهاجرت" },
];

export default function AutismHub({ go }: { go: GoFn }) {
  const [ageTab, setAgeTab] = useState(SIGNS_BY_AGE[1].id);
  const [level, setLevel] = useState(1);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(SCREENING.length).fill(null));
  const [method, setMethod] = useState(METHODS[0].id);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("همه");

  const answered = answers.filter((a) => a !== null).length;
  const flags = SCREENING.reduce((sum, q, i) => {
    const a = answers[i];
    if (a === null) return sum;
    return sum + ((a ? "yes" : "no") === q.flagWhen ? 1 : 0);
  }, 0);
  const screeningDone = answered === SCREENING.length;
  const result = !screeningDone
    ? null
    : flags <= 1
      ? { color: "emerald", title: "نشانه پرچم‌دار کمی مشاهده شد", text: "در پاسخ‌های شما کمتر از دو نشانه هشدار دیده می‌شود. رشد کودک را طبق چک‌لیست‌های سنی دنبال کنید و در صورت هر نگرانی تازه، ارزیابی تخصصی بگیرید." }
      : flags <= 3
        ? { color: "amber", title: "چند نشانه نیازمند توجه دیده شد", text: "پاسخ‌های شما ۲ تا ۳ نشانه هشدار را نشان می‌دهد. توصیه می‌شود بدون نگرانی و تأخیر، برای ارزیابی رشدی کامل به روانشناس کودک یا متخصص اطفال رشدی مراجعه کنید؛ مداخله زودهنگام تفاوت بزرگی می‌سازد." }
        : { color: "rose", title: "نشانه‌های هشدار متعدد مشاهده شد", text: "در پاسخ‌ها نشانه‌های هشدار قابل توجهی دیده می‌شود. لطفاً در اولین فرصت برای ارزیابی تشخیصی جامع وقت بگیرید. این نتیجه تشخیص نیست، اما بهترین قدم بعدی، ارزیابی حضوری توسط تیم تخصصی است." };

  const categories = ["همه", ...Array.from(new Set(RESOURCES.map((r) => r.category)))];
  const filtered = RESOURCES.filter(
    (r) => (cat === "همه" || r.category === cat) && (r.title.includes(search) || r.desc.includes(search))
  );

  const activeMethod = METHODS.find((m) => m.id === method) ?? METHODS[0];

  return (
    <div>
      {/* header */}
      <section className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-700/10 px-4 py-2 text-[13px] font-bold text-teal-800">
            <Brain className="h-4 w-4" /> مرکز دانش اوتیسم
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[1.3] text-slate-900 md:text-5xl md:leading-[1.25]">
            اوتیسم را درست بشناسیم؛ <span className="text-teal-700">زود، علمی و بدون ترس</span>
          </h1>
          <p className="mt-4 text-base leading-9 text-slate-600">
            از علائم بر اساس سن و غربالگری تعاملی تا مقایسه متدهای درمانی بر اساس شواهد؛ هرآنچه والدین و درمانگران تازه‌کار برای قدم اول نیاز دارند.
          </p>
        </Reveal>

        {/* what is autism + support levels */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-stone-200/70">
              <h2 className="flex items-center gap-2.5 text-lg font-black text-slate-900">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white"><Puzzle className="h-5 w-5" /></span>
                اختلال طیف اوتیسم (ASD) چیست؟
              </h2>
              <p className="mt-4 text-[14.5px] leading-9 text-slate-600">
                اوتیسم یک تفاوت عصبی-رشدی است که از اوایل کودکی خود را در دو حوزه نشان می‌دهد: تفاوت در ارتباط و تعامل اجتماعی، و الگوهای تکراری رفتار و علایق همراه با ویژگی‌های حسی خاص. «طیف» یعنی هیچ دو فرد دارای اوتیسمی شبیه هم نیستند؛ از کودک بدون گفتار با نیاز حمایتی بالا تا بزرگسال مستقل و شاغل.
              </p>
              <p className="mt-3 text-[14.5px] leading-9 text-slate-600">
                پژوهش‌های امروز یک پیام مشترک دارند: <strong className="text-slate-800">تشخیص و مداخله زودهنگام</strong> — به‌ویژه پیش از ۴ سالگی — مسیر رشد ارتباط، یادگیری و استقلال کودک را به‌طور معناداری تغییر می‌دهد.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { v: "۱ از ۱۰۰", l: "کودک در جهان در طیف اوتیسم" },
                  { v: "زیر ۳ سال", l: "بهترین پنجره تشخیص" },
                  { v: "۴ برابر", l: "شیوع بیشتر در پسران" },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl bg-cream px-2 py-3.5 ring-1 ring-stone-200/70">
                    <p className="text-[15px] font-black text-teal-800">{s.v}</p>
                    <p className="mt-1 text-[11px] leading-4.5 text-slate-500">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* support level interactive */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-3xl bg-pine p-7 text-white">
              <h2 className="flex items-center gap-2.5 text-lg font-black">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><Sparkles className="h-5 w-5 text-amber-400" /></span>
                طیف را لمس کنید: سطوح حمایت DSM-5
              </h2>
              <p className="mt-3 text-[13.5px] leading-8 text-slate-300">اسلایدر را حرکت دهید تا ببینید شدت نیاز حمایتی چطور تصویر بالینی و برنامه درمانی را تغییر می‌دهد:</p>
              <div className="mt-6 flex items-center gap-2" dir="ltr">
                {SUPPORT_LEVELS.map((l) => (
                  <button
                    key={l.level}
                    onClick={() => setLevel(l.level)}
                    className={`h-3 flex-1 rounded-full transition-all duration-300 ${level >= l.level ? l.color : "bg-white/15"}`}
                    aria-label={`سطح ${l.level}`}
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[12px] font-bold text-slate-400">
                <span>حمایت کمتر</span><span>حمایت بیشتر</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 flex-1 rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/12"
                >
                  <h3 className="text-[16px] font-black text-amber-300">{SUPPORT_LEVELS[level - 1].title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-8 text-slate-200">{SUPPORT_LEVELS[level - 1].desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUPPORT_LEVELS[level - 1].needs.map((n) => (
                      <span key={n} className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold text-teal-100 ring-1 ring-white/15">{n}</span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex gap-2">
                {SUPPORT_LEVELS.map((l) => (
                  <button
                    key={l.level}
                    onClick={() => setLevel(l.level)}
                    className={`flex-1 rounded-full py-2.5 text-[13px] font-black transition-all ${level === l.level ? "bg-amber-500 text-pine" : "bg-white/10 text-white hover:bg-white/20"}`}
                  >
                    سطح {faNum(l.level)}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* signs by age */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <SectionHead badge="علائم هشدار" title="نشانه‌های اوتیسم در هر سن چه شکلی‌اند؟" desc="سن کودک را انتخاب کنید و فهرست نشانه‌هایی را ببینید که ارزش پیگیری تخصصی دارند." />
        <Reveal className="mt-10">
          <div className="flex flex-wrap justify-center gap-2.5">
            {SIGNS_BY_AGE.map((g) => (
              <button
                key={g.id}
                onClick={() => setAgeTab(g.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all ${
                  ageTab === g.id ? "bg-teal-700 text-white shadow-lg shadow-teal-700/25" : "bg-white text-slate-600 ring-1 ring-stone-300 hover:ring-teal-600/40"
                }`}
              >
                <Baby className="h-4 w-4" />
                {g.label}
                <span className={`text-[11px] font-semibold ${ageTab === g.id ? "text-teal-100" : "text-slate-400"}`}>{g.range}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <AnimatePresence mode="wait">
          <motion.div
            key={ageTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mx-auto mt-8 grid max-w-5xl gap-3.5 sm:grid-cols-2"
          >
            {(SIGNS_BY_AGE.find((g) => g.id === ageTab)?.signs ?? []).map((s, i) => (
              <div key={s} className="flex items-start gap-3 rounded-2xl bg-white px-5 py-4 ring-1 ring-stone-200/70">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-[13px] font-black text-amber-600">{faNum(i + 1)}</span>
                <p className="text-[13.5px] font-semibold leading-7 text-slate-700">{s}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        <Reveal className="mx-auto mt-6 flex max-w-5xl items-start gap-3 rounded-2xl bg-amber-50 px-5 py-4 ring-1 ring-amber-200">
          <Info className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-[13px] leading-7 text-amber-900">
            دیدن یک نشانه به‌تنهایی به معنای اوتیسم نیست؛ اما هر زمان رشد ارتباطی یا اجتماعی کودک نگران‌تان کرد، «صبر کنیم بزرگ شود» توصیه درستی نیست. ابزار غربالگری زیر قدم بعدی را روشن‌تر می‌کند.
          </p>
        </Reveal>
      </section>

      {/* screening tool */}
      <section className="bg-white py-16 ring-1 ring-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <SectionHead
                center={false}
                badge="ابزار تعاملی"
                title="غربالگری اولیه اوتیسم (۸ سؤال)"
                desc="برگرفته از منطق پرسشنامه‌های غربالگری معتبر مانند M-CHAT؛ درباره رفتار معمول کودک در هفته‌های اخیر پاسخ دهید."
              />
              <div className="mt-6 rounded-3xl bg-cream p-6 ring-1 ring-stone-200/70">
                <div className="flex items-center justify-between text-[13px] font-bold text-slate-600">
                  <span>پیشرفت پاسخ‌گویی</span>
                  <span>{faNum(answered)} از {faNum(SCREENING.length)}</span>
                </div>
                <div className="mt-3"><Meter value={(answered / SCREENING.length) * 100} /></div>

                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`mt-6 rounded-2xl p-5 ring-1 ${
                        result.color === "emerald"
                          ? "bg-emerald-50 ring-emerald-200"
                          : result.color === "amber"
                            ? "bg-amber-50 ring-amber-200"
                            : "bg-rose-50 ring-rose-200"
                      }`}
                    >
                      <h3 className={`flex items-center gap-2 text-[15px] font-black ${
                        result.color === "emerald" ? "text-emerald-800" : result.color === "amber" ? "text-amber-800" : "text-rose-800"
                      }`}>
                        {result.color === "emerald" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                        {result.title}
                      </h3>
                      <p className="mt-2 text-[13px] leading-8 text-slate-700">{result.text}</p>
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        <button onClick={() => go("services")} className="rounded-full bg-teal-700 px-5 py-2.5 text-[12.5px] font-bold text-white hover:bg-teal-800">
                          رزرو ارزیابی تخصصی کودک
                        </button>
                        <button
                          onClick={() => setAnswers(Array(SCREENING.length).fill(null))}
                          className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[12.5px] font-bold text-slate-600 ring-1 ring-stone-300"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> پاسخ دوباره
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p key="hint" className="mt-6 flex items-start gap-2 text-[13px] leading-7 text-slate-500">
                      <ShieldAlert className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                      نتیجه بلافاصله پس از پاسخ به هر ۸ سؤال نمایش داده می‌شود.
                    </motion.p>
                  )}
                </AnimatePresence>

                <p className="mt-5 flex items-start gap-2 border-t border-stone-200 pt-4 text-[11.5px] leading-6 text-slate-400">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  این ابزار صرفاً آموزشی و غربالگری اولیه است و به‌هیچ‌وجه جایگزین تشخیص بالینی (مانند ADOS یا ارزیابی چندرشته‌ای) نیست.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="space-y-3">
                {SCREENING.map((q, i) => (
                  <Reveal key={q.q} delay={i * 0.04}>
                    <div className={`rounded-2xl px-5 py-4 ring-1 transition-all ${answers[i] !== null ? "bg-teal-700/[0.05] ring-teal-600/25" : "bg-cream ring-stone-200/70"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <p className="flex items-start gap-3 text-[14px] font-semibold leading-7 text-slate-800">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-[12px] font-black text-teal-700 ring-1 ring-stone-200">{faNum(i + 1)}</span>
                          {q.q}
                        </p>
                        <div className="flex shrink-0 gap-2">
                          {[
                            { v: true, t: "بله" },
                            { v: false, t: "خیر" },
                          ].map((opt) => (
                            <button
                              key={opt.t}
                              onClick={() => {
                                const next = [...answers];
                                next[i] = opt.v;
                                setAnswers(next);
                              }}
                              className={`rounded-full px-4 py-2 text-[13px] font-black transition-all ${
                                answers[i] === opt.v
                                  ? "bg-teal-700 text-white shadow-md shadow-teal-700/25"
                                  : "bg-white text-slate-500 ring-1 ring-stone-300 hover:ring-teal-600/40"
                              }`}
                            >
                              {opt.t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* methods deep dive */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <SectionHead badge="متدهای درمانی" title="مقایسه عمیق رویکردهای مداخله" desc="روی هر متد کلیک کنید؛ شواهد، بازه سنی، تمرکز جلسات و اینکه برای چه کودکی مناسب‌تر است را ببینید." />
        <Reveal className="mt-10">
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-2 lg:justify-center">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-all ${
                  method === m.id ? "bg-pine text-white shadow-lg" : "bg-white text-slate-600 ring-1 ring-stone-300 hover:ring-teal-600/40"
                }`}
              >
                {m.name} <span dir="ltr" className={`ms-1 text-[11px] ${method === m.id ? "text-teal-300" : "text-slate-400"}`}>{m.en}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMethod.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mt-6 grid overflow-hidden rounded-[28px] bg-white ring-1 ring-stone-200/70 lg:grid-cols-2"
          >
            <div className="relative min-h-[280px]">
              <img src={activeMethod.image} alt={activeMethod.name} className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute bottom-4 right-4 rounded-full bg-black/55 px-4 py-1.5 text-[12.5px] font-bold text-white backdrop-blur">
                بازه سنی هدف: {activeMethod.age}
              </span>
            </div>
            <div className="p-7 md:p-9">
              <h3 className="text-2xl font-black text-slate-900">
                {activeMethod.name}
                <span dir="ltr" className="ms-3 text-base font-bold text-teal-700">{activeMethod.en}</span>
              </h3>
              <p className="mt-4 text-[14.5px] leading-9 text-slate-600">{activeMethod.desc}</p>
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-[12.5px] font-bold">
                  <span className="text-slate-500">قدرت شواهد پژوهشی</span>
                  <span className="text-teal-700">{faNum(activeMethod.evidence)}٪</span>
                </div>
                <Meter value={activeMethod.evidence} />
              </div>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                {activeMethod.focus.map((f) => (
                  <span key={f} className="rounded-xl bg-cream px-3 py-2.5 text-center text-[12px] font-bold leading-5 text-slate-700 ring-1 ring-stone-200/70">{f}</span>
                ))}
              </div>
              <p className="mt-6 flex items-start gap-2 rounded-2xl bg-teal-700/[0.06] px-4 py-3 text-[13px] leading-7 text-teal-900 ring-1 ring-teal-700/15">
                <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-teal-700" />
                <span><strong>مناسب‌تر برای:</strong> {activeMethod.bestFor}</span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* clubhouse strip */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {CLUBHOUSE.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="flex h-full items-start gap-4 rounded-3xl bg-pine p-6 text-white">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-amber-400">
                  <PlayCircle className="h-6 w-6" />
                </span>
                <div>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-black text-amber-300 ring-1 ring-amber-400/30">کلاب‌هاوس · {c.tag}</span>
                  <h3 className="mt-2.5 text-[14.5px] font-bold leading-7">{c.title}</h3>
                  <p className="mt-1.5 text-[12px] font-semibold text-slate-400">{c.meta} · بازپخش در یوتیوب</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* resources library */}
      <section className="bg-white py-16 ring-1 ring-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHead badge="کتابخانه منابع" title="راهنماها، چک‌لیست‌ها و ویدیوهای کاربردی" desc="منابع منتخب تیم علمی پل اوتیسم؛ با جستجو و فیلتر دسته‌بندی سریع‌تر به نیازتان برسید." />
          <Reveal className="mt-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <label className="flex flex-1 items-center gap-2.5 rounded-full bg-cream px-5 py-3.5 ring-1 ring-stone-200 focus-within:ring-teal-600/50">
                <Search className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو در منابع؛ مثلاً «Anerkennung» یا «اتاق حسی»…"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <Filter className="h-4 w-4 shrink-0 text-slate-400" />
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all ${
                      cat === c ? "bg-teal-700 text-white" : "bg-cream text-slate-600 ring-1 ring-stone-200 hover:ring-teal-600/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-3xl bg-cream px-6 py-14 text-center ring-1 ring-stone-200">
              <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-600">منبعی با این جستجو پیدا نشد.</p>
              <p className="mt-1 text-[13px] text-slate-400">عبارت کوتاه‌تری امتحان کنید یا دسته «همه» را انتخاب کنید.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 0.07}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-cream ring-1 ring-stone-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-24px_rgba(12,59,57,0.4)]">
                    <div className="relative h-40 overflow-hidden">
                      <img src={r.image} alt={r.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108" />
                      <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11.5px] font-black text-slate-700 shadow">
                        {r.type === "ویدیو" ? <PlayCircle className="h-3.5 w-3.5 text-red-600" /> : r.type === "چک‌لیست" ? <ClipboardList className="h-3.5 w-3.5 text-teal-700" /> : <FileText className="h-3.5 w-3.5 text-amber-600" />}
                        {r.type}
                      </span>
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">{r.country}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-[11.5px] font-black text-teal-700">{r.category}</span>
                      <h3 className="mt-1.5 text-[15px] font-black leading-7 text-slate-900">{r.title}</h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-7 text-slate-600">{r.desc}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
                        <span className="text-[11.5px] font-semibold text-slate-400">{r.meta}</span>
                        <span className="flex items-center gap-1.5 text-[12.5px] font-black text-teal-800">
                          <Download className="h-4 w-4" /> دریافت منبع
                        </span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-12">
            <div className="flex flex-col items-center justify-between gap-5 rounded-[28px] bg-sand/70 px-8 py-8 ring-1 ring-stone-200 md:flex-row">
              <div className="flex items-center gap-4">
                <img src={IMG.family} alt="مادر و کودک" className="hidden h-16 w-16 rounded-2xl object-cover sm:block" />
                <div>
                  <h3 className="text-lg font-black text-slate-900">نمی‌دانید کدام متد برای کودک شما مناسب است؟</h3>
                  <p className="mt-1 text-[13.5px] text-slate-600">در جلسه ارزیابی، پروفایل کودک بررسی و ترکیب متد مناسب پیشنهاد می‌شود.</p>
                </div>
              </div>
              <button onClick={() => go("services")} className="flex shrink-0 items-center gap-2 rounded-full bg-teal-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/25 hover:bg-teal-800">
                رزرو ارزیابی کودک <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
