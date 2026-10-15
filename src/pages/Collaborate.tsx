import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Award, Bot, Briefcase, Building2, CalendarCheck, CheckCircle2, ClipboardList,
  Clock3, FileCheck2, Globe2, GraduationCap, HandHeart, HeartHandshake, MapPin, Mic,
  Radio, Send, Sparkles, Stethoscope, TrendingUp, Users, Video,
} from "lucide-react";
import { Reveal, SectionHead, faNum, type GoFn } from "../components/ui";

/* ---------------- types data ---------------- */

interface CollabType {
  id: string;
  name: string;
  icon: typeof Mic;
  color: string;
  tagline: string;
  totalTime: string;
  steps: { t: string; d: string; dur: string }[];
  requirements: string[];
}

const TYPES: CollabType[] = [
  {
    id: "speaker",
    name: "سخنران و مهمان متخصص اتاق",
    icon: Mic,
    color: "bg-red-500",
    tagline: "ارائه تخصصی در اتاق کلاب‌هاوس و وبینار یوتیوب، با صفحه اختصاصی سخنران در سایت",
    totalTime: "۲ تا ۳ هفته تا اولین اجرا",
    steps: [
      { t: "ثبت درخواست و ارسال رزومه", d: "رزومه تخصصی و موضوع پیشنهادی ارائه‌تان را از فرم پایین همین صفحه بفرستید.", dur: "۲ روز" },
      { t: "جلسه آشنایی و انتخاب موضوع", d: "گفت‌وگوی ۳۰ دقیقه‌ای با تیم علمی؛ موضوع، مخاطب و سرفصل‌ها نهایی می‌شود.", dur: "هفته اول" },
      { t: "هماهنگی فنی و معرفی شما", d: "تست صدا و اینترنت، طراحی پوستر و معرفی سخنران در اینستاگرام و تلگرام.", dur: "هفته دوم" },
      { t: "اجرای زنده و انتشار بازپخش", d: "حضور در اتاق پنجشنبه، انتشار بازپخش در یوتیوب و ساخت صفحه اختصاصی شما در سایت.", dur: "روز رویداد" },
    ],
    requirements: ["رزومه تخصصی به‌روز", "حداقل ۳ سال تجربه مرتبط یا مدرک معتبر یک متد درمانی", "نمونه ارائه یا ویدیوی کوتاه (اختیاری، اما امتیاز مهم)", "تعهد به حضور در بخش پرسش و پاسخ"],
  },
  {
    id: "cohost",
    name: "هم‌میزبان اتاق هفتگی",
    icon: Radio,
    color: "bg-teal-700",
    tagline: "حضور ثابت در تیم اجرای اتاق؛ مدیریت نوبت‌ها، کیس‌استادی و جمع‌بندی",
    totalTime: "۳ تا ۴ هفته تا میزبانی ثابت",
    steps: [
      { t: "ثبت درخواست و سوابق اجرا", d: "تجربه تدریس، اجرا یا مدیریت جلساتتان را معرفی کنید.", dur: "۲ روز" },
      { t: "حضور مهمان در ۲ جلسه اتاق", d: "از نزدیک با فضا، مخاطب و قوانین اتاق آشنا می‌شوید و در Q&A مشارکت می‌کنید.", dur: "۲ هفته" },
      { t: "جلسه هماهنگی نقش‌ها", d: "تقسیم نقش با میزبان اصلی: مدیریت دست‌ها، زمان‌بندی و جمع‌بندی بخش‌ها.", dur: "هفته سوم" },
      { t: "میزبانی آزمایشی و تثبیت", d: "اجرای یک جلسه با همراهی میزبان؛ بعد از بازخورد، وارد تقویم ثابت می‌شوید.", dur: "هفته چهارم" },
    ],
    requirements: ["امکان حضور منظم پنجشنبه‌ها ۲۱:۰۰ تا ۲۲:۳۰ تهران", "تجربه اجرای جلسه، تدریس یا سخنرانی", "تسلط به موضوعات روز حوزه اوتیسم", "پذیرش قوانین و پروتکل اجرای اتاق"],
  },
  {
    id: "clinical",
    name: "همکار بالینی شبکه ارجاع",
    icon: Stethoscope,
    color: "bg-emerald-700",
    tagline: "دریافت ارجاع ارزیابی و درمان از پل اوتیسم در شهر و کشور خودتان",
    totalTime: "۲ تا ۴ هفته تا اولین ارجاع",
    steps: [
      { t: "ثبت درخواست و مدارک تخصصی", d: "مدرک، پروانه اشتغال و حوزه‌های تخصصی‌تان را ارسال می‌کنید.", dur: "۳ روز" },
      { t: "بررسی صلاحیت و مصاحبه بالینی", d: "جلسه آنلاین با تیم علمی درباره متدها، پروتکل ارزیابی و سبک گزارش‌نویسی شما.", dur: "هفته اول و دوم" },
      { t: "دوره آشنایی با پروتکل‌های پل", d: "قالب IEP، گزارش پیشرفت داده‌محور و استاندارد ارتباط با خانواده‌ها.", dur: "۱ هفته" },
      { t: "شروع ارجاع و سوپرویژن ماهانه", d: "ورود به فهرست همکاران سایت و دریافت ارجاع بر اساس شهر و تخصص.", dur: "از هفته سوم" },
    ],
    requirements: ["مدرک مرتبط و پروانه معتبر کشور محل فعالیت", "سابقه بالینی مستند در حوزه کودک/اوتیسم", "پذیرش پروتکل گزارش‌نویسی و IEP پل اوتیسم", "شرکت در سوپرویژن ماهانه آنلاین"],
  },
  {
    id: "center",
    name: "مرکز همکار (ایران، آلمان، ترکیه)",
    icon: Building2,
    color: "bg-rose-700",
    tagline: "ارجاع دوطرفه مراجع، آموزش تیم و صفحه اختصاصی مرکز در نقشه خدمات سایت",
    totalTime: "۳ تا ۵ هفته تا شروع ارجاع",
    steps: [
      { t: "معرفی مرکز و مجوزها", d: "مشخصات مرکز، تیم درمان و مجوزهای فعال را از فرم درخواست ارسال کنید.", dur: "۳ روز" },
      { t: "ارزیابی آنلاین استانداردها", d: "بازدید ویدیویی فضا، اتاق حسی و پروتکل ارزیابی؛ چک‌لیست استاندارد پل بررسی می‌شود.", dur: "هفته دوم" },
      { t: "توافق‌نامه همکاری و آموزش تیم", d: "چارچوب ارجاع دوطرفه، تعرفه‌ها و یک جلسه آموزشی برای تیم شما.", dur: "هفته سوم" },
      { t: "صفحه اختصاصی و شروع ارجاع", d: "مرکز شما در سایت معرفی می‌شود و ارجاع خانواده‌های همان شهر آغاز می‌شود.", dur: "از هفته چهارم" },
    ],
    requirements: ["مجوز رسمی فعال (بهزیستی، MEB، یا معادل کشور محل)", "مسئول فنی واجد شرایط و تیم پایه درمان", "فضای درمانی استاندارد و ایمن برای کودک", "تعهد به گزارش پیشرفت مراجعان ارجاعی"],
  },
  {
    id: "content",
    name: "شریک محتوایی و رسانه‌ای",
    icon: Video,
    color: "bg-amber-600",
    tagline: "تولید و ترجمه محتوای علمی برای یوتیوب، اینستاگرام و مرکز دانش سایت",
    totalTime: "۲ تا ۳ هفته تا همکاری مستمر",
    steps: [
      { t: "ارسال نمونه‌کار", d: "دو نمونه از بهترین کارهایتان (متن، ویدیو یا ترجمه تخصصی) را بفرستید.", dur: "۲ روز" },
      { t: "جلسه ایده و تقویم محتوایی", d: "هم‌راستایی با لحن علمی-ساده پل اوتیسم و انتخاب ستون محتوایی شما.", dur: "هفته اول" },
      { t: "تولید آزمایشی", d: "ساخت ۲ محتوای آزمایشی با بازخورد تیم علمی و ویراستاری نهایی.", dur: "هفته دوم" },
      { t: "همکاری مستمر و اعتباردهی", d: "قرارداد دوره‌ای، نام شما به‌عنوان پدیدآورنده در همه خروجی‌ها.", dur: "از هفته سوم" },
    ],
    requirements: ["نمونه‌کار منتشرشده قابل ارائه", "تسلط به فارسی تخصصی حوزه روان و توانبخشی", "آشنایی با اخلاق محتوای سلامت و حریم کودک", "تحویل منظم طبق تقویم محتوایی"],
  },
  {
    id: "sponsor",
    name: "حامی و اسپانسر اجتماعی",
    icon: HandHeart,
    color: "bg-sky-700",
    tagline: "حمایت از بورسیه درمان خانواده‌های کم‌برخوردار و رویدادهای آموزشی رایگان",
    totalTime: "۱ تا ۲ هفته تا شروع حمایت",
    steps: [
      { t: "جلسه معرفی فرصت‌های حمایت", d: "بورسیه خانواده‌ها، حمایت از اتاق هفتگی یا تولید راهنماهای رایگان را معرفی می‌کنیم.", dur: "۳ روز" },
      { t: "انتخاب بسته و چارچوب شفافیت", d: "مبلغ/خدمت، دوره حمایت و شیوه گزارش‌دهی اثر به‌صورت مکتوب مشخص می‌شود.", dur: "هفته اول" },
      { t: "قرارداد و شروع", d: "حضور برند شما در صفحه حامیان و رویدادهای منتخب، بدون دخالت در محتوای علمی.", dur: "هفته دوم" },
      { t: "گزارش اثر دوره‌ای", d: "هر فصل: چند خانواده بورسیه شدند و خروجی حمایت شما چه بوده است.", dur: "فصلی" },
    ],
    requirements: ["معرفی رسمی برند یا مجموعه", "تعیین حوزه حمایت (مالی، خدماتی یا رسانه‌ای)", "پذیرش چارچوب شفافیت و گزارش‌دهی عمومی", "احترام به استقلال علمی محتوای پل اوتیسم"],
  },
];

/* ---------------- wizard data ---------------- */

const ROLES = [
  { id: "therapist", label: "درمانگر / روانشناس", desc: "کاردرمانی، گفتار، روانشناسی، ABA", icon: Stethoscope },
  { id: "center", label: "مدیر یا مؤسس مرکز", desc: "مرکز توانبخشی، کلینیک یا مدرسه", icon: Building2 },
  { id: "creator", label: "تولیدکننده محتوا / رسانه", desc: "نویسنده، مترجم، ویدیوساز، ادمین", icon: Video },
  { id: "parent", label: "والد باتجربه", desc: "تجربه زیسته برای انتقال به خانواده‌ها", icon: HeartHandshake },
  { id: "business", label: "برند / حامی مالی", desc: "حمایت مالی یا خدماتی از مأموریت ما", icon: Briefcase },
  { id: "researcher", label: "پژوهشگر / دانشجو", desc: "پژوهش، داده و محتوای علمی", icon: GraduationCap },
];

const COUNTRIES = [
  { id: "iran", label: "ایران" },
  { id: "germany", label: "آلمان" },
  { id: "turkey", label: "ترکیه" },
  { id: "online", label: "آنلاین / سایر کشورها" },
];

const SKILLS = [
  "ABA و تحلیل رفتار", "مدل دنور و مداخله زودهنگام", "کاردرمانی و یکپارچگی حسی",
  "گفتار و ارتباط (PECS)", "آموزش والدین", "مهاجرت، Anerkennung و مجوزها",
  "مدیریت و توسعه مرکز", "تولید محتوا و رسانه", "پژوهش و داده",
];

function recommend(role: string, country: string, skills: string[]) {
  const s: Record<string, number> = { speaker: 40, cohost: 25, clinical: 35, center: 20, content: 30, sponsor: 10 };
  const reasons: string[] = [];

  if (role === "therapist") { s.clinical += 38; s.speaker += 25; s.cohost += 15; reasons.push("با تخصص درمانی شما، ارجاع بالینی و سخنرانی تخصصی هر دو باز است"); }
  if (role === "center") { s.center += 55; s.speaker += 10; reasons.push("مرکز شما می‌تواند گره ارجاع خانواده‌ها در شهر خودتان باشد"); }
  if (role === "creator") { s.content += 50; s.cohost += 10; reasons.push("شبکه رسانه‌ای ما ماهانه به محتوای تازه تخصصی نیاز دارد"); }
  if (role === "parent") { s.speaker += 35; reasons.push("تجربه زیسته والدین، محبوب‌ترین بخش اتاق هفتگی است"); }
  if (role === "business") { s.sponsor += 60; s.content += 8; reasons.push("حمایت شما مستقیم به بورسیه درمان خانواده‌ها می‌رسد"); }
  if (role === "researcher") { s.content += 30; s.speaker += 20; reasons.push("ستون «پژوهش و داده» مرکز دانش، جای محتوای علمی شماست"); }

  if (skills.includes("مهاجرت، Anerkennung و مجوزها")) { s.speaker += 18; reasons.push("تخصص شما در مهاجرت و مجوزها، پرتکرارترین سؤال انجمن است"); }
  if (skills.includes("تولید محتوا و رسانه")) { s.content += 20; s.cohost += 10; }
  if (skills.includes("مدیریت و توسعه مرکز")) { s.center += 20; }
  if (skills.includes("آموزش والدین")) { s.speaker += 12; reasons.push("آموزش والدین، ستون اصلی برنامه‌های اتاق و دوره‌هاست"); }
  if (country === "germany" || country === "turkey") { s.clinical += 10; reasons.push("حضور شما در خارج از ایران، شبکه ارجاع بین‌المللی ما را کامل می‌کند"); }
  if (country === "online") { s.content += 8; s.cohost += 8; }

  const bestId = Object.entries(s).sort((a, b) => b[1] - a[1])[0][0];
  const score = Math.max(72, Math.min(97, s[bestId] + 10));
  return { bestId, score, reasons: reasons.slice(0, 3) };
}

/* ---------------- page ---------------- */

export default function Collaborate({ go }: { go: GoFn }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [typeId, setTypeId] = useState("speaker");
  const [reqChecked, setReqChecked] = useState<Set<number>>(new Set());

  const [form, setForm] = useState({ name: "", contact: "", link: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doneCode, setDoneCode] = useState<string | null>(null);

  const rec = useMemo(() => recommend(role, country, skills), [role, country, skills]);
  const activeType = TYPES.find((t) => t.id === typeId) ?? TYPES[0];
  const isRecommended = showResult && typeId === rec.bestId;

  const toggleSkill = (s: string) =>
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : prev.length >= 3 ? prev : [...prev, s]));

  const finishWizard = () => {
    setTypeId(rec.bestId);
    setReqChecked(new Set());
    setShowResult(true);
    requestAnimationFrame(() =>
      document.getElementById("collab-result")?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const pickType = (id: string) => {
    setTypeId(id);
    setReqChecked(new Set());
    setShowResult(true);
    document.getElementById("collab-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = "نام کامل را وارد کنید";
    if (form.contact.trim().length < 5) errs.contact = "ایمیل یا شماره تماس معتبر وارد کنید";
    if (form.message.trim().length < 10) errs.message = "کمی درباره تخصص و ایده همکاری‌تان بنویسید";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const code = "AB-C-" + Math.floor(10000 + Math.random() * 90000);
    setDoneCode(code);
    try {
      const prev = JSON.parse(localStorage.getItem("ab-collab-requests") ?? "[]");
      localStorage.setItem("ab-collab-requests", JSON.stringify([...prev, { ...form, typeId, code }]));
    } catch { /* ignore */ }
  };

  const inputCls = (err?: string) =>
    `w-full rounded-2xl bg-cream px-4 py-3 text-sm font-medium text-slate-800 ring-1 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
      err ? "ring-rose-400 focus:ring-rose-400" : "ring-stone-200 focus:ring-teal-600"
    }`;

  const stepTitles = ["نقش شما چیست؟", "کجا مستقر هستید؟", "حوزه‌های تخصص یا علاقه شما؟"];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="مسیر همکاری · با کمک هوش مصنوعی"
        title="جای شما در پل اوتیسم کجاست؟"
        desc="در سه قدم، مسیر‌ساز هوشمند بر اساس نقش، کشور و تخصصتان بهترین نوع همکاری را پیشنهاد می‌دهد و نقشه راه قدم‌به‌قدم پیوستن را می‌سازد."
      />

      {/* ===== AI wizard ===== */}
      <Reveal className="mx-auto mt-12 max-w-3xl">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-30px_rgba(12,59,57,0.4)] ring-1 ring-stone-200/80">
          <div className="bg-pine px-7 py-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[13px] font-black text-white">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500 text-pine"><Bot className="h-5 w-5" /></span>
                مسیر‌ساز هوشمند همکاری
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11.5px] font-bold text-teal-200 ring-1 ring-white/15">
                گام {faNum(step + 1)} از {faNum(3)}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
              <motion.div className="h-full rounded-full bg-amber-400" animate={{ width: `${((step + 1) / 3) * 100}%` }} transition={{ duration: 0.4 }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="px-7 py-8"
            >
              <h2 className="text-xl font-black text-slate-900">{stepTitles[step]}</h2>

              {step === 0 && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { setRole(r.id); setTimeout(() => setStep(1), 240); }}
                      className={`flex items-center gap-3.5 rounded-2xl p-4 text-start ring-1 transition-all ${role === r.id ? "bg-teal-700/[0.07] ring-2 ring-teal-600" : "bg-cream ring-stone-200/80 hover:ring-teal-600/40"}`}
                    >
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${role === r.id ? "bg-teal-700 text-white" : "bg-white text-teal-700 ring-1 ring-stone-200"}`}>
                        <r.icon className="h-5.5 w-5.5" />
                      </span>
                      <span>
                        <span className="block text-[14px] font-black text-slate-800">{r.label}</span>
                        <span className="mt-0.5 block text-[11.5px] text-slate-500">{r.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setCountry(c.id); setTimeout(() => setStep(2), 240); }}
                        className={`flex items-center gap-3.5 rounded-2xl p-4 text-start ring-1 transition-all ${country === c.id ? "bg-teal-700/[0.07] ring-2 ring-teal-600" : "bg-cream ring-stone-200/80 hover:ring-teal-600/40"}`}
                      >
                        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${country === c.id ? "bg-teal-700 text-white" : "bg-white text-teal-700 ring-1 ring-stone-200"}`}>
                          <MapPin className="h-5.5 w-5.5" />
                        </span>
                        <span className="text-[14.5px] font-black text-slate-800">{c.label}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(0)} className="mt-6 text-[13px] font-bold text-slate-400 hover:text-teal-700">بازگشت به گام قبل</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="mt-2 text-[13px] font-semibold text-slate-500">تا ۳ حوزه را انتخاب کنید ({faNum(skills.length)} از {faNum(3)})</p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {SKILLS.map((s) => {
                      const active = skills.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleSkill(s)}
                          className={`flex items-center gap-2 rounded-full px-4.5 py-2.5 text-[13px] font-bold transition-all ${
                            active ? "bg-teal-700 text-white shadow-md shadow-teal-700/25" : "bg-cream text-slate-600 ring-1 ring-stone-200 hover:ring-teal-600/40"
                          }`}
                        >
                          {active && <CheckCircle2 className="h-4 w-4" />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      onClick={finishWizard}
                      disabled={skills.length === 0}
                      className="flex items-center gap-2 rounded-full bg-teal-700 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-teal-700/25 transition-all enabled:hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Sparkles className="h-5 w-5 text-amber-400" />
                      ساخت مسیر همکاری من
                    </button>
                    <button onClick={() => setStep(1)} className="text-[13px] font-bold text-slate-400 hover:text-teal-700">بازگشت</button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

      {/* ===== result / types ===== */}
      <div id="collab-result" className="scroll-mt-36">
        {showResult && (
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto mt-14 max-w-5xl">
            <div className="overflow-hidden rounded-[28px] bg-pine text-white shadow-2xl">
              <div className="flex flex-col gap-6 p-7 md:flex-row md:items-center md:p-9">
                <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-3xl text-white shadow-xl ${activeType.color}`}>
                  <activeType.icon className="h-8 w-8" />
                </span>
                <div className="flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[12px] font-black text-amber-300">
                    <Sparkles className="h-4 w-4" />
                    {isRecommended ? `پیشنهاد هوشمند برای شما · ${faNum(rec.score)}٪ هم‌خوانی` : "نوع همکاری انتخابی شما"}
                  </p>
                  <h3 className="mt-1.5 text-2xl font-black">{activeType.name}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-7 text-teal-50/85">{activeType.tagline}</p>
                  {isRecommended && rec.reasons.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {rec.reasons.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-[12.5px] font-semibold text-slate-200">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /> {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="shrink-0 rounded-2xl bg-white/[0.07] px-5 py-4 text-center ring-1 ring-white/12">
                  <Clock3 className="mx-auto h-5 w-5 text-amber-400" />
                  <p className="mt-1.5 text-[13px] font-black leading-6">{activeType.totalTime}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-white/10 px-7 py-4 md:px-9">
                <span className="py-1 text-[12px] font-bold text-slate-400">سایر مسیرها:</span>
                {TYPES.filter((t) => t.id !== typeId).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTypeId(t.id); setReqChecked(new Set()); }}
                    className="rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[12px] font-bold text-slate-200 ring-1 ring-white/15 transition-colors hover:bg-white/[0.15]"
                  >
                    {t.name}
                    {t.id === rec.bestId && showResult && <span className="ms-1.5 text-amber-300">· پیشنهاد هوشمند</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* steps + requirements */}
            <div className="mt-8 grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <h4 className="flex items-center gap-2.5 text-lg font-black text-slate-900">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white"><ClipboardList className="h-5 w-5" /></span>
                  نقشه راه پیوستن، قدم‌به‌قدم
                </h4>
                <div className="relative mt-6 space-y-4 before:absolute before:bottom-3 before:right-[21px] before:top-3 before:w-px before:bg-stone-300/80">
                  {activeType.steps.map((s, i) => (
                    <div key={s.t} className="relative flex gap-4">
                      <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-700 text-[15px] font-black text-white ring-4 ring-cream">{faNum(i + 1)}</span>
                      <div className="flex-1 rounded-3xl bg-white p-5 ring-1 ring-stone-200/75">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="text-[14.5px] font-black text-slate-900">{s.t}</h5>
                          <span className="rounded-full bg-sand px-3 py-1 text-[11px] font-black text-slate-500">{s.dur}</span>
                        </div>
                        <p className="mt-1.5 text-[12.5px] leading-7 text-slate-600">{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/80">
                  <h4 className="flex items-center gap-2.5 text-[15.5px] font-black text-slate-900">
                    <FileCheck2 className="h-5 w-5 text-teal-700" /> پیش‌نیازهای این مسیر
                  </h4>
                  <p className="mt-1.5 text-[12px] font-semibold text-slate-400">
                    آماده‌اید؟ موارد را تیک بزنید: {faNum(reqChecked.size)} از {faNum(activeType.requirements.length)}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {activeType.requirements.map((r, i) => {
                      const done = reqChecked.has(i);
                      return (
                        <li key={r}>
                          <button
                            onClick={() =>
                              setReqChecked((prev) => {
                                const n = new Set(prev);
                                if (n.has(i)) n.delete(i); else n.add(i);
                                return n;
                              })
                            }
                            className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-start text-[12.5px] font-semibold transition-all ${
                              done ? "bg-teal-700/8 text-slate-500 ring-1 ring-teal-600/25" : "bg-cream text-slate-700 ring-1 ring-stone-200/70 hover:ring-teal-600/30"
                            }`}
                          >
                            <span className={`grid h-5.5 w-5.5 shrink-0 place-items-center rounded-md ${done ? "bg-teal-700 text-white" : "bg-white ring-1 ring-stone-300"}`}>
                              {done && <CheckCircle2 className="h-3.5 w-3.5" />}
                            </span>
                            <span className={done ? "line-through decoration-teal-600/50" : ""}>{r}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {reqChecked.size === activeType.requirements.length && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-[12.5px] font-bold leading-7 text-emerald-800 ring-1 ring-emerald-200">
                      عالی! همه پیش‌نیازها را دارید؛ فرم درخواست پایین همین صفحه قدم بعدی شماست.
                    </motion.p>
                  )}
                </div>

                <div className="mt-5 rounded-3xl bg-teal-800 p-6 text-white">
                  <h4 className="text-[15.5px] font-black">ترجیح می‌دهید اول صحبت کنیم؟</h4>
                  <p className="mt-1.5 text-[12.5px] leading-7 text-teal-50/85">در جلسه آشنایی ۳۰ دقیقه‌ای، مسیر همکاری و انتظارات دو طرف شفاف می‌شود.</p>
                  <button onClick={() => go("services")} className="mt-4 flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-[13px] font-black text-pine transition-colors hover:bg-amber-400">
                    <CalendarCheck className="h-4 w-4" /> رزرو جلسه آشنایی
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* ===== all types quick view ===== */}
      <section className="py-16">
        <SectionHead badge="انواع همکاری" title="شش درِ ورود به خانواده پل اوتیسم" desc="روی هر مسیر کلیک کنید تا نقشه راه و پیش‌نیازهایش را همین‌جا ببینید." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.07}>
              <button
                onClick={() => pickType(t.id)}
                className={`block h-full w-full rounded-3xl bg-white p-6 text-start ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(12,59,57,0.4)] ${typeId === t.id && showResult ? "shadow-lg ring-2 ring-teal-600" : "ring-stone-200/80"}`}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ${t.color}`}>
                  <t.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-[15.5px] font-black leading-7 text-slate-900">{t.name}</h3>
                <p className="mt-1.5 text-[12.5px] leading-7 text-slate-500">{t.tagline}</p>
                <span className="mt-4 flex items-center gap-1.5 text-[12px] font-black text-teal-800">
                  <Clock3 className="h-4 w-4" /> {t.totalTime}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== benefits ===== */}
      <section className="pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: "مخاطب واقعی و تخصصی", desc: "دسترسی به انجمن ۱۲ هزار خانواده و شبکه ۴۵۰ متخصص در سه کشور." },
            { icon: Globe2, title: "حضور بین‌المللی", desc: "نام و تخصص شما در سایت، یوتیوب و اتاق هفتگی به سه کشور می‌رسد." },
            { icon: Award, title: "اعتبار علمی", desc: "صفحه اختصاصی همکار و نشان «همکار رسمی پل اوتیسم» برای رزومه شما." },
            { icon: TrendingUp, title: "رشد و ارجاع هدفمند", desc: "مراجع و پروژه دقیقاً بر اساس شهر و تخصص شما ارجاع داده می‌شود." },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.07}>
              <div className="h-full rounded-3xl bg-pine p-6 text-white">
                <b.icon className="h-8 w-8 text-amber-400" />
                <h3 className="mt-3.5 text-[15px] font-black">{b.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-7 text-slate-300">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== application form ===== */}
      <section id="collab-form" className="scroll-mt-36 pb-20">
        <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-32px_rgba(12,59,57,0.45)] ring-1 ring-stone-200/80 lg:grid-cols-5">
          <div className="bg-pine p-8 text-white lg:col-span-2">
            <Bot className="h-10 w-10 text-amber-400" />
            <h2 className="mt-4 text-2xl font-black leading-snug">فرم درخواست همکاری</h2>
            <p className="mt-3 text-[13.5px] leading-8 text-slate-300">
              بعد از ثبت فرم: بررسی اولیه ظرف ۳ روز کاری، جلسه آشنایی آنلاین و شروع مسیر طبق نقشه راهی که ساختید.
            </p>
            <ul className="mt-6 space-y-3">
              {TYPES.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setTypeId(t.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start text-[13px] font-bold transition-all ${
                      typeId === t.id ? "bg-amber-500 text-pine" : "bg-white/[0.07] text-slate-200 ring-1 ring-white/12 hover:bg-white/[0.12]"
                    }`}
                  >
                    <t.icon className="h-4.5 w-4.5 shrink-0" />
                    {t.name}
                    {typeId === t.id && <CheckCircle2 className="ms-auto h-4.5 w-4.5" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-7 md:p-9 lg:col-span-3">
            <AnimatePresence mode="wait">
              {doneCode ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </span>
                  <h3 className="mt-6 text-2xl font-black text-slate-900">درخواست همکاری شما ثبت شد</h3>
                  <p className="mt-3 max-w-md text-sm leading-8 text-slate-600">
                    مسیر «{activeType.name}» برای بررسی به تیم ما رسید. حداکثر تا ۳ روز کاری آینده برای جلسه آشنایی با شما هماهنگ می‌کنیم.
                  </p>
                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-cream px-6 py-4 ring-1 ring-stone-200">
                    <span className="text-[12px] font-bold text-slate-500">کد رهگیری درخواست</span>
                    <span dir="ltr" className="text-lg font-black tracking-widest text-teal-800">{doneCode}</span>
                  </div>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <button onClick={() => go("room")} className="rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white hover:bg-teal-800">
                      مشاهده صفحه اتاق هفتگی
                    </button>
                    <button
                      onClick={() => { setDoneCode(null); setForm({ name: "", contact: "", link: "", message: "" }); }}
                      className="rounded-full px-6 py-3 text-sm font-bold text-slate-600 ring-1 ring-stone-300 hover:ring-teal-600/40"
                    >
                      ثبت درخواست جدید
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
                  <h3 className="text-lg font-black text-slate-900 sm:col-span-2">
                    درخواست: <span className="text-teal-700">{activeType.name}</span>
                  </h3>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">نام و نام خانوادگی / نام مجموعه *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلاً مرکز توانبخشی آوا" className={inputCls(errors.name)} />
                    {errors.name && <p className="mt-1.5 text-[11.5px] font-bold text-rose-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">ایمیل یا شماره تماس *</label>
                    <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="راه ارتباطی برای هماهنگی جلسه" className={inputCls(errors.contact)} />
                    {errors.contact && <p className="mt-1.5 text-[11.5px] font-bold text-rose-600">{errors.contact}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">کشور / شهر</label>
                    <select onChange={(e) => setCountry(e.target.value)} value={country} className={inputCls()}>
                      <option value="">انتخاب کنید…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">لینک نمونه‌کار / صفحه اجتماعی</label>
                    <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} dir="ltr" placeholder="https://…" className={`${inputCls()} text-left`} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">درباره تخصص و ایده همکاری‌تان *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      placeholder="سوابق، متدهای تخصصی، موضوع پیشنهادی برای اتاق یا مدلی که برای همکاری در ذهن دارید…"
                      className={`${inputCls(errors.message)} resize-none leading-7`}
                    />
                    {errors.message && <p className="mt-1.5 text-[11.5px] font-bold text-rose-600">{errors.message}</p>}
                  </div>
                  <button type="submit" className="flex items-center justify-center gap-2 rounded-full bg-teal-700 py-4 text-[15px] font-black text-white shadow-xl shadow-teal-700/25 transition-colors hover:bg-teal-800 sm:col-span-2">
                    <Send className="h-5 w-5 -scale-x-100" /> ارسال درخواست همکاری
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-[11.5px] text-slate-400 sm:col-span-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    پیشنهاد هوشمند مسیر را ساخت؛ تصمیم نهایی همکاری بعد از جلسه آشنایی و بررسی تیم علمی گرفته می‌شود.
                  </p>
                  <button type="button" onClick={() => go("room")} className="flex items-center justify-center gap-1.5 text-center text-[12.5px] font-black text-teal-800 sm:col-span-2">
                    اول اتاق این هفته را ببینید <ArrowLeft className="h-4 w-4" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
