import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen, Bot, CalendarCheck, CalendarDays, ChevronDown, MapPin, Menu, Newspaper, Puzzle,
  Route, Users, X,
} from "lucide-react";
import { COUNTRIES } from "../data/site";
import type { GoFn } from "./ui";

interface DropItem {
  page: string;
  label: string;
  desc: string;
  icon: typeof MapPin;
}

const KNOWLEDGE_ITEMS: DropItem[] = [
  { page: "season", label: "نقشه ۱۰ جلسه فصل اول", desc: "موضوع، هدف، پادکست و ویدیوی هر جلسه", icon: CalendarDays },
  { page: "hub", label: "مرکز دانش اوتیسم", desc: "متدها، علائم و غربالگری تعاملی", icon: BookOpen },
  { page: "news", label: "تازه‌های پژوهش و اخبار", desc: "مقاله‌های روز با خلاصه ساده", icon: Newspaper },
  { page: "community", label: "انجمن و شبکه‌ها", desc: "یوتیوب، اینستاگرام، تلگرام، فیسبوک", icon: Users },
];

const TOOL_ITEMS: DropItem[] = [
  { page: "pathfinder", label: "مسیر‌یاب هوشمند", desc: "نقشه راه مهاجرت و کار در ۴ سؤال", icon: Route },
  { page: "ailab", label: "دستیار هوش مصنوعی", desc: "گفتگوی آموزشی در سایت و تلگرام", icon: Bot },
  { page: "familymap", label: "نقشه خانواده‌ها و مراکز", desc: "مراکز و خانواده‌های هم‌تجربه روی نقشه", icon: MapPin },
];

const MOBILE_LINKS: { page: string; label: string }[] = [
  { page: "hub", label: "مرکز دانش اوتیسم" },
  { page: "news", label: "تازه‌های پژوهش و اخبار" },
  { page: "ailab", label: "دستیار هوش مصنوعی" },
  { page: "familymap", label: "نقشه خانواده‌ها و مراکز" },
  { page: "pathfinder", label: "مسیر‌یاب هوشمند" },
  { page: "room", label: "اتاق کلاب‌هاوس" },
  { page: "season", label: "نقشه ۱۰ جلسه فصل اول" },
  { page: "community", label: "انجمن و شبکه‌ها" },
  { page: "collaborate", label: "همکاری با ما" },
  { page: "services", label: "خدمات و مشاوره" },
  { page: "about", label: "درباره ما" },
  { page: "contact", label: "تماس با ما" },
];

function NavDrop({
  label, active, open, setOpen, items, go,
}: {
  label: string;
  active: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  items: DropItem[];
  go: GoFn;
}) {
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className={`flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${
          active ? "text-teal-800" : "text-slate-600 hover:text-teal-800"
        }`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full w-[330px] pt-2"
          >
            <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-2 shadow-2xl shadow-slate-900/10">
              {items.map((it) => (
                <button
                  key={it.page}
                  onClick={() => { go(it.page); setOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors hover:bg-cream"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-700/10 text-teal-700">
                    <it.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-800">{it.label}</span>
                    <span className="block text-[12px] text-slate-500">{it.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar({ page, go }: { page: string; go: GoFn }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [dropC, setDropC] = useState(false);
  const [dropK, setDropK] = useState(false);
  const [dropT, setDropT] = useState(false);
  const [mobileCountries, setMobileCountries] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = (p: string) =>
    `relative rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${
      page === p ? "text-teal-800" : "text-slate-600 hover:text-teal-800"
    }`;

  const isKnowledge = ["hub", "news", "community"].includes(page);
  const isTools = ["pathfinder", "ailab", "familymap"].includes(page);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* announcement bar */}
      <div className="bg-pine text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[12.5px] font-medium">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="h-2 w-2 rounded-full bg-red-400" />
          </span>
          <span>اتاق هفتگی اوتیسم در کلاب‌هاوس — هر پنجشنبه ساعت ۲۱:۰۰ به وقت تهران</span>
          <button onClick={() => go("room")} className="shrink-0 font-bold text-amber-300 underline-offset-4 hover:underline">
            صفحه اتاق و لینک ورود
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          scrolled ? "bg-cream/90 shadow-[0_8px_30px_-18px_rgba(12,59,57,0.45)] backdrop-blur-xl" : "bg-cream/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 lg:px-6">
          {/* logo */}
          <button onClick={() => go("home")} className="flex items-center gap-3 text-start">
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/30">
              <Puzzle className="h-6 w-6" />
              <span className="absolute -bottom-1 -left-1 h-3.5 w-3.5 rounded-full border-2 border-cream bg-amber-500" />
            </span>
            <span className="leading-tight">
              <span className="block text-[17px] font-black text-slate-900">پل اوتیسم</span>
              <span className="block text-[10.5px] font-semibold tracking-[0.18em] text-teal-700">AUTISM BRIDGE</span>
            </span>
          </button>

          {/* desktop nav */}
          <nav className="hidden items-center gap-0.5 xl:flex">
            <button className={linkCls("home")} onClick={() => go("home")}>خانه</button>

            {/* countries dropdown */}
            <div className="relative" onMouseEnter={() => setDropC(true)} onMouseLeave={() => setDropC(false)}>
              <button
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${
                  page === "country" ? "text-teal-800" : "text-slate-600 hover:text-teal-800"
                }`}
              >
                راهنمای کشورها
                <ChevronDown className={`h-4 w-4 transition-transform ${dropC ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {dropC && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full w-[330px] pt-2"
                  >
                    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-2 shadow-2xl shadow-slate-900/10">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => { go("country", c.id); setDropC(false); }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors hover:bg-cream"
                        >
                          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[13px] font-black text-white ${c.accent}`}>
                            {c.code}
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-slate-800">{c.name}</span>
                            <span className="block text-[12px] text-slate-500">{c.cities}</span>
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={() => { go("pathfinder"); setDropC(false); }}
                        className="mt-1 w-full rounded-xl bg-teal-700/5 px-3 py-2.5 text-center text-[13px] font-bold text-teal-800 transition-colors hover:bg-teal-700/10"
                      >
                        نمی‌دانید کدام کشور؟ مسیر‌یاب هوشمند را امتحان کنید
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className={linkCls("room")} onClick={() => go("room")}>
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                </span>
                اتاق کلاب‌هاوس
              </span>
            </button>

            <NavDrop label="دانش و انجمن" active={isKnowledge} open={dropK} setOpen={setDropK} items={KNOWLEDGE_ITEMS} go={go} />
            <NavDrop label="ابزارهای هوشمند" active={isTools} open={dropT} setOpen={setDropT} items={TOOL_ITEMS} go={go} />

            <button className={linkCls("collaborate")} onClick={() => go("collaborate")}>همکاری با ما</button>
            <button className={linkCls("services")} onClick={() => go("services")}>خدمات و مشاوره</button>
            <button className={linkCls("about")} onClick={() => go("about")}>درباره ما</button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go("services")}
              className="hidden items-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-[13.5px] font-bold text-white shadow-lg shadow-teal-700/25 transition-all hover:bg-teal-800 hover:shadow-teal-800/30 sm:flex"
            >
              <CalendarCheck className="h-4 w-4" />
              رزرو مشاوره
            </button>
            <button
              onClick={() => setMobile(!mobile)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-stone-200 bg-white text-slate-700 xl:hidden"
              aria-label="منو"
            >
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden border-b border-stone-200 bg-cream/95 backdrop-blur-xl xl:hidden"
          >
            <div className="max-h-[70vh] space-y-1 overflow-y-auto px-4 py-4">
              <button onClick={() => { go("home"); setMobile(false); }} className="block w-full rounded-xl px-3 py-2.5 text-start text-sm font-bold text-slate-800 hover:bg-white">
                خانه
              </button>
              <button
                onClick={() => setMobileCountries(!mobileCountries)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-start text-sm font-bold text-slate-800 hover:bg-white"
              >
                راهنمای کشورها
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileCountries ? "rotate-180" : ""}`} />
              </button>
              {mobileCountries && (
                <div className="space-y-1 px-3">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { go("country", c.id); setMobile(false); }}
                      className="flex w-full items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 text-start text-sm font-semibold text-slate-700"
                    >
                      <span className={`grid h-8 w-8 place-items-center rounded-lg text-[11px] font-black text-white ${c.accent}`}>{c.code}</span>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
              {MOBILE_LINKS.map((l) => (
                <button
                  key={l.page}
                  onClick={() => { go(l.page); setMobile(false); }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-start text-sm font-bold text-slate-800 hover:bg-white"
                >
                  {l.page === "room" && <span className="h-2 w-2 rounded-full bg-red-500" />}
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => { go("services"); setMobile(false); }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white"
              >
                <CalendarCheck className="h-4 w-4" /> رزرو مشاوره تخصصی
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
