import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Bookmark, BookmarkCheck, BookOpen, ChevronDown, FileText, FlaskConical,
  GraduationCap, Landmark, Lightbulb, MessagesSquare, Newspaper, Search,
} from "lucide-react";
import { PAPERS } from "../data/site";
import { Reveal, SectionHead, type GoFn } from "../components/ui";

const KIND_FILTERS = ["همه", "پژوهش", "خبر"] as const;
const COUNTRY_FILTERS = ["همه کشورها", "بین‌المللی", "ایران", "آلمان", "ترکیه"];

export default function NewsRoom({ go }: { go: GoFn }) {
  const [kind, setKind] = useState<string>("همه");
  const [country, setCountry] = useState("همه کشورها");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"expert" | "simple">("simple");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const featured = PAPERS[0];
  const list = PAPERS.slice(1).filter(
    (p) =>
      (kind === "همه" || p.kind === kind) &&
      (country === "همه کشورها" || p.country === country) &&
      (p.title.includes(search) || p.tags.some((t) => t.includes(search)))
  );

  const toggleSave = (id: number) =>
    setSaved((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="تازه‌های پژوهش و اخبار"
        title="علم اوتیسم، به زبان ساده و به‌روز"
        desc="جدیدترین مقاله‌های آکادمیک و خبرهای قانونی سه کشور؛ هر مطلب دو خلاصه دارد: نسخه تخصصی برای درمانگران و نسخه ساده و کاربردی برای خانواده‌ها."
      />

      {/* featured paper */}
      <Reveal className="mt-12">
        <div className="overflow-hidden rounded-[28px] bg-pine text-white shadow-2xl">
          <div className="grid lg:grid-cols-5">
            <div className="p-7 md:p-9 lg:col-span-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-[11.5px] font-black text-pine">
                  <FlaskConical className="h-4 w-4" /> مقاله منتخب هفته
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-bold ring-1 ring-white/15">{featured.source}</span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-bold ring-1 ring-white/15">{featured.date}</span>
              </div>
              <h2 className="mt-5 text-2xl font-black leading-[1.5] md:text-[28px]">{featured.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {featured.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/[0.07] px-3 py-1 text-[11.5px] font-bold text-teal-200 ring-1 ring-white/12">{t}</span>
                ))}
              </div>

              <div className="mt-6 flex rounded-full bg-white/10 p-1 ring-1 ring-white/15">
                <button
                  onClick={() => setMode("simple")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-black transition-all ${mode === "simple" ? "bg-amber-500 text-pine" : "text-slate-200 hover:text-white"}`}
                >
                  <Lightbulb className="h-4 w-4" /> خلاصه ساده برای والدین
                </button>
                <button
                  onClick={() => setMode("expert")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-black transition-all ${mode === "expert" ? "bg-amber-500 text-pine" : "text-slate-200 hover:text-white"}`}
                >
                  <GraduationCap className="h-4 w-4" /> خلاصه تخصصی
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 min-h-[96px] text-[14px] leading-8.5 text-teal-50/90"
                >
                  {mode === "simple" ? featured.simple : featured.expert}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex flex-col justify-center gap-3.5 bg-white/[0.04] p-7 ring-white/10 md:p-9 lg:col-span-2 lg:ring-r">
              <h3 className="text-[15px] font-black text-amber-300">با این مقاله چه کار کنیم؟</h3>
              {[
                { t: "در اتاق پنجشنبه درباره‌اش حرف می‌زنیم", a: "ورود به صفحه اتاق", fn: () => go("room") },
                { t: "پرسش‌های آموزشی خود را از دستیار بپرسید", a: "دستیار هوش مصنوعی", fn: () => go("ailab") },
                { t: "مقاله را برای بعد ذخیره کنید", a: saved.has(1) ? "ذخیره شد" : "ذخیره مقاله", fn: () => toggleSave(1) },
              ].map((x) => (
                <button key={x.t} onClick={x.fn} className="group rounded-2xl bg-white/[0.06] px-5 py-4 text-start ring-1 ring-white/12 transition-colors hover:bg-white/[0.12]">
                  <span className="block text-[13px] font-bold leading-6 text-slate-200">{x.t}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-[12.5px] font-black text-amber-300">
                    {x.a} <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  </span>
                </button>
              ))}
              <p className="text-[11.5px] leading-6 text-slate-400">مقاله منتخب هر دوشنبه با رأی تیم علمی و بر اساس پرسش‌های انجمن انتخاب می‌شود.</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* filters */}
      <Reveal className="mt-12">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex flex-1 items-center gap-2.5 rounded-full bg-white px-5 py-3.5 ring-1 ring-stone-200 focus-within:ring-teal-600/50">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در مقالات؛ مثلاً «خواب»، «PECS»، «Anerkennung»…"
              className="w-full bg-transparent text-sm font-medium placeholder:text-slate-400 focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {KIND_FILTERS.map((k) => (
              <button key={k} onClick={() => setKind(k)} className={`rounded-full px-4 py-2.5 text-[12.5px] font-bold transition-all ${kind === k ? "bg-teal-700 text-white" : "bg-white text-slate-600 ring-1 ring-stone-200 hover:ring-teal-600/40"}`}>
                {k === "پژوهش" ? "مقالات پژوهشی" : k === "خبر" ? "اخبار و قوانین" : "همه مطالب"}
              </button>
            ))}
            <span className="mx-1 hidden h-6 w-px bg-stone-300 lg:block" />
            {COUNTRY_FILTERS.map((c) => (
              <button key={c} onClick={() => setCountry(c)} className={`rounded-full px-4 py-2.5 text-[12.5px] font-bold transition-all ${country === c ? "bg-pine text-white" : "bg-white text-slate-600 ring-1 ring-stone-200 hover:ring-teal-600/40"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* list */}
      {list.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-stone-200">
          <Newspaper className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-bold text-slate-600">مطلبی با این فیلترها پیدا نشد.</p>
          <button onClick={() => { setKind("همه"); setCountry("همه کشورها"); setSearch(""); }} className="mt-3 text-[13px] font-black text-teal-700">
            حذف همه فیلترها
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 pb-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => {
            const isOpen = expanded === p.id;
            const isSaved = saved.has(p.id);
            return (
              <Reveal key={p.id} delay={(i % 3) * 0.07}>
                <article className={`flex h-full flex-col rounded-3xl bg-white p-6 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(12,59,57,0.35)] ${isOpen ? "shadow-lg ring-teal-600/40" : "ring-stone-200/80"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black ring-1 ${p.kind === "پژوهش" ? "bg-teal-700/10 text-teal-800 ring-teal-700/20" : "bg-amber-500/15 text-amber-700 ring-amber-500/30"}`}>
                      {p.kind === "پژوهش" ? <FileText className="h-3.5 w-3.5" /> : <Landmark className="h-3.5 w-3.5" />}
                      {p.kind === "پژوهش" ? "مقاله پژوهشی" : "خبر"}
                    </span>
                    <button
                      onClick={() => toggleSave(p.id)}
                      aria-label="ذخیره مقاله"
                      className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${isSaved ? "bg-teal-700 text-white" : "bg-cream text-slate-400 ring-1 ring-stone-200 hover:text-teal-700"}`}
                    >
                      {isSaved ? <BookmarkCheck className="h-4.5 w-4.5" /> : <Bookmark className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                  <h3 className="mt-4 text-[15px] font-black leading-7.5 text-slate-900">{p.title}</h3>
                  <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] font-bold text-slate-400">
                    <span>{p.source}</span>
                    <span>{p.date} · مطالعه {p.read}</span>
                    <span className="text-teal-700">{p.country}</span>
                  </p>
                  <p className="mt-3 line-clamp-3 flex-1 text-[13px] leading-7.5 text-slate-600">{p.simple}</p>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 border-t border-dashed border-stone-200 pt-4">
                          <div>
                            <p className="text-[11.5px] font-black text-teal-700">خلاصه تخصصی</p>
                            <p className="mt-1 text-[12.5px] leading-7 text-slate-600">{p.expert}</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {p.tags.map((t) => (
                              <span key={t} className="rounded-full bg-sand px-2.5 py-1 text-[10.5px] font-bold text-slate-500">{t}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4">
                    <button
                      onClick={() => setExpanded(isOpen ? null : p.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-cream py-2.5 text-[12.5px] font-black text-teal-800 ring-1 ring-stone-200 transition-colors hover:ring-teal-600/40"
                    >
                      <BookOpen className="h-4 w-4" />
                      {isOpen ? "بستن خلاصه تخصصی" : "خواندن خلاصه تخصصی"}
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <button
                      onClick={() => go("room")}
                      className="flex items-center gap-1.5 rounded-full bg-pine px-4 py-2.5 text-[12.5px] font-black text-white transition-colors hover:bg-pine-light"
                    >
                      <MessagesSquare className="h-4 w-4" /> بحث در اتاق
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* bottom strip */}
      <Reveal className="pb-20 pt-8">
        <div className="flex flex-col items-center justify-between gap-5 rounded-[28px] bg-sand/70 px-8 py-8 ring-1 ring-stone-200 md:flex-row">
          <div>
            <h3 className="text-lg font-black text-slate-900">مقاله‌ای خوانده‌اید که باید همه ببینند؟</h3>
            <p className="mt-1 text-[13.5px] text-slate-600">لینکش را در اتاق کلاب‌هاوس یا فرم همکاری بفرستید؛ تیم علمی پس از بررسی، خلاصه ساده‌اش را منتشر می‌کند.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button onClick={() => go("room")} className="rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white hover:bg-teal-800">
              پیشنهاد در اتاق هفتگی
            </button>
            <button onClick={() => go("collaborate")} className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-700 ring-1 ring-stone-300 hover:ring-teal-600/50">
              همکاری پژوهشی
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
