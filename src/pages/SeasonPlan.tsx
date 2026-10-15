import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, CalendarDays, Check, CheckCircle2, ClipboardList, Copy, Crosshair, Download,
  FileText, Headphones, Megaphone, Mic, Scissors, Sparkles, Target, Users, Video,
} from "lucide-react";
import { CHANNEL_PLAN, CORE_SESSIONS, NEXT_SESSIONS, type Session } from "../data/season";
import { Reveal, SectionHead, faNum, type GoFn } from "../components/ui";
import { YoutubeIcon } from "../components/icons";

const TAG_STYLE: Record<string, string> = {
  "والدین": "bg-amber-500/15 text-amber-700 ring-amber-500/30",
  "درمانگران": "bg-teal-700/10 text-teal-800 ring-teal-700/20",
  "مهاجرت": "bg-sky-600/10 text-sky-700 ring-sky-600/25",
  "تأسیس مرکز": "bg-rose-600/10 text-rose-700 ring-rose-600/25",
};

const DAY_ICON: Record<string, typeof Mic> = {
  mic: Mic, scissors: Scissors, podcast: Headphones, video: Video, megaphone: Megaphone,
};

export default function SeasonPlan({ go }: { go: GoFn }) {
  const [active, setActive] = useState(1);
  const [tab, setTab] = useState<"plan" | "podcast" | "youtube">("plan");
  const [copied, setCopied] = useState<string | null>(null);

  const session: Session = CORE_SESSIONS.find((s) => s.no === active) ?? CORE_SESSIONS[0];

  const copy = async (text: string, id: string) => {
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

  const downloadPlan = () => {
    const lines: string[] = [
      "فصل اول اتاق «پل اوتیسم» — نقشه ۱۰ جلسه",
      "=".repeat(48),
      "",
      ...CORE_SESSIONS.flatMap((s) => [
        `جلسه ${s.no} — ${s.date}`,
        `موضوع: ${s.title}`,
        `هدف: ${s.goal}`,
        `مهمان: ${s.guest}`,
        `خروجی: ${s.asset}`,
        `پادکست: ${s.podcast.ep} — ${s.podcast.title} (${s.podcast.len})`,
        `یوتیوب: ${s.youtube.title} (${s.youtube.len})`,
        "-".repeat(40),
      ]),
      ...NEXT_SESSIONS.flatMap((s) => [
        `جلسه ${s.no} — ${s.date}`,
        `موضوع: ${s.title}`,
        `هدف: ${s.goal}`,
        `مهمان: ${s.guest}`,
        `خروجی: ${s.asset}`,
        `پادکست: ${s.podcast}`,
        `یوتیوب: ${s.youtube}`,
        "-".repeat(40),
      ]),
      "",
      "چرخه هفتگی انتشار:",
      ...CHANNEL_PLAN.map((c) => `${c.day}: ${c.act}`),
      "",
      "autismbridge.ir/room",
    ];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autismbridge-season-1-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="فصل اول اتاق · ۱۰ جلسه"
        title="نقشه کامل ده جلسه اول گفت‌وگو"
        desc="سه جلسه ابتدایی با جزئیات کامل (هدف، سرفصل دقیقه‌به‌دقیقه، مهمان و خروجی) و هفت جلسه بعدی به‌صورت تقویم؛ برای هر جلسه یک قسمت پادکست و یک ویدیوی یوتیوب با متن آماده انتشار."
      />

      {/* overview strip */}
      <Reveal className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Mic, v: "۱۰ جلسه", l: "هر پنجشنبه ۲۱:۰۰ تهران · ۹۰ دقیقه" },
            { icon: Headphones, v: "۱۰ قسمت", l: "پادکست؛ یکشنبه‌ها منتشر می‌شود" },
            { icon: YoutubeIcon, v: "۱۰ ویدیو + ۳۰ شورتز", l: "بازپخش کامل؛ سه‌شنبه‌ها" },
            { icon: FileText, v: "۱۰ فایل رایگان", l: "چک‌لیست و راهنمای هر جلسه در سایت" },
          ].map((s, i) => (
            <div key={s.l} className={`rounded-3xl p-6 ring-1 ${i === 0 ? "bg-pine text-white ring-white/10" : "bg-white ring-stone-200/75"}`}>
              <s.icon className={`h-7 w-7 ${i === 0 ? "text-amber-400" : "text-teal-700"}`} />
              <p className={`mt-3 text-lg font-black ${i === 0 ? "text-white" : "text-slate-900"}`}>{s.v}</p>
              <p className={`mt-1 text-[12px] leading-6 ${i === 0 ? "text-slate-300" : "text-slate-500"}`}>{s.l}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ===== core 3 sessions ===== */}
      <section className="py-14">
        <Reveal>
          <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-700 text-white"><Crosshair className="h-6 w-6" /></span>
            سه جلسه اول؛ با جزئیات کامل
          </h2>
          <p className="mt-2 text-[14px] leading-8 text-slate-600">این سه جلسه ستون فصل اول‌اند: اعتمادسازی، آموزش تشخیص و کمک به تصمیم درمانی. جلسه موردنظر را انتخاب کنید.</p>
        </Reveal>

        <Reveal className="mt-7">
          <div className="flex flex-wrap gap-3">
            {CORE_SESSIONS.map((s) => (
              <button
                key={s.no}
                onClick={() => { setActive(s.no); setTab("plan"); }}
                className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-start transition-all ${
                  active === s.no ? "bg-pine text-white shadow-xl" : "bg-white text-slate-700 ring-1 ring-stone-200 hover:ring-teal-600/40"
                }`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[14px] font-black ${active === s.no ? "bg-amber-500 text-pine" : "bg-cream text-teal-800"}`}>
                  {faNum(s.no)}
                </span>
                <span>
                  <span className="block max-w-[260px] truncate text-[13.5px] font-black">{s.title}</span>
                  <span className={`block text-[11.5px] font-semibold ${active === s.no ? "text-teal-200" : "text-slate-400"}`}>{s.date}</span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* tabs */}
        <Reveal className="mt-6">
          <div className="flex flex-wrap gap-2 rounded-full bg-white p-1.5 ring-1 ring-stone-200 sm:inline-flex">
            {[
              { id: "plan", label: "برنامه جلسه", icon: ClipboardList },
              { id: "podcast", label: "قسمت پادکست", icon: Headphones },
              { id: "youtube", label: "ویدیوی یوتیوب", icon: YoutubeIcon },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-black transition-all sm:flex-none ${
                  tab === t.id ? "bg-teal-700 text-white" : "text-slate-600 hover:text-teal-800"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${tab}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {/* ---- PLAN ---- */}
            {tab === "plan" && (
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="rounded-[28px] bg-pine p-7 text-white md:p-8">
                    <span className="rounded-full bg-amber-500 px-3.5 py-1.5 text-[11.5px] font-black text-pine">جلسه {faNum(session.no)} · {session.date}</span>
                    <h3 className="mt-4 text-2xl font-black leading-[1.45]">{session.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-7 text-teal-100">{session.subtitle}</p>
                    <div className="mt-5 rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/12">
                      <p className="flex items-center gap-2 text-[12px] font-black text-amber-300"><Target className="h-4 w-4" /> هدف اصلی جلسه</p>
                      <p className="mt-2 text-[13.5px] leading-8 text-slate-200">{session.goal}</p>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white/[0.07] px-4 py-3.5 ring-1 ring-white/12">
                        <p className="text-[11px] font-black text-teal-300">مخاطب هدف</p>
                        <p className="mt-1 text-[12.5px] font-semibold leading-6">{session.audience}</p>
                      </div>
                      <div className="rounded-2xl bg-white/[0.07] px-4 py-3.5 ring-1 ring-white/12">
                        <p className="text-[11px] font-black text-teal-300">مهمان‌ها</p>
                        <p className="mt-1 text-[12.5px] font-semibold leading-6">{session.guest}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80">
                    <h4 className="flex items-center gap-2.5 text-[16px] font-black text-slate-900">
                      <CalendarDays className="h-5 w-5 text-teal-700" /> سرفصل دقیقه‌به‌دقیقه
                    </h4>
                    <div className="relative mt-5 space-y-3 before:absolute before:bottom-3 before:right-[52px] before:top-3 before:w-px before:bg-stone-300/70">
                      {session.agenda.map((a) => (
                        <div key={a.t} className="relative flex items-center gap-4">
                          <span className="relative z-10 grid h-10 w-[72px] shrink-0 place-items-center rounded-full bg-pine text-[12px] font-black text-white ring-4 ring-white">{a.t}</span>
                          <p className="flex-1 rounded-2xl bg-cream px-5 py-3 text-[13px] font-semibold leading-7 text-slate-700 ring-1 ring-stone-200/70">{a.d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 lg:col-span-2">
                  <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80">
                    <h4 className="text-[15.5px] font-black text-slate-900">اهداف یادگیری جلسه</h4>
                    <ul className="mt-4 space-y-3">
                      {session.objectives.map((o) => (
                        <li key={o} className="flex items-start gap-2.5 text-[13px] font-semibold leading-7 text-slate-600">
                          <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-teal-600" /> {o}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80">
                    <h4 className="text-[15.5px] font-black text-slate-900">خروجی و هدیه جلسه</h4>
                    <p className="mt-3 rounded-2xl bg-teal-700/[0.06] px-4 py-3 text-[13px] leading-7 text-teal-900 ring-1 ring-teal-700/15">{session.takeaway}</p>
                    <p className="mt-3 flex items-start gap-2 text-[13px] font-bold leading-7 text-slate-700">
                      <FileText className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" /> {session.asset}
                    </p>
                  </div>

                  <div className="rounded-[28px] bg-teal-800 p-7 text-white">
                    <h4 className="text-[15.5px] font-black">شاخص موفقیت جلسه</h4>
                    <ul className="mt-4 space-y-2.5">
                      {session.kpi.map((k) => (
                        <li key={k} className="flex items-center gap-2.5 text-[13px] font-bold text-teal-50/90">
                          <Sparkles className="h-4 w-4 shrink-0 text-amber-400" /> {k}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => go("room")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3 text-[13px] font-black text-pine transition-colors hover:bg-amber-400">
                      <Mic className="h-4 w-4" /> رفتن به صفحه اتاق و لینک ورود
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---- PODCAST ---- */}
            {tab === "podcast" && (
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80 md:p-8">
                    <div className="flex items-center gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/25">
                        <Headphones className="h-7 w-7" />
                      </span>
                      <div>
                        <p className="text-[12px] font-black text-violet-700">پادکست پل اوتیسم · {session.podcast.ep}</p>
                        <h3 className="mt-0.5 text-xl font-black leading-8 text-slate-900">{session.podcast.title}</h3>
                        <p className="mt-0.5 text-[12px] font-bold text-slate-400">{session.podcast.len} · اسپاتیفای، کست‌باکس، شنوتو و تلگرام</p>
                      </div>
                    </div>

                    <p className="mt-5 rounded-2xl bg-violet-50 px-5 py-4 text-[13.5px] font-bold leading-8 text-violet-900 ring-1 ring-violet-200">
                      «{session.podcast.hook}»
                    </p>

                    <h4 className="mt-6 text-[14px] font-black text-slate-800">توضیحات آماده انتشار</h4>
                    <p className="mt-2 rounded-2xl bg-cream px-5 py-4 text-[13px] leading-8 text-slate-700 ring-1 ring-stone-200">{session.podcast.desc}</p>

                    <h4 className="mt-6 text-[14px] font-black text-slate-800">فصل‌بندی (Chapters)</h4>
                    <div className="mt-2 space-y-2">
                      {session.podcast.chapters.map((c) => (
                        <p key={c} dir="ltr" className="rounded-xl bg-cream px-4 py-2.5 text-right text-[12.5px] font-semibold text-slate-600 ring-1 ring-stone-200/70">{c}</p>
                      ))}
                    </div>

                    <button
                      onClick={() => copy(`${session.podcast.title}\n\n${session.podcast.desc}\n\n${session.podcast.chapters.join("\n")}\n\nautismbridge.ir/room`, "pod")}
                      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[13.5px] font-black transition-all ${copied === "pod" ? "bg-emerald-600 text-white" : "bg-violet-600 text-white hover:bg-violet-500"}`}
                    >
                      {copied === "pod" ? <><Check className="h-4.5 w-4.5" /> متن پادکست کپی شد</> : <><Copy className="h-4.5 w-4.5" /> کپی عنوان + توضیحات + فصل‌بندی</>}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="rounded-[28px] bg-pine p-7 text-white">
                    <h4 className="text-[15.5px] font-black">چطور از اتاق به پادکست برسیم؟</h4>
                    <ol className="mt-4 space-y-3.5">
                      {[
                        "ضبط اتاق با اعلام قبلی به شنوندگان (فایل خام ۹۰ دقیقه)",
                        "حذف بخش‌های اداری و تکراری؛ رسیدن به ۳۵ تا ۴۵ دقیقه",
                        "افزودن مقدمه ۴۰ ثانیه‌ای و تیزر پایانی جلسه بعد",
                        "نرمال‌سازی صدا و حذف نویز پس‌زمینه",
                        "انتشار یکشنبه ساعت ۱۰ صبح + اعلام در تلگرام و اینستاگرام",
                      ].map((s, i) => (
                        <li key={s} className="flex items-start gap-3 text-[13px] font-semibold leading-7 text-slate-200">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-500 text-[11px] font-black text-pine">{faNum(i + 1)}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-5 rounded-2xl bg-white/[0.07] px-4 py-3 text-[12px] leading-7 text-slate-300 ring-1 ring-white/12">
                      نکته: در هر قسمت فقط یک فراخوان بدهید — دانلود فایل رایگان همان جلسه از سایت. چند فراخوان همزمان، نرخ کلیک را نصف می‌کند.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ---- YOUTUBE ---- */}
            {tab === "youtube" && (
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80 md:p-8">
                    <div className="flex items-center gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/25">
                        <YoutubeIcon className="h-7 w-7" />
                      </span>
                      <div>
                        <p className="text-[12px] font-black text-red-600">یوتیوب · {session.youtube.type}</p>
                        <h3 className="mt-0.5 text-xl font-black leading-8 text-slate-900">{session.youtube.title}</h3>
                        <p className="mt-0.5 text-[12px] font-bold text-slate-400">{session.youtube.len} · انتشار سه‌شنبه‌ها</p>
                      </div>
                    </div>

                    <h4 className="mt-6 text-[14px] font-black text-slate-800">توضیحات آماده ویدیو (با تایم‌کد و لینک‌ها)</h4>
                    <div className="no-scrollbar mt-2 max-h-72 overflow-y-auto rounded-2xl bg-cream px-5 py-4 ring-1 ring-stone-200">
                      <p className="whitespace-pre-line text-[12.5px] leading-7.5 text-slate-700">{session.youtube.desc}</p>
                    </div>

                    <h4 className="mt-5 text-[14px] font-black text-slate-800">تگ‌ها</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {session.youtube.tags.map((t) => (
                        <span key={t} className="rounded-full bg-sand px-3 py-1.5 text-[11.5px] font-bold text-slate-600">{t}</span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => copy(`${session.youtube.title}\n\n${session.youtube.desc}\n\nTags: ${session.youtube.tags.join(", ")}`, "yt")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-[13.5px] font-black transition-all ${copied === "yt" ? "bg-emerald-600 text-white" : "bg-red-600 text-white hover:bg-red-500"}`}
                      >
                        {copied === "yt" ? <><Check className="h-4.5 w-4.5" /> متن یوتیوب کپی شد</> : <><Copy className="h-4.5 w-4.5" /> کپی عنوان + توضیحات + تگ‌ها</>}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 lg:col-span-2">
                  <div className="rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80">
                    <h4 className="flex items-center gap-2 text-[15.5px] font-black text-slate-900">
                      <Scissors className="h-5 w-5 text-teal-700" /> شورتز و برش‌های کوتاه
                    </h4>
                    <div className="mt-4 space-y-2.5">
                      {session.youtube.shorts.map((s, i) => (
                        <p key={s} className="flex items-start gap-2.5 rounded-2xl bg-cream px-4 py-3 text-[12.5px] font-semibold leading-6.5 text-slate-700 ring-1 ring-stone-200/70">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-red-600 text-[11px] font-black text-white">{faNum(i + 1)}</span>
                          {s}
                        </p>
                      ))}
                    </div>
                    <p className="mt-4 text-[11.5px] leading-6 text-slate-400">هر شورتز همزمان در یوتیوب، ریلز اینستاگرام و تلگرام منتشر می‌شود.</p>
                  </div>

                  <div className="rounded-[28px] bg-teal-800 p-7 text-white">
                    <h4 className="text-[15.5px] font-black">تامبنیل پیشنهادی</h4>
                    <p className="mt-2.5 text-[13px] leading-7 text-teal-50/90">{session.youtube.thumb}</p>
                    <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-[12px] leading-7 text-slate-200 ring-1 ring-white/15">
                      قانون ثابت تامبنیل‌ها: حداکثر ۴ کلمه فارسی، چهره یا دست انسان، و رنگ سبز-کرم برند برای شناخته‌شدن در فید.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ===== sessions 4-10 ===== */}
      <section className="pb-14">
        <Reveal>
          <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500 text-white"><CalendarDays className="h-6 w-6" /></span>
            جلسات ۴ تا ۱۰ فصل اول
          </h2>
          <p className="mt-2 text-[14px] leading-8 text-slate-600">هر جلسه یک موضوع، یک خروجی قابل دانلود، یک قسمت پادکست و یک ویدیوی یوتیوب دارد.</p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {NEXT_SESSIONS.map((s, i) => (
            <Reveal key={s.no} delay={(i % 3) * 0.07}>
              <article className="flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-stone-200/80 transition-all hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(12,59,57,0.35)]">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pine text-[15px] font-black text-white">{faNum(s.no)}</span>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black ring-1 ${TAG_STYLE[s.tag]}`}>{s.tag}</span>
                </div>
                <p className="mt-4 text-[11.5px] font-black text-teal-700">{s.date} · ۲۱:۰۰ تهران</p>
                <h3 className="mt-1 text-[15.5px] font-black leading-7.5 text-slate-900">{s.title}</h3>
                <p className="mt-2.5 flex items-start gap-2 text-[12.5px] leading-7 text-slate-600">
                  <Target className="mt-1 h-4 w-4 shrink-0 text-amber-600" /> {s.goal}
                </p>
                <p className="mt-2 flex items-start gap-2 text-[12px] leading-6.5 text-slate-500">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" /> {s.guest}
                </p>
                <div className="mt-4 flex-1 space-y-2 border-t border-dashed border-stone-200 pt-4">
                  <p className="flex items-start gap-2 text-[12px] font-semibold leading-6.5 text-slate-600">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> {s.asset}
                  </p>
                  <p className="flex items-start gap-2 text-[12px] font-semibold leading-6.5 text-slate-600">
                    <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" /> {s.podcast}
                  </p>
                  <p className="flex items-start gap-2 text-[12px] font-semibold leading-6.5 text-slate-600">
                    <YoutubeIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-600" /> {s.youtube}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== weekly cycle ===== */}
      <section className="pb-14">
        <Reveal>
          <div className="rounded-[28px] bg-pine p-7 text-white md:p-9">
            <h2 className="flex items-center gap-3 text-xl font-black">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-amber-400"><Megaphone className="h-6 w-6" /></span>
              چرخه هفتگی انتشار محتوا
            </h2>
            <p className="mt-2 text-[13.5px] leading-7 text-slate-300">یک اتاق زنده، پنج خروجی محتوایی؛ این ریتم ثابت باعث می‌شود هر هفته مخاطب تازه وارد سایت شود.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {CHANNEL_PLAN.map((c, i) => {
                const Icon = DAY_ICON[c.icon] ?? Mic;
                return (
                  <div key={c.day} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/12">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-pine">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-[12.5px] font-black text-amber-300">{faNum(i + 1)} · {c.day}</p>
                    <p className="mt-1 text-[12.5px] font-semibold leading-6.5 text-slate-200">{c.act}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== CTA ===== */}
      <Reveal className="pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-teal-800 px-8 py-8 text-white md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-black">این نقشه را بردارید و فصل اول را شروع کنید</h3>
            <p className="mt-1.5 max-w-2xl text-[13.5px] leading-7 text-teal-50/85">
              کل برنامه ۱۰ جلسه با اهداف، مهمان‌ها، پادکست‌ها و ویدیوها را در یک فایل دانلود کنید؛ یا اگر می‌خواهید مهمان یکی از این جلسات باشید، از مسیر همکاری درخواست بدهید.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button onClick={downloadPlan} className="flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-teal-900 transition-transform hover:scale-[1.03]">
              <Download className="h-4.5 w-4.5" /> دانلود نقشه ۱۰ جلسه
            </button>
            <button onClick={() => go("collaborate")} className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-sm font-black text-pine transition-colors hover:bg-amber-400">
              سخنران مهمان شوید <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
