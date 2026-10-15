import { useEffect, useState } from "react";
import {
  ArrowLeft, Bell, BellRing, CalendarDays, Check, CheckCircle2, Clock3, Copy, HeartHandshake,
  Link2, ListChecks, Mic, Play, Radio, Save, ShieldCheck, Trash2, Users,
} from "lucide-react";
import { Reveal, SectionHead, faNum, type GoFn } from "../components/ui";

const SITE_ROOM_LINK = "autismbridge.ir/room";
const SITE_COLLAB_LINK = "autismbridge.ir/collaborate";
const ROOM_LINK_KEY = "ab-room-link";

const WEEKLY_TOPICS = [
  {
    title: "اتاق حسی در خانه؛ نسخه کم‌هزینه برای والدین",
    desc: "بدون خرید تجهیزات گران، یک گوشه حسی استاندارد و امن در خانه بسازید و آن را به روتین روزانه کودک وصل کنید.",
    points: ["تفاوت «اتاق حسی استاندارد» با یک گوشه آرام ساده", "۱۰ وسیله کاربردی با بودجه محدود و جایگزین‌های خانگی", "پروتکل ۲۰ دقیقه‌ای روزانه والدین برای تنظیم حسی", "پرسش و پاسخ زنده با کیس‌های واقعی شما"],
    guest: "دکتر سارا محمدی — روانشناس کودک، تهران",
  },
  {
    title: "Anerkennung قدم‌به‌قدم؛ پرسش و پاسخ با درمانگران آلمان",
    desc: "از ترجمه مدارک تا دوره تطبیقی؛ هر آنچه کاردرمانگران و گفتاردرمانگران برای معادلسازی در آلمان باید بدانند.",
    points: ["اشتباهات رایج پرونده که ماه‌ها تأخیر می‌سازد", "تفاوت ایالت‌ها در پذیرش مدرک زبان", "تجربه زنده آزمون Kenntnisprüfung", "پاسخ به سؤالات پرونده شما"],
    guest: "مریم کریمی — کاردرمانگر، برلین",
  },
  {
    title: "از غربالگری تا تشخیص؛ اشتباهات رایج خانواده‌ها",
    desc: "چه زمانی «صبر کنیم» خطرناک است؟ مسیر درست ارزیابی در ایران، آلمان و ترکیه چطور فرق می‌کند؟",
    points: ["نشانه‌های هشدار بر اساس سن، بدون ترساندن والدین", "تفاوت غربالگری، ارزیابی و تشخیص قطعی", "انتخاب اولین متد درمانی؛ از کجا شروع کنیم؟", "تجربه خانواده‌های هر سه کشور"],
    guest: "علی رضایی — تحلیلگر رفتار (BCBA)",
  },
  {
    title: "تأسیس مرکز در استانبول؛ تجربه زنده دو مؤسس ایرانی",
    desc: "از ثبت شرکت تا اولین مراجع؛ اعداد و واقعیت‌های راه‌اندازی مرکز مشاوره و توانبخشی در استانبول.",
    points: ["مسیر مجوز: MEB، بهزیستی یا مشاوره خانواده؟", "هزینه‌های واقعی ۲۰۲۵؛ اجاره، تجهیز، تیم", "جذب مراجع فارسی‌زبان و ترک‌زبان", "پرسش و پاسخ حقوقی با وکیل محلی"],
    guest: "دکتر امره کایا — مشاور حقوقی، استانبول",
  },
];

const AGENDA = [
  { time: "۲۱:۰۰", title: "خوش‌آمد و معرفی مهمان‌ها", dur: "۱۰ دقیقه" },
  { time: "۲۱:۱۰", title: "ارائه تخصصی موضوع هفته", dur: "۳۰ دقیقه" },
  { time: "۲۱:۴۰", title: "کیس‌استادی و تحلیل گروهی", dur: "۲۰ دقیقه" },
  { time: "۲۲:۰۰", title: "پرسش و پاسخ آزاد", dur: "۲۵ دقیقه" },
  { time: "۲۲:۲۵", title: "جمع‌بندی، منابع و معرفی جلسه بعد", dur: "۵ دقیقه" },
];

const RULES = [
  "صحبت فقط با نوبت و از طریق بالا بردن دست (Hand Raise)؛ میزبان نوبت می‌دهد.",
  "حریم خصوصی کودکان خط قرمز است: بدون نام، عکس یا جزئیات شناسایی‌کننده از کیس‌ها حرف می‌زنیم.",
  "تبلیغ مستقیم خدمات ممنوع است؛ معرفی تخصصی فقط در بخش پایانی و با هماهنگی میزبان.",
  "اطلاعات اتاق آموزشی است و جایگزین توصیه پزشکی برای کودک شما نیست.",
  "بخش‌هایی از اتاق با اعلام قبلی ضبط و در یوتیوب پل اوتیسم منتشر می‌شود.",
];

const EPISODES = [
  { title: "از B2 تا قرارداد کاری در برلین", meta: "۵٬۱۰۰ شنونده · ۲ ساعت و ۱۰ دقیقه" },
  { title: "اشتباهات رایج در شروع ABA", meta: "۴٬۲۰۰ شنونده · ۲ ساعت" },
  { title: "مدرسه در استانبول برای کودک اوتیستیک؛ تجربه ۵ خانواده", meta: "۲٬۸۰۰ شنونده · ۹۰ دقیقه" },
  { title: "پدرها هم حرف دارند؛ تجربه پدران از مسیر درمان", meta: "۳٬۶۰۰ شنونده · ۱۰۰ دقیقه" },
];

const HOSTS = [
  { name: "دکتر سارا محمدی", role: "میزبان اصلی", initials: "س‌م", color: "bg-teal-600" },
  { name: "علی رضایی", role: "هم‌میزبان (BCBA)", initials: "ع‌ر", color: "bg-amber-600" },
  { name: "مریم کریمی", role: "مهمان این هفته · برلین", initials: "م‌ک", color: "bg-rose-600" },
];

function nextSession(from = new Date()): Date {
  // جلسات: پنجشنبه‌ها ساعت ۲۱:۰۰ تهران = ۱۷:۳۰ UTC
  const t = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 17, 30, 0));
  const add = (4 - from.getUTCDay() + 7) % 7; // پنجشنبه = ۴
  t.setUTCDate(t.getUTCDate() + add);
  if (t.getTime() <= from.getTime()) t.setUTCDate(t.getUTCDate() + 7);
  return t;
}

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", weekday: "long", day: "numeric", month: "long" }).format(d);

export default function Room({ go }: { go: GoFn }) {
  const [target, setTarget] = useState<Date>(() => nextSession());
  const [now, setNow] = useState(() => new Date());
  const [reminded, setReminded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [roomLink, setRoomLink] = useState<string>(() => {
    try { return localStorage.getItem(ROOM_LINK_KEY) ?? ""; } catch { return ""; }
  });
  const [draft, setDraft] = useState(roomLink);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now.getTime());
  useEffect(() => {
    if (diff === 0) setTarget(nextSession(new Date(Date.now() + 60_000)));
  }, [diff]);

  const cd = {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    s: Math.floor((diff / 1_000) % 60),
  };

  const sessions = WEEKLY_TOPICS.map((t, i) => {
    const d = new Date(target);
    d.setUTCDate(d.getUTCDate() + i * 7);
    return { ...t, date: d };
  });
  const featured = sessions[0];
  const joinTarget = roomLink || SITE_ROOM_LINK;

  const DESCRIPTIONS: { id: string; title: string; hint: string; text: string }[] = [
    {
      id: "full",
      title: "توضیحات کامل اتاق (برای بخش About کلاب‌هاوس)",
      hint: "همین متن را کپی و در توضیحات اتاق بچسبانید",
      text: `اتاق هفتگی «پل اوتیسم» | گفت‌وگوی تخصصی اوتیسم
هر پنجشنبه ساعت ۲۱:۰۰ به وقت تهران در کلاب‌هاوس

اینجا درمانگران، روانشناسان، والدین و متخصصان مهاجرت از ایران، آلمان و ترکیه دور هم جمع می‌شویم؛ درباره متدهای روز دنیا (ABA، مدل دنور، TEACCH و یکپارچگی حسی)، مسیر کار و معادلسازی مدرک در آلمان، تأسیس مرکز در استانبول و ایران و تجربه واقعی خانواده‌ها گفت‌وگو می‌کنیم.

ساختار هر جلسه: ارائه تخصصی، کیس‌استادی گروهی و پرسش و پاسخ آزاد.

قوانین اتاق:
• صحبت با نوبت و احترام به وقت دیگران
• بدون تبلیغات مستقیم؛ معرفی فقط با هماهنگی میزبان
• حفظ کامل حریم خصوصی کودکان (بدون نام و عکس)
• محتوای آموزشی است و جایگزین توصیه پزشکی نیست

نقشه راه‌ها، چک‌لیست‌ها و فایل‌های هر جلسه در سایت:
${SITE_ROOM_LINK}

می‌خواهید سخنران یا همکار اتاق شوید؟
${SITE_COLLAB_LINK}

یوتیوب: AutismBridgeTV@ | اینستاگرام: autismbridge.ir@ | تلگرام: AutismBridge@`,
    },
    {
      id: "short",
      title: "توضیحات کوتاه (برای عنوان و معرفی سریع)",
      hint: "مناسب بیو، استوری و پیام‌های کوتاه",
      text: `اتاق هفتگی اوتیسم «پل اوتیسم» — هر پنجشنبه ۲۱:۰۰ تهران در کلاب‌هاوس. متخصصان و والدین از ایران، آلمان و ترکیه؛ متدهای روز، مهاجرت کاری و تأسیس مرکز. راهنماها و فایل‌ها: ${SITE_ROOM_LINK} | همکاری: ${SITE_COLLAB_LINK}`,
    },
    {
      id: "invite",
      title: "متن دعوت (تلگرام، واتساپ و دایرکت)",
      hint: "برای دعوت مخاطبان به جلسه این هفته",
      text: `سلام! پنجشنبه این هفته ساعت ۲۱:۰۰ (تهران) در اتاق کلاب‌هاوس «پل اوتیسم» درباره «${featured.title}» صحبت می‌کنیم؛ با حضور ${featured.guest}.

ورود به اتاق: ${joinTarget}
جزئیات، سرفصل‌ها و فایل‌های جلسه: ${SITE_ROOM_LINK}

اگر درمانگر، روانشناس یا والد کودکی در طیف اوتیسم هستید، این گفت‌وگو را از دست ندهید.`,
    },
  ];

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(id);
    window.setTimeout(() => setCopied(null), 2200);
  };

  const saveLink = () => {
    const v = draft.trim();
    setRoomLink(v);
    try {
      if (v) localStorage.setItem(ROOM_LINK_KEY, v);
      else localStorage.removeItem(ROOM_LINK_KEY);
    } catch { /* ignore */ }
  };

  const removeLink = () => {
    setDraft("");
    setRoomLink("");
    try { localStorage.removeItem(ROOM_LINK_KEY); } catch { /* ignore */ }
  };

  const cdBox = (v: number, l: string) => (
    <div className="min-w-[68px] rounded-2xl bg-white/[0.08] px-3 py-3 text-center ring-1 ring-white/15">
      <p className="text-2xl font-black tabular-nums text-white">{faNum(String(v).padStart(2, "0"))}</p>
      <p className="mt-0.5 text-[11px] font-bold text-teal-200">{l}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="کلاب‌هاوس · اتاق هفتگی اوتیسم"
        title="هر پنجشنبه، یک گفت‌وگوی زنده و تخصصی"
        desc="اتاق رسمی «پل اوتیسم» در کلاب‌هاوس؛ جایی که متخصصان و خانواده‌های ایران، آلمان و ترکیه مستقیم و بدون واسطه حرف می‌زنند."
      />

      {/* ===== HERO / NEXT SESSION ===== */}
      <Reveal className="mt-12">
        <div className="relative overflow-hidden rounded-[30px] bg-pine text-white shadow-2xl">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="relative grid gap-8 p-7 md:p-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-2 rounded-full bg-red-500/20 px-3.5 py-1.5 text-[12px] font-black text-red-200 ring-1 ring-red-400/40">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                  </span>
                  جلسه بعدی اتاق
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-bold text-teal-100 ring-1 ring-white/15">
                  <CalendarDays className="h-4 w-4" /> {fmtDate(target)} · ساعت ۲۱:۰۰ تهران
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-black leading-[1.4] md:text-4xl md:leading-[1.35]">{featured.title}</h2>
              <p className="mt-3 max-w-2xl text-[14.5px] leading-8 text-teal-50/85">{featured.desc}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {featured.points.map((p) => (
                  <span key={p} className="flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-[12px] font-semibold text-slate-200 ring-1 ring-white/12">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> {p}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-3 space-x-reverse">
                  {HOSTS.map((h) => (
                    <span key={h.name} title={`${h.name} — ${h.role}`} className={`grid h-11 w-11 place-items-center rounded-full text-[12px] font-black text-white ring-[3px] ring-pine ${h.color}`}>
                      {h.initials}
                    </span>
                  ))}
                </div>
                <div className="text-[12.5px] leading-6">
                  <p className="font-black text-white">{HOSTS.map((h) => h.name).join(" · ")}</p>
                  <p className="font-semibold text-teal-200">{featured.guest}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-3xl bg-white/[0.05] p-6 ring-1 ring-white/12 lg:col-span-2">
              <p className="flex items-center gap-2 text-[13px] font-black text-teal-200">
                <Clock3 className="h-4.5 w-4.5 text-amber-400" /> شمارش معکوس تا شروع اتاق
              </p>
              <div dir="ltr" className="mt-4 flex justify-center gap-2.5">
                {cdBox(cd.d, "روز")}
                {cdBox(cd.h, "ساعت")}
                {cdBox(cd.m, "دقیقه")}
                {cdBox(cd.s, "ثانیه")}
              </div>

              {roomLink ? (
                <a
                  href={roomLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 rounded-full bg-red-500 py-3.5 text-[15px] font-black text-white shadow-xl shadow-red-900/40 transition-all hover:bg-red-400"
                >
                  <Mic className="h-5 w-5" /> ورود به اتاق در کلاب‌هاوس
                </a>
              ) : (
                <button
                  disabled
                  className="mt-6 flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-white/10 py-3.5 text-[15px] font-black text-slate-300 ring-1 ring-white/20"
                >
                  <Mic className="h-5 w-5" /> لینک اتاق به‌زودی فعال می‌شود
                </button>
              )}
              {!roomLink && (
                <p className="mt-2.5 text-center text-[11.5px] leading-6 text-slate-400">
                  میزبان به‌محض شروع اتاق، لینک را در پنل همین صفحه (پایین‌تر) ثبت می‌کند.
                </p>
              )}

              <button
                onClick={() => setReminded(!reminded)}
                className={`mt-3 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all ${
                  reminded ? "bg-emerald-500 text-white" : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"
                }`}
              >
                {reminded ? <><BellRing className="h-4.5 w-4.5" /> یادآوری فعال است؛ خبرتان می‌کنیم</> : <><Bell className="h-4.5 w-4.5" /> یادآوری شروع اتاق</>}
              </button>

              <button
                onClick={() => copyText(`اتاق هفتگی اوتیسم «پل اوتیسم» — ${fmtDate(target)} ساعت ۲۱:۰۰ تهران | ${joinTarget}`, "share")}
                className="mt-3 flex items-center justify-center gap-2 rounded-full py-2 text-[12.5px] font-bold text-teal-200 transition-colors hover:text-white"
              >
                {copied === "share" ? <><Check className="h-4 w-4 text-emerald-400" /> لینک کپی شد</> : <><Copy className="h-4 w-4" /> کپی لینک دعوت این جلسه</>}
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== MAIN GRID ===== */}
      <div className="grid gap-8 py-14 lg:grid-cols-3">
        {/* main column */}
        <div className="space-y-10 lg:col-span-2">
          {/* upcoming sessions */}
          <section>
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2.5 text-xl font-black text-slate-900">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white"><CalendarDays className="h-5 w-5" /></span>
                  برنامه چهار جلسه آینده
                </h3>
                <button onClick={() => go("season")} className="flex items-center gap-1.5 rounded-full bg-pine px-5 py-2.5 text-[12.5px] font-black text-white transition-colors hover:bg-pine-light">
                  نقشه کامل ۱۰ جلسه فصل اول <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
            </Reveal>
            <div className="mt-5 space-y-3.5">
              {sessions.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.06}>
                  <div className={`flex flex-col gap-3 rounded-3xl p-5 ring-1 transition-all sm:flex-row sm:items-center ${i === 0 ? "bg-white shadow-[0_16px_40px_-24px_rgba(12,59,57,0.4)] ring-teal-600/30" : "bg-white/70 ring-stone-200/80"}`}>
                    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-center ${i === 0 ? "bg-red-500 text-white" : "bg-sand text-slate-600"}`}>
                      <span>
                        <span className="block text-[16px] font-black leading-5">{faNum(new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", day: "numeric" }).format(s.date))}</span>
                        <span className="block text-[10px] font-bold">{new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", month: "short" }).format(s.date)}</span>
                      </span>
                    </span>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-black leading-7 text-slate-900">{s.title}</h4>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold text-slate-500">
                        <span>{fmtDate(s.date)} · ۲۱:۰۰ تهران</span>
                        <span className="text-teal-700">{s.guest}</span>
                      </p>
                    </div>
                    {i === 0 && <span className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-black text-red-600 ring-1 ring-red-200">این هفته</span>}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* agenda */}
          <section>
            <Reveal>
              <h3 className="flex items-center gap-2.5 text-xl font-black text-slate-900">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white"><ListChecks className="h-5 w-5" /></span>
                ساختار هر جلسه (۹۰ دقیقه)
              </h3>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="relative mt-6 space-y-3.5 before:absolute before:bottom-3 before:right-[52px] before:top-3 before:w-px before:bg-stone-300/70">
                {AGENDA.map((a) => (
                  <div key={a.time} className="relative flex items-center gap-4">
                    <span className="relative z-10 grid h-11 w-[72px] shrink-0 place-items-center rounded-full bg-pine text-[12.5px] font-black text-white ring-4 ring-cream">{a.time}</span>
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-5 py-3.5 ring-1 ring-stone-200/75">
                      <span className="text-[14px] font-bold text-slate-800">{a.title}</span>
                      <span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-black text-slate-500">{a.dur}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          {/* rules + episodes */}
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-stone-200/80">
                <h3 className="flex items-center gap-2.5 text-[16px] font-black text-slate-900">
                  <ShieldCheck className="h-5 w-5 text-teal-700" /> قوانین اتاق
                </h3>
                <ul className="mt-4 space-y-3">
                  {RULES.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-[13px] font-medium leading-7 text-slate-600">
                      <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-teal-600" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-3xl bg-pine p-6 text-white">
                <h3 className="flex items-center gap-2.5 text-[16px] font-black">
                  <Radio className="h-5 w-5 text-amber-400" /> قسمت‌های قبلی
                </h3>
                <div className="mt-4 space-y-3">
                  {EPISODES.map((e) => (
                    <button
                      key={e.title}
                      onClick={() => go("community")}
                      className="group flex w-full items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-3 text-start ring-1 ring-white/12 transition-colors hover:bg-white/[0.12]"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-500 text-white transition-transform group-hover:scale-110">
                        <Play className="h-4 w-4 fill-white" />
                      </span>
                      <span>
                        <span className="block text-[13px] font-bold leading-6">{e.title}</span>
                        <span className="block text-[11px] font-semibold text-slate-400">{e.meta}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[12px] leading-6 text-slate-400">بازپخش همه قسمت‌ها در یوتیوب و صفحه انجمن سایت منتشر می‌شود.</p>
              </div>
            </Reveal>
          </div>

          {/* collaboration CTA */}
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-5 rounded-[28px] bg-gradient-to-l bg-teal-800 px-7 py-7 text-white md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500 text-pine">
                  <HeartHandshake className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-black">دوست دارید روی صحنه این اتاق باشید؟</h3>
                  <p className="mt-1 max-w-xl text-[13px] leading-7 text-teal-50/85">
                    سخنران مهمان، هم‌میزبان، مرکز همکار یا حامی؛ مسیر‌ساز هوشمند همکاری بر اساس تخصص و کشورتان، مسیر دقیق پیوستن را می‌سازد.
                  </p>
                </div>
              </div>
              <button onClick={() => go("collaborate")} className="flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-teal-900 transition-transform hover:scale-[1.03]">
                ساخت مسیر همکاری من <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>

        {/* side column */}
        <div className="space-y-6 lg:sticky lg:top-36 lg:self-start">
          {/* host panel */}
          <Reveal>
            <div className="rounded-3xl bg-white p-6 shadow-[0_16px_44px_-26px_rgba(29,42,39,0.35)] ring-1 ring-stone-200/80">
              <h3 className="flex items-center gap-2.5 text-[16px] font-black text-slate-900">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-500 text-white"><Link2 className="h-5 w-5" /></span>
                پنل میزبان · لینک اتاق
              </h3>
              <p className="mt-3 text-[12.5px] leading-7 text-slate-500">
                به‌محض شروع اتاق در کلاب‌هاوس، لینک آن را اینجا بچسبانید و ذخیره کنید؛ دکمه «ورود به اتاق» برای همه بازدیدکنندگان فعال می‌شود.
              </p>
              <label className="mt-4 block text-[12px] font-black text-slate-600">لینک اتاق این هفته (Clubhouse)</label>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                dir="ltr"
                placeholder="https://www.clubhouse.com/…"
                className="mt-1.5 w-full rounded-2xl bg-cream px-4 py-3 text-left text-[13px] font-medium text-slate-800 ring-1 ring-stone-200 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <div className="mt-3 flex gap-2">
                <button onClick={saveLink} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-700 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-teal-800">
                  <Save className="h-4 w-4" /> ذخیره و فعال‌سازی
                </button>
                {roomLink && (
                  <button onClick={removeLink} className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-bold text-rose-600 ring-1 ring-rose-200 transition-colors hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" /> حذف
                  </button>
                )}
              </div>
              <div className={`mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-[12px] font-bold ring-1 ${roomLink ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>
                <span className={`h-2 w-2 shrink-0 rounded-full ${roomLink ? "animate-pulse bg-emerald-500" : "bg-amber-500"}`} />
                {roomLink ? "لینک اتاق فعال است و بازدیدکنندگان می‌توانند وارد شوند." : "هنوز لینکی ثبت نشده است؛ دکمه ورود غیرفعال است."}
              </div>

              <div className="mt-5 border-t border-stone-100 pt-4">
                <p className="text-[12px] font-black text-slate-600">لینک کوتاه سایت برای اشتراک‌گذاری</p>
                <div className="mt-2 flex items-center gap-2">
                  <span dir="ltr" className="flex-1 truncate rounded-xl bg-cream px-3.5 py-2.5 text-left text-[13px] font-black text-teal-800 ring-1 ring-stone-200">{SITE_ROOM_LINK}</span>
                  <button
                    onClick={() => copyText(SITE_ROOM_LINK, "sitelink")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[12px] font-black text-white transition-colors ${copied === "sitelink" ? "bg-emerald-600" : "bg-pine hover:bg-pine-light"}`}
                  >
                    {copied === "sitelink" ? <><Check className="h-4 w-4" /> کپی شد</> : <><Copy className="h-4 w-4" /> کپی</>}
                  </button>
                </div>
                <p className="mt-2 text-[11.5px] leading-6 text-slate-400">همین لینک را در توضیحات اتاق، بیو اینستاگرام و کانال تلگرام قرار دهید.</p>
              </div>
            </div>
          </Reveal>

          {/* copy kit */}
          <Reveal delay={0.08}>
            <div className="rounded-3xl bg-pine p-6 text-white">
              <h3 className="flex items-center gap-2.5 text-[16px] font-black">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-amber-400"><Copy className="h-5 w-5" /></span>
                کیت آماده توضیحات اتاق
              </h3>
              <p className="mt-2.5 text-[12.5px] leading-7 text-slate-300">
                متن‌های زیر با لینک سایت به‌روزرسانی خودکار دارند؛ کپی کنید و در کلاب‌هاوس بچسبانید.
              </p>
              <div className="mt-4 space-y-3">
                {DESCRIPTIONS.map((d) => (
                  <div key={d.id} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/12">
                    <p className="text-[13px] font-black text-amber-300">{d.title}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{d.hint}</p>
                    <div className="no-scrollbar mt-3 max-h-36 overflow-y-auto rounded-xl bg-black/25 p-3.5">
                      <p className="whitespace-pre-line text-[11.5px] leading-6 text-slate-200">{d.text}</p>
                    </div>
                    <button
                      onClick={() => copyText(d.text, d.id)}
                      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[12.5px] font-black transition-all ${
                        copied === d.id ? "bg-emerald-500 text-white" : "bg-amber-500 text-pine hover:bg-amber-400"
                      }`}
                    >
                      {copied === d.id ? <><Check className="h-4 w-4" /> کپی شد؛ حالا در کلاب‌هاوس بچسبانید</> : <><Copy className="h-4 w-4" /> کپی این متن</>}
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-6 text-slate-400">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                نکته: متن دعوت به‌صورت خودکار با لینک اتاقی که در پنل میزبان ثبت کنید، ساخته می‌شود.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
