import { ArrowLeft, Bot, Puzzle } from "lucide-react";
import { FacebookIcon, InstagramIcon, TelegramIcon, YoutubeIcon } from "./icons";
import { COUNTRIES } from "../data/site";
import type { GoFn } from "./ui";
import { useIntegrations } from "./IntegrationsProvider";

export default function Footer({ go }: { go: GoFn }) {
  const { status } = useIntegrations();
  return (
    <footer className="bg-pine text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 lg:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white"><Puzzle className="h-6 w-6" /><span className="absolute -bottom-1 -left-1 h-3.5 w-3.5 rounded-full border-2 border-pine bg-amber-500" /></span>
              <span className="leading-tight"><span className="block text-[17px] font-black text-white">پل اوتیسم</span><span className="block text-[10.5px] font-semibold tracking-[0.18em] text-teal-300">AUTISM BRIDGE</span></span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-8 text-slate-400">منابع آموزشی برای افراد اوتیستیک، خانواده‌ها و متخصصان؛ از درک تفاوت‌ها و حمایت روزمره تا آشنایی با مسیرهای کار در ایران، آلمان و ترکیه.</p>
            <div className="mt-6 flex items-center gap-2.5">{[{ icon: YoutubeIcon, label: "یوتیوب" }, { icon: InstagramIcon, label: "اینستاگرام" }, { icon: TelegramIcon, label: "تلگرام" }, { icon: FacebookIcon, label: "فیسبوک" }].map(s => (
              <button key={s.label} onClick={() => go(s.label === "تلگرام" ? "ailab" : "community")} aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-xl bg-white/8 text-slate-200 ring-1 ring-white/10 transition-all hover:bg-teal-600 hover:text-white"><s.icon className="h-[18px] w-[18px]" /></button>
            ))}</div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-sm font-black text-white">دسترسی سریع</h2>
            <ul className="mt-4 space-y-2.5 text-[13px]">{[
              { p: "hub", t: "مرکز دانش اوتیسم" }, { p: "ailab", t: "دستیار هوش مصنوعی" },
              { p: "pathfinder", t: "مسیر‌یاب" }, { p: "room", t: "اتاق کلاب‌هاوس" },
              { p: "season", t: "نقشه فصل اول" }, { p: "news", t: "تازه‌های پژوهش" },
              { p: "familymap", t: "نقشه خانواده‌ها و مراکز" }, { p: "collaborate", t: "همکاری با ما" },
              { p: "services", t: "خدمات و مشاوره" }, { p: "about", t: "درباره ما" }, { p: "contact", t: "تماس با مدیر" },
            ].map(link => <li key={link.p}><button onClick={() => go(link.p)} className="text-slate-400 transition-colors hover:text-amber-300">{link.t}</button></li>)}</ul>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-sm font-black text-white">راهنمای کشورها</h2>
            <ul className="mt-4 space-y-3 text-[13px]">{COUNTRIES.map(country => <li key={country.id}><button onClick={() => go("country", country.id)} className="text-slate-400 transition-colors hover:text-amber-300">کار و خدمات در {country.name}</button></li>)}</ul>
            <p className="mt-5 text-xs leading-7 text-slate-500">اطلاعات مسیرها را پیش از اقدام با مراجع رسمی بررسی کنید. این سایت مشاوره حقوقی یا مهاجرتی شخصی ارائه نمی‌کند.</p>
          </div>
          <div className="lg:col-span-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-300/10 text-teal-300"><Bot className="h-5 w-5" /></span>
            <h2 className="mt-4 text-sm font-black text-white">یک همراه، دو راه گفتگو</h2>
            <p className="mt-3 text-xs leading-8 text-slate-400">دستیار آموزشی متصل به Hugging Face را در سایت یا تلگرام پیدا کنید. سابقه این دو فضا جداست؛ هیچ امتیاز تشخیص یا پیش‌بینی رشدی تولید نمی‌شود.</p>
            <button onClick={() => go("ailab")} className="mt-5 flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-xs font-black text-pine hover:bg-amber-300">شروع گفتگو<ArrowLeft className="h-4 w-4" /></button>
            {status?.telegram.url && <a href={status.telegram.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-sky-300"><TelegramIcon className="h-4 w-4" />باز کردن ربات تلگرام</a>}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row">
          <p>پل اوتیسم · AutismBridge</p><p className="max-w-xl text-center leading-7 md:text-end">محتوای این سایت آموزشی است و جایگزین تشخیص یا درمان پزشکی نیست؛ برای راهنمایی متناسب با شرایط خود به متخصص مراجعه کنید.</p>
        </div>
      </div>
    </footer>
  );
}
