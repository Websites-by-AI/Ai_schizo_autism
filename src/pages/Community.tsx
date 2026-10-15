import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, BellRing, CalendarDays, CheckCircle2, Clock3, Download, Eye, Heart, Megaphone, MessageCircle,
  Mic, Play, Radio, Send, ThumbsUp, Users, Video,
} from "lucide-react";
import { IMG } from "../data/site";
import { Reveal, SectionHead, faNum, type GoFn } from "../components/ui";
import { FacebookIcon, InstagramIcon, TelegramIcon, YoutubeIcon } from "../components/icons";

const PLATFORMS = [
  { icon: YoutubeIcon, name: "یوتیوب", members: "۴۸ هزار", role: "آموزش عمیق و راهنمای قدم‌به‌قدم", color: "bg-red-600" },
  { icon: InstagramIcon, name: "اینستاگرام", members: "۱۱۲ هزار", role: "نکته‌های روزانه و لایو هفتگی", color: "bg-pink-600" },
  { icon: TelegramIcon, name: "تلگرام", members: "۲۳ هزار", role: "اخبار فوری، فایل‌ها و فرصت‌های شغلی", color: "bg-sky-600" },
  { icon: FacebookIcon, name: "فیسبوک", members: "۳۱ هزار", role: "شبکه حمایتی والدین مهاجر", color: "bg-blue-700" },
];

const PLAYLISTS = [
  {
    id: 1, title: "مسیر کار در آلمان؛ از زبان تا قرارداد", count: 14, views: "۲٫۱ میلیون",
    desc: "Anerkennung، آوسبیلدونگ و مصاحبه‌های واقعی با درمانگران ایرانی در برلین و مونیخ.",
    image: IMG.berlin, dur: "مجموعاً ۹ ساعت",
  },
  {
    id: 2, title: "متدهای مداخله زودهنگام در عمل", count: 22, views: "۳٫۴ میلیون",
    desc: "ABA، دنور، PECS و یکپارچگی حسی با نمایش جلسه واقعی و تحلیل سوپروایزر.",
    image: IMG.therapy1, dur: "مجموعاً ۱۲ ساعت",
  },
  {
    id: 3, title: "زندگی و کار در استانبول برای متخصصان", count: 9, views: "۸۷۰ هزار",
    desc: "ثبت شرکت، مجوز مرکز، هزینه‌های واقعی زندگی و تجربه خانواده‌های مهاجر.",
    image: IMG.istanbulFerry, dur: "مجموعاً ۵ ساعت",
  },
  {
    id: 4, title: "بازپخش اتاق‌های کلاب‌هاوس", count: 18, views: "۱٫۵ میلیون",
    desc: "پنل‌های تخصصی با مهمانانی از هر سه کشور؛ پرسش‌وپاسخ زنده با والدین و درمانگران.",
    image: IMG.classroom, dur: "مجموعاً ۳۰ ساعت",
  },
];

const INSTA_POSTS = [
  { image: IMG.popit, likes: "۱۲٫۴k", comments: 342, title: "۵ نشانه حسی که با «شیطنت» اشتباه گرفته می‌شود" },
  { image: IMG.hero, likes: "۱۸٫۱k", comments: 517, title: "PECS در ۶ فاز؛ اینفوگرافیک کامل" },
  { image: IMG.berlin, likes: "۹٫۸k", comments: 203, title: "یک روز از زندگی کاردرمانگر در برلین" },
  { image: IMG.sandplay, likes: "۱۵٫۲k", comments: 468, title: "اتاق حسی خانگی با وسایل ساده" },
  { image: IMG.istanbul, likes: "۷٫۶k", comments: 154, title: "استانبول از نگاه یک درمانگر مهاجر" },
  { image: IMG.paint, likes: "۲۱٫۳k", comments: 629, title: "بازی‌های انگشتی برای توجه مشترک" },
];

const TELEGRAM_MSGS = [
  { from: "تیم پل اوتیسم", time: "۰۹:۱۲", text: "فرصت شغلی جدید: مرکز اوتیسم در مونیخ برای کاردرمانگر با B2 نیرو می‌گیرد؛ رزومه Europass را تا جمعه ارسال کنید.", tag: "فرصت شغلی" },
  { from: "تیم پل اوتیسم", time: "۱۱:۴۰", text: "تغییر مهم: ایالت نوردراین-وستفالن از این ماه مدرک telc B2 را برای Anerkennung کاردرمانی می‌پذیرد. جزئیات در فایل پیوست.", tag: "خبر قانونی" },
  { from: "مریم — برلین", time: "۱۳:۰۵", text: "تجربه من از آزمون Kenntnisprüfung: سه ماه آمادگی با منابع کانال کافی بود. سؤالاتتان را زیر همین پست بپرسید.", tag: "تجربه اعضا" },
  { from: "تیم پل اوتیسم", time: "۱۸:۳۰", text: "فایل «چک‌لیست مدارک STS ترکیه» به‌روزرسانی شد؛ نسخه جدید را از سنجاق کانال دانلود کنید.", tag: "فایل راهنما" },
];

const FB_THREADS = [
  { author: "سارا م. — مادر، ساکن کلن", title: "مدرسه فراگیر (Inklusion) در آلمان چطور برای پسرم جا گرفت؟ مسیر کامل ما", replies: 148, likes: 320 },
  { author: "رضا ت. — پدر، ساکن استانبول", title: "مقایسه هزینه درمان ماهانه در استانبول و تهران؛ اعداد واقعی ۲۰۲۵", replies: 96, likes: 214 },
  { author: "نگار ع. — گفتاردرمانگر", title: "برای کودکی که در ۴ سالگی هنوز جمله نمی‌سازد، از کجا شروع می‌کنید؟ کیس‌استادی گروهی", replies: 211, likes: 402 },
];

const EVENTS = [
  { id: 1, platform: "کلاب‌هاوس", icon: Mic, title: "پنل «آینده ABA در اروپا؛ از کلینیک تا خانه»", when: "پنجشنبه ۲۷ آذر · ساعت ۲۱:۰۰ تهران", guests: "با حضور BCBA از برلین و تورنتو" },
  { id: 2, platform: "لایو اینستاگرام", icon: InstagramIcon, title: "پرسش‌وپاسخ زنده: معادلسازی مدرک در آلمان", when: "شنبه ۲۹ آذر · ساعت ۲۰:۳۰ تهران", guests: "مریم کریمی، کاردرمانگر برلین" },
  { id: 3, platform: "وبینار یوتیوب", icon: YoutubeIcon, title: "وبینار رایگان «تأسیس مرکز در استانبول؛ از ثبت شرکت تا اولین مراجع»", when: "سه‌شنبه ۲ دی · ساعت ۱۹:۰۰ تهران", guests: "دکتر امره کایا، مشاور حقوقی" },
];

export default function Community({ go }: { go: GoFn }) {
  const [playlist, setPlaylist] = useState(PLAYLISTS[0]);
  const [playing, setPlaying] = useState(false);
  const [reminded, setReminded] = useState<Set<number>>(new Set());
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  const toggleRemind = (id: number) =>
    setReminded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="انجمن و شبکه‌های اجتماعی"
        title="چهار کانال، یک خانواده بزرگ"
        desc="محتوای عمیق در یوتیوب، نکته‌های سریع در اینستاگرام، اخبار و فایل‌ها در تلگرام و گفت‌وگوی والدین در فیسبوک؛ همه مسیرها به همین سایت و خدماتش وصل‌اند."
      />

      {/* clubhouse room banner */}
      <Reveal className="mt-12">
        <div className="relative overflow-hidden rounded-[30px] bg-pine px-7 py-8 text-white md:px-10">
          <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-red-500/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-900/40">
                <Mic className="h-7 w-7" />
                <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-80" />
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-pine bg-amber-400" />
                </span>
              </span>
              <div>
                <p className="text-[12px] font-black text-red-300">اتاق زنده هفتگی · کلاب‌هاوس</p>
                <h3 className="mt-1 text-xl font-black leading-9 md:text-2xl">اتاق اوتیسم «پل اوتیسم»؛ هر پنجشنبه ساعت ۲۱:۰۰ تهران</h3>
                <p className="mt-1.5 max-w-2xl text-[13.5px] leading-7 text-teal-50/85">
                  موضوع این هفته: «اتاق حسی در خانه؛ نسخه کم‌هزینه برای والدین». لینک ورود، متن آماده توضیحات اتاق و مسیر سخنران‌شدن در صفحه اختصاصی اتاق است.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button onClick={() => go("room")} className="rounded-full bg-white px-6 py-3 text-sm font-black text-pine transition-transform hover:scale-[1.03]">
                ورود به صفحه اتاق
              </button>
              <button onClick={() => go("collaborate")} className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/35 transition-colors hover:bg-white/20">
                مسیر همکاری و سخنرانی
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* platform stat cards */}
      <div className="mt-12 grid gap-5 pb-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORMS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.07}>
            <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-stone-200/75">
              <div className="flex items-center justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ${p.color}`}>
                  <p.icon className="h-6 w-6" />
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> فعال
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-900">{p.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] font-bold text-teal-700">
                <Users className="h-4 w-4" /> {p.members} همراه
              </p>
              <p className="mt-2 text-[13px] leading-7 text-slate-600">{p.role}</p>
              <button
                onClick={() => setJoined((j) => ({ ...j, [p.name]: true }))}
                className={`mt-5 w-full rounded-full py-2.5 text-[13px] font-bold transition-all ${
                  joined[p.name] ? "bg-emerald-600 text-white" : "bg-cream text-slate-700 ring-1 ring-stone-300 hover:ring-teal-600/50"
                }`}
              >
                {joined[p.name] ? (
                  <span className="flex items-center justify-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> عضو شدید</span>
                ) : (
                  `عضویت در ${p.name}`
                )}
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ===== YouTube ===== */}
      <section className="py-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                <YoutubeIcon className="h-8 w-8" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-slate-900">یوتیوب؛ کلاس درس عمیق ما</h2>
                <p className="mt-1 text-[13.5px] text-slate-500">پلی‌لیست را انتخاب کنید و ویدیوی شاخص آن را ببینید — AutismBridgeTV@</p>
              </div>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-slate-600 ring-1 ring-stone-200">
              <Eye className="h-4 w-4 text-red-600" /> مجموع بازدید: ۷٫۹ میلیون
            </span>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* featured player */}
          <Reveal className="lg:col-span-3">
            <div className="overflow-hidden rounded-[26px] bg-pine shadow-xl">
              <div className="relative aspect-video">
                <img src={playlist.image} alt={playlist.title} className="absolute inset-0 h-full w-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-pine/30" />
                <AnimatePresence mode="wait">
                  {playing ? (
                    <motion.div
                      key="playing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 text-white backdrop-blur-[2px]"
                    >
                      <span className="flex items-end gap-1">
                        {[0, 1, 2, 3].map((b) => (
                          <motion.span
                            key={b}
                            className="w-1.5 rounded bg-amber-400"
                            animate={{ height: [10, 26, 14, 30, 12] }}
                            transition={{ duration: 1.1, repeat: Infinity, delay: b * 0.15 }}
                          />
                        ))}
                      </span>
                      <p className="mt-4 text-sm font-bold">پیش‌نمایش پلی‌لیست در حال پخش است…</p>
                      <p className="mt-1 text-[12px] text-slate-300">برای تماشای کامل در یوتیوب، دکمه زیر را بزنید</p>
                      <button onClick={() => setPlaying(false)} className="mt-5 rounded-full bg-white/15 px-5 py-2 text-[12.5px] font-bold ring-1 ring-white/40 hover:bg-white/25">
                        توقف پیش‌نمایش
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="poster"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setPlaying(true)}
                      className="group absolute inset-0 grid w-full place-items-center"
                      aria-label="پخش پیش‌نمایش"
                    >
                      <span className="grid h-20 w-20 place-items-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-900/50 transition-transform group-hover:scale-110">
                        <Play className="h-9 w-9 fill-white" />
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
                <span className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur">
                  {faNum(playlist.count)} ویدیو · {playlist.dur}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black text-white">{playlist.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-7 text-slate-300">{playlist.desc}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-red-500">
                    <YoutubeIcon className="h-4.5 w-4.5" /> تماشا در یوتیوب
                  </button>
                  <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-400">
                    <Eye className="h-4 w-4" /> {playlist.views} بازدید
                  </span>
                  <button onClick={() => go("services")} className="flex items-center gap-1.5 text-[12.5px] font-bold text-amber-300 hover:text-amber-200">
                    <Download className="h-4 w-4" /> دانلود چک‌لیست این مسیر از سایت
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* playlist list */}
          <div className="space-y-3 lg:col-span-2">
            {PLAYLISTS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <button
                  onClick={() => { setPlaylist(p); setPlaying(false); }}
                  className={`flex w-full items-center gap-4 rounded-3xl p-3.5 text-start ring-1 transition-all ${
                    playlist.id === p.id ? "bg-white shadow-lg ring-2 ring-red-600/60" : "bg-white/70 ring-stone-200/80 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <span className="relative shrink-0">
                    <img src={p.image} alt={p.title} className="h-[74px] w-[118px] rounded-2xl object-cover" />
                    <span className="absolute inset-0 grid place-items-center rounded-2xl bg-black/30">
                      <Play className="h-6 w-6 fill-white text-white" />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-black text-slate-800">{p.title}</span>
                    <span className="mt-1 block text-[12px] leading-5 text-slate-500">{p.desc}</span>
                    <span className="mt-1.5 flex items-center gap-3 text-[11.5px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5" /> {faNum(p.count)} ویدیو</span>
                      <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {p.dur}</span>
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <div className="rounded-3xl bg-red-700 p-5 text-white">
                <p className="flex items-center gap-2 text-[14px] font-black"><Radio className="h-5 w-5" /> چرا عضو کانال شوید؟</p>
                <p className="mt-2 text-[12.5px] leading-7 text-red-50/90">در توضیحات هر ویدیو، لینک دانلود چک‌لیست و راهنمای همان مسیر در سایت قرار دارد؛ ویدیو را ببینید، سندش را از اینجا بردارید.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Instagram + Telegram ===== */}
      <section className="grid gap-6 pb-14 lg:grid-cols-2">
        {/* Instagram */}
        <Reveal>
          <div className="h-full rounded-[26px] bg-white p-6 ring-1 ring-stone-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-600 text-white shadow-lg shadow-pink-600/25">
                  <InstagramIcon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">اینستاگرام</h3>
                  <p dir="ltr" className="text-end text-[12px] font-semibold text-slate-400">@autismbridge.ir</p>
                </div>
              </div>
              <span className="rounded-full bg-pink-50 px-3 py-1.5 text-[11.5px] font-black text-pink-700 ring-1 ring-pink-200">لایو سه‌شنبه‌ها ۲۱:۰۰</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {INSTA_POSTS.map((post) => (
                <div key={post.title} className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 flex flex-col justify-end bg-pine/0 p-3 opacity-0 transition-all duration-300 group-hover:bg-pine/70 group-hover:opacity-100">
                    <p className="text-[11px] font-bold leading-5 text-white">{post.title}</p>
                    <p className="mt-1.5 flex items-center gap-3 text-[11px] font-bold text-white/85">
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 fill-white" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {faNum(post.comments)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[13px] leading-7 text-slate-600">
              کروسل‌های «علائم بر اساس سن»، ریلزهای «یک روز در برلین و استانبول» و نکته‌های ۶۰ ثانیه‌ای درمان؛ لینک کامل هر موضوع در بایو به راهنمای سایت می‌رسد.
            </p>
          </div>
        </Reveal>

        {/* Telegram */}
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col rounded-[26px] bg-white p-6 ring-1 ring-stone-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/25">
                  <TelegramIcon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">کانال و گروه تلگرام</h3>
                  <p dir="ltr" className="text-end text-[12px] font-semibold text-slate-400">@AutismBridge</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-[11.5px] font-black text-sky-700 ring-1 ring-sky-200">
                <Megaphone className="h-3.5 w-3.5" /> به‌روزرسانی روزانه
              </span>
            </div>

            <div className="mt-5 flex-1 space-y-3 rounded-3xl bg-[#eef3f7] p-4">
              {TELEGRAM_MSGS.map((m) => (
                <div key={m.time} className="max-w-[92%] rounded-2xl rounded-tr-md bg-white px-4 py-3 shadow-sm">
                  <p className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-black text-sky-700">{m.from}</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">{m.tag}</span>
                  </p>
                  <p className="mt-1 text-[12.5px] leading-6.5 text-slate-700">{m.text}</p>
                  <p className="mt-1 text-left text-[10.5px] font-semibold text-slate-400">{m.time}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setJoined((j) => ({ ...j, telegram: true }))}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all ${
                joined.telegram ? "bg-emerald-600 text-white" : "bg-sky-600 text-white hover:bg-sky-500"
              }`}
            >
              {joined.telegram ? <><CheckCircle2 className="h-4.5 w-4.5" /> به کانال پیوستید</> : <><Send className="h-4.5 w-4.5" /> عضویت در کانال تلگرام</>}
            </button>
          </div>
        </Reveal>
      </section>

      {/* ===== Facebook + Events ===== */}
      <section className="grid gap-6 pb-20 lg:grid-cols-2">
        {/* Facebook */}
        <Reveal>
          <div className="h-full rounded-[26px] bg-white p-6 ring-1 ring-stone-200/80">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/25">
                <FacebookIcon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900">گروه فیسبوک والدین مهاجر</h3>
                <p className="text-[12px] font-semibold text-slate-400">Autism Bridge Global · گروه خصوصی با ۳۱ هزار عضو</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {FB_THREADS.map((t) => (
                <div key={t.title} className="rounded-2xl bg-cream px-5 py-4 ring-1 ring-stone-200/70 transition-colors hover:ring-blue-600/30">
                  <p className="text-[11.5px] font-bold text-blue-700">{t.author}</p>
                  <h4 className="mt-1 text-[13.5px] font-bold leading-7 text-slate-800">{t.title}</h4>
                  <p className="mt-2 flex items-center gap-4 text-[11.5px] font-bold text-slate-400">
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {faNum(t.replies)} پاسخ</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {faNum(t.likes)}</span>
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full rounded-full bg-blue-700 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600">
              درخواست عضویت در گروه
            </button>
          </div>
        </Reveal>

        {/* Events */}
        <Reveal delay={0.1}>
          <div className="h-full rounded-[26px] bg-pine p-6 text-white">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-amber-400">
                <CalendarDays className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-black">رویدادهای زنده پیش رو</h3>
                <p className="text-[12px] font-semibold text-slate-400">یادآوری را فعال کنید تا پیامک و ایمیل بگیرید</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {EVENTS.map((e) => {
                const active = reminded.has(e.id);
                return (
                  <div key={e.id} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/12">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30">
                          <e.icon className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="text-[11px] font-black text-teal-300">{e.platform}</span>
                          <h4 className="mt-0.5 text-[14px] font-bold leading-7">{e.title}</h4>
                          <p className="mt-1 text-[12px] font-semibold text-slate-400">{e.when}</p>
                          <p className="text-[12px] text-slate-400">{e.guests}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRemind(e.id)}
                      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[12.5px] font-black transition-all ${
                        active ? "bg-emerald-500 text-white" : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"
                      }`}
                    >
                      {active ? <><BellRing className="h-4 w-4" /> یادآوری فعال شد</> : <><Bell className="h-4 w-4" /> برایم یادآوری کن</>}
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 text-[12.5px] leading-7 text-slate-400">
              همه رویدادها رایگان‌اند و بازپخش آن‌ها ظرف ۴۸ ساعت در یوتیوب منتشر می‌شود.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
