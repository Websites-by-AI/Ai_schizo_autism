import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck, Building2, CalendarCheck, CheckCircle2, ClipboardCheck, Clock3, FileSearch,
  MessagesSquare, Phone, Route, Sparkles, User, Video,
} from "lucide-react";
import { FaqList, Reveal, SectionHead, faNum, type GoFn } from "../components/ui";

const PACKAGES = [
  {
    id: "consult",
    name: "مشاوره مسیر",
    price: "۴۹",
    unit: "یورو / جلسه ۶۰ دقیقه‌ای",
    color: "bg-teal-700",
    ring: "ring-stone-200/80",
    popular: false,
    desc: "برای وقتی که بین کشورها و مسیرها مردد هستید و نقشه راه روشن می‌خواهید.",
    features: [
      "بررسی رزومه، مدرک و سطح زبان شما",
      "مقایسه شخصی‌سازی‌شده آلمان، ترکیه و ایران",
      "نقشه راه مکتوب با زمان‌بندی و هزینه‌های تقریبی",
      "پاسخ به پرسش‌های اقامت خانواده",
      "فایل ضبط جلسه + چک‌لیست قدم اول",
    ],
  },
  {
    id: "file",
    name: "ارزیابی و آماده‌سازی پرونده",
    price: "۲۹۰",
    unit: "یورو / پرونده کامل",
    color: "bg-amber-500",
    ring: "ring-amber-500/60",
    popular: true,
    desc: "همراهی کامل پرونده معادلسازی؛ از ترجمه تا ارسال و پیگیری.",
    features: [
      "همه امکانات «مشاوره مسیر»",
      "بازبینی خط‌به‌خط مدارک پیش از ترجمه رسمی",
      "تهیه رزومه Europass و انگیزه‌نامه آلمانی/ترکی",
      "ثبت و پیگیری پرونده Anerkennung یا YÖK/STS",
      "آمادگی مصاحبه با ۲ جلسه شبیه‌سازی",
      "پشتیبانی پیام‌رسان تا پایان پرونده",
    ],
  },
  {
    id: "launch",
    name: "راه‌اندازی مرکز اوتیسم",
    price: "از ۹۹۰",
    unit: "یورو / پروژه (ایران و ترکیه)",
    color: "bg-rose-700",
    ring: "ring-stone-200/80",
    popular: false,
    desc: "از امکان‌سنجی و مجوز تا تجهیز اتاق حسی و جذب اولین مراجع.",
    features: [
      "امکان‌سنجی شهر، محله و مدل درآمدی مرکز",
      "مسیر کامل مجوز (بهزیستی ایران / MEB ترکیه)",
      "طرح تجهیز اتاق حسی و فضاهای درمانی",
      "چارت تیم درمان و پروتکل ارزیابی اولیه",
      "همراهی تا روز افتتاح و پذیرش اول",
    ],
  },
];

const PROCESS = [
  { icon: CalendarCheck, title: "رزرو و پرداخت", desc: "فرم زیر را تکمیل کنید؛ لینک پرداخت و تأییدیه ظرف چند ساعت ارسال می‌شود." },
  { icon: FileSearch, title: "ارسال مدارک", desc: "چک‌لیست دقیق مدارک موردنیاز جلسه برایتان فرستاده می‌شود." },
  { icon: Video, title: "جلسه ویدیویی", desc: "۶۰ دقیقه گفت‌وگوی عمیق با مشاور تخصصی همان کشور مقصد." },
  { icon: Route, title: "تحویل نقشه راه", desc: "سند مکتوب مسیر، زمان‌بندی، هزینه‌ها و قدم‌های هفته اول را دریافت می‌کنید." },
];

const SERVICE_FAQS = [
  { q: "مشاوره به چه زبانی برگزار می‌شود؟", a: "به انتخاب شما: فارسی، انگلیسی، آلمانی یا ترکی استانبولی. برای پرونده‌های آلمان و ترکیه، مشاور همان کشور در جلسه حضور دارد." },
  { q: "اگر بعد از مشاوره مسیر، پکیج پرونده را بخواهم چه می‌شود؟", a: "هزینه جلسه مشاوره مسیر به‌طور کامل از پکیج آماده‌سازی پرونده کسر می‌شود؛ یعنی عملاً جلسه اول برایتان رایگان می‌شود." },
  { q: "آیا تضمین ویزا یا استخدام می‌دهید؟", a: "هیچ مؤسسه معتبری چنین تضمینی نمی‌دهد و ما هم نمی‌دهیم. تعهد ما: نقشه راه دقیق بر اساس قوانین روز، پرونده بدون نقص و آمادگی کامل مصاحبه؛ تصمیم نهایی با اداره مهاجرت و کارفرماست." },
  { q: "امکان پرداخت ریالی وجود دارد؟", a: "بله؛ برای کاربران داخل ایران پرداخت ریالی معادل روز و برای خارج از ایران پرداخت یورویی با کارت یا انتقال بانکی ممکن است. جزئیات پس از رزرو ارسال می‌شود." },
];

interface FormState {
  name: string; phone: string; email: string; country: string; service: string; date: string; message: string;
}

export default function Services({ go }: { go: GoFn }) {
  const [selected, setSelected] = useState("file");
  const [form, setForm] = useState<FormState>({ name: "", phone: "", email: "", country: "germany", service: "file", date: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [done, setDone] = useState<string | null>(null);

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    if (k === "service") setSelected(v);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 3) errs.name = "نام کامل را وارد کنید";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "ایمیل معتبر وارد کنید";
    if (form.phone.replace(/\D/g, "").length < 10) errs.phone = "شماره تماس معتبر وارد کنید";
    if (!form.date) errs.date = "تاریخ ترجیحی را انتخاب کنید";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const code = "AB-" + Math.floor(100000 + Math.random() * 900000);
    setDone(code);
    try {
      const prev = JSON.parse(localStorage.getItem("ab-bookings") ?? "[]");
      localStorage.setItem("ab-bookings", JSON.stringify([...prev, { ...form, code }]));
    } catch { /* ignore */ }
  };

  const inputCls = (err?: string) =>
    `w-full rounded-2xl bg-cream px-4 py-3 text-sm font-medium text-slate-800 ring-1 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
      err ? "ring-rose-400 focus:ring-rose-400" : "ring-stone-200 focus:ring-teal-600"
    }`;

  const countryName = { germany: "آلمان", turkey: "ترکیه", iran: "ایران", undecided: "هنوز مطمئن نیستم" }[form.country] ?? form.country;
  const serviceName = PACKAGES.find((p) => p.id === form.service)?.name;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="خدمات و مشاوره"
        title="کنار شما، از اولین سؤال تا روز شروع کار"
        desc="سه سطح همراهی شفاف و بدون هزینه پنهان؛ از یک جلسه نقشه راه تا ساخت پرونده کامل و راه‌اندازی مرکز."
      />

      {/* packages */}
      <div className="mt-12 grid gap-6 pb-16 lg:grid-cols-3">
        {PACKAGES.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.09}>
            <div
              className={`relative flex h-full flex-col rounded-[26px] bg-white p-7 ring-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-26px_rgba(12,59,57,0.4)] ${
                selected === p.id ? `shadow-xl ring-2 ${p.ring}` : p.ring
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 right-6 flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-[11.5px] font-black text-pine shadow-lg">
                  <Sparkles className="h-3.5 w-3.5" /> محبوب‌ترین انتخاب متخصصان
                </span>
              )}
              <h3 className="text-lg font-black text-slate-900">{p.name}</h3>
              <p className="mt-1.5 text-[13px] leading-7 text-slate-500">{p.desc}</p>
              <p className="mt-5">
                <span className="text-4xl font-black text-slate-900">{p.price}</span>
                <span className="ms-2 text-[12.5px] font-bold text-slate-400">{p.unit}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] font-semibold leading-7 text-slate-700">
                    <CheckCircle2 className="mt-1.5 h-4.5 w-4.5 shrink-0 text-teal-600" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  set("service", p.id);
                  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`mt-7 w-full rounded-full py-3.5 text-sm font-black text-white transition-opacity hover:opacity-90 ${p.color}`}
              >
                انتخاب و رزرو این خدمت
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      {/* process */}
      <section className="pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="relative h-full rounded-3xl bg-white p-6 ring-1 ring-stone-200/75">
                <span className="absolute left-5 top-5 text-4xl font-black text-stone-100">{faNum(i + 1)}</span>
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-teal-700/10 text-teal-700">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-4 text-[15px] font-black text-slate-900">{s.title}</h3>
                <p className="relative mt-1.5 text-[12.5px] leading-7 text-slate-500">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* booking */}
      <section id="booking" className="scroll-mt-36 pb-16">
        <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-32px_rgba(12,59,57,0.45)] ring-1 ring-stone-200/80 lg:grid-cols-5">
          {/* side */}
          <div className="relative bg-pine p-8 text-white lg:col-span-2">
            <ClipboardCheck className="h-10 w-10 text-amber-400" />
            <h2 className="mt-4 text-2xl font-black leading-snug">فرم رزرو جلسه مشاوره</h2>
            <p className="mt-3 text-[13.5px] leading-8 text-slate-300">
              پس از ثبت فرم، ظرف حداکثر ۱۲ ساعت کاری با شما تماس می‌گیریم تا زمان دقیق جلسه و شیوه پرداخت هماهنگ شود.
            </p>
            <ul className="mt-6 space-y-3 text-[13px] font-semibold text-teal-50/90">
              {[
                { icon: Video, t: "جلسه ویدیویی در گوگل میت یا واتساپ" },
                { icon: Clock3, t: "امکان تغییر زمان تا ۲۴ ساعت قبل" },
                { icon: BadgeCheck, t: "مشاوران دارای تجربه واقعی در هر سه کشور" },
                { icon: MessagesSquare, t: "پشتیبانی پیام‌رسان تا ۷ روز بعد از جلسه" },
              ].map((x) => (
                <li key={x.t} className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10"><x.icon className="h-4 w-4 text-amber-300" /></span>
                  {x.t}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/12">
              <p className="flex items-center gap-2 text-[12.5px] font-bold text-amber-300">
                <Building2 className="h-4 w-4" /> برای مراکز و سازمان‌ها
              </p>
              <p className="mt-1.5 text-[12.5px] leading-7 text-slate-300">
                آموزش تیمی، سوپرویژن دوره‌ای یا طراحی مرکز به‌صورت سازمانی هم ارائه می‌شود؛ در پیام فرم بنویسید «درخواست سازمانی».
              </p>
            </div>
          </div>

          {/* form */}
          <div className="p-7 md:p-9 lg:col-span-3">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center py-10 text-center"
                >
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </span>
                  <h3 className="mt-6 text-2xl font-black text-slate-900">درخواست شما ثبت شد، {form.name.split(" ")[0]} عزیز</h3>
                  <p className="mt-3 max-w-md text-sm leading-8 text-slate-600">
                    جلسه «{serviceName}» برای مقصد {countryName} با موفقیت رزرو اولیه شد. همکاران ما حداکثر تا ۱۲ ساعت کاری آینده برای هماهنگی زمان دقیق و پرداخت با شما در تماس خواهند بود.
                  </p>
                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-cream px-6 py-4 ring-1 ring-stone-200">
                    <span className="text-[12px] font-bold text-slate-500">کد رهگیری رزرو</span>
                    <span dir="ltr" className="text-lg font-black tracking-widest text-teal-800">{done}</span>
                  </div>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <button onClick={() => { setDone(null); setForm({ name: "", phone: "", email: "", country: "germany", service: "file", date: "", message: "" }); }} className="rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white hover:bg-teal-800">
                      ثبت رزرو جدید
                    </button>
                    <button onClick={() => go("pathfinder")} className="rounded-full px-6 py-3 text-sm font-bold text-slate-600 ring-1 ring-stone-300 hover:ring-teal-600/40">
                      مشاهده نقشه راه شخصی
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={submit}
                  className="grid gap-4 sm:grid-cols-2"
                  noValidate
                >
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-slate-700"><User className="h-4 w-4 text-teal-700" /> نام و نام خانوادگی *</label>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="مثلاً سارا محمدی" className={inputCls(errors.name)} />
                    {errors.name && <p className="mt-1.5 text-[11.5px] font-bold text-rose-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-slate-700"><Phone className="h-4 w-4 text-teal-700" /> موبایل / واتساپ *</label>
                    <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="۰۹۱۲ ··· ····" inputMode="tel" className={inputCls(errors.phone)} />
                    {errors.phone && <p className="mt-1.5 text-[11.5px] font-bold text-rose-600">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">ایمیل *</label>
                    <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" type="email" className={inputCls(errors.email)} />
                    {errors.email && <p className="mt-1.5 text-[11.5px] font-bold text-rose-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">کشور مقصد</label>
                    <select value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls()}>
                      <option value="germany">آلمان</option>
                      <option value="turkey">ترکیه · استانبول</option>
                      <option value="iran">ایران</option>
                      <option value="undecided">هنوز مطمئن نیستم</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">نوع خدمت</label>
                    <select value={form.service} onChange={(e) => set("service", e.target.value)} className={inputCls()}>
                      {PACKAGES.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} — {p.price} یورو</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">تاریخ ترجیحی جلسه *</label>
                    <input value={form.date} onChange={(e) => set("date", e.target.value)} type="date" className={inputCls(errors.date)} />
                    {errors.date && <p className="mt-1.5 text-[11.5px] font-bold text-rose-600">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">ساعت موردعلاقه</label>
                    <select className={inputCls()} defaultValue="عصر">
                      <option>صبح (۹ تا ۱۲)</option>
                      <option>ظهر (۱۲ تا ۱۶)</option>
                      <option>عصر (۱۶ تا ۲۰)</option>
                      <option>شب (۲۰ تا ۲۲)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">درباره شرایطتان بنویسید</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      rows={4}
                      placeholder="رشته و مدرک، سطح زبان، سابقه کار و مهم‌ترین سؤالتان…"
                      className={`${inputCls()} resize-none leading-7`}
                    />
                  </div>
                  <button type="submit" className="flex items-center justify-center gap-2 rounded-full bg-teal-700 py-4 text-[15px] font-black text-white shadow-xl shadow-teal-700/25 transition-all hover:bg-teal-800 sm:col-span-2">
                    <CalendarCheck className="h-5 w-5" /> ثبت درخواست رزرو
                  </button>
                  <p className="text-center text-[11.5px] leading-6 text-slate-400 sm:col-span-2">
                    ثبت فرم به معنای پرداخت نیست؛ ابتدا هماهنگی و بررسی پرونده انجام می‌شود و سپس لینک پرداخت ارسال خواهد شد.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="grid gap-10 pb-20 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <SectionHead center={false} badge=" شفافیت کامل" title="سؤال‌های قبل از رزرو" desc="اگر سؤالتان اینجا نیست، در تلگرام یا فرم تماس بپرسید؛ معمولاً همان روز پاسخ می‌دهید." />
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-3">
          <FaqList faqs={SERVICE_FAQS} />
        </Reveal>
      </section>
    </div>
  );
}
