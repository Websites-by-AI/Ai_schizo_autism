import { useState } from "react";
import { CheckCircle2, Mail, MapPin, Puzzle } from "lucide-react";
import { FacebookIcon, InstagramIcon, TelegramIcon, YoutubeIcon } from "./icons";
import { COUNTRIES } from "../data/site";
import type { GoFn } from "./ui";

export default function Footer({ go }: { go: GoFn }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="bg-pine text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 lg:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                <Puzzle className="h-6 w-6" />
                <span className="absolute -bottom-1 -left-1 h-3.5 w-3.5 rounded-full border-2 border-pine bg-amber-500" />
              </span>
              <span className="leading-tight">
                <span className="block text-[17px] font-black text-white">پل اوتیسم</span>
                <span className="block text-[10.5px] font-semibold tracking-[0.18em] text-teal-300">AUTISM BRIDGE</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-8 text-slate-400">
              شبکه بین‌المللی متخصصان، درمانگران و خانواده‌های حوزه اوتیسم در ایران، آلمان و ترکیه؛ از مداخله زودهنگام تا مهاجرت کاری و تأسیس مرکز.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {[
                { icon: YoutubeIcon, label: "یوتیوب" },
                { icon: InstagramIcon, label: "اینستاگرام" },
                { icon: TelegramIcon, label: "تلگرام" },
                { icon: FacebookIcon, label: "فیسبوک" },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => go("community")}
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/8 text-slate-200 ring-1 ring-white/10 transition-all hover:bg-teal-600 hover:text-white"
                >
                  <s.icon className="h-[18px] w-[18px]" />
                </button>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-black text-white">دسترسی سریع</h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              {[
                { p: "hub", t: "مرکز دانش اوتیسم" },
                { p: "pathfinder", t: "مسیر‌یاب هوشمند" },
                { p: "room", t: "اتاق هفتگی کلاب‌هاوس" },
                { p: "season", t: "نقشه ۱۰ جلسه فصل اول" },
                { p: "ailab", t: "آزمایشگاه هوش مصنوعی" },
                { p: "news", t: "تازه‌های پژوهش و اخبار" },
                { p: "familymap", t: "نقشه خانواده‌ها و مراکز" },
                { p: "collaborate", t: "مسیر همکاری با ما" },
                { p: "community", t: "انجمن و شبکه‌ها" },
                { p: "services", t: "خدمات و مشاوره" },
                { p: "about", t: "درباره ما" },
                { p: "contact", t: "تماس با ما" },
              ].map((l) => (
                <li key={l.p}>
                  <button onClick={() => go(l.p)} className="text-slate-400 transition-colors hover:text-amber-300">{l.t}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* countries */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black text-white">راهنمای کشورها</h4>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              {COUNTRIES.map((c) => (
                <li key={c.id}>
                  <button onClick={() => go("country", c.id)} className="text-slate-400 transition-colors hover:text-amber-300">
                    کار و تأسیس مرکز در {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => go("hub")} className="text-slate-400 transition-colors hover:text-amber-300">
                  متدهای درمانی (ABA، دنور، TEACCH…)
                </button>
              </li>
              <li>
                <button onClick={() => go("hub")} className="text-slate-400 transition-colors hover:text-amber-300">
                  علائم اوتیسم بر اساس سن + غربالگری تعاملی
                </button>
              </li>
            </ul>
          </div>

          {/* newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black text-white">خبرنامه مسیر‌یاب</h4>
            <p className="mt-4 text-[13.5px] leading-7 text-slate-400">
              هر دو هفته: فرصت‌های شغلی جدید، تغییرات قوانین معادلسازی و خلاصه اتاق‌های کلاب‌هاوس.
            </p>
            {done ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-teal-500/15 px-4 py-3 text-sm font-bold text-teal-200 ring-1 ring-teal-400/30">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                عضویت شما ثبت شد؛ به خانواده پل اوتیسم خوش آمدید.
              </div>
            ) : (
              <form
                className="mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setDone(true);
                }}
              >
                <div className="flex overflow-hidden rounded-2xl bg-white/8 ring-1 ring-white/15 focus-within:ring-amber-400/60">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="ایمیل شما"
                    className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button className="shrink-0 bg-amber-500 px-4 text-sm font-black text-pine transition-colors hover:bg-amber-400">
                    عضویت
                  </button>
                </div>
              </form>
            )}
            <div className="mt-5 space-y-2 text-[13px] text-slate-400">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-teal-300" /> hello@autismbridge.ir</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-300" /> تهران · برلین · استانبول (دفاتر همکار)</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12.5px] text-slate-500 md:flex-row">
          <p>© ۱۴۰۴ پل اوتیسم (AutismBridge) — تمامی حقوق محتوای آموزشی محفوظ است.</p>
          <p className="max-w-xl text-center md:text-end">
            محتوای این سایت آموزشی است و جایگزین تشخیص یا درمان پزشکی نیست؛ برای ارزیابی کودک حتماً به متخصص مراجعه کنید.
          </p>
        </div>
      </div>
    </footer>
  );
}
