import { ArrowLeft, Compass, Globe2, GraduationCap, HeartHandshake, Lightbulb, ShieldCheck, Users } from "lucide-react";
import { IMG, TEAM } from "../data/site";
import { Reveal, SectionHead, type GoFn } from "../components/ui";

const TIMELINE = [
  { year: "۱۳۹۸", title: "شروع از یک اتاق کلاب‌هاوس", desc: "گفت‌وگوهای هفتگی چند درمانگر ایرانی و مهاجر درباره متدهای روز، به انجمنی چند هزار نفره تبدیل شد." },
  { year: "۱۴۰۰", title: "اولین راهنمای فارسی Anerkennung", desc: "چک‌لیست قدم‌به‌قدم معادلسازی مدرک برای کاردرمانگران و گفتاردرمانگران منتشر و بیش از ۳۰ هزار بار دانلود شد." },
  { year: "۱۴۰۲", title: "همکاری رسمی با مراکز هر سه کشور", desc: "شبکه همکار پل اوتیسم در برلین، مونیخ، استانبول و تهران شکل گرفت تا مسیر‌یاب از «اطلاعات» به «همراهی واقعی» برسد." },
  { year: "۱۴۰۴", title: "راه‌اندازی پلتفرم یکپارچه", desc: "سایت، مرکز دانش، مسیر‌یاب هوشمند و خدمات مشاوره در یک بستر واحد کنار هم قرار گرفتند." },
];

const VALUES = [
  { icon: ShieldCheck, title: "صداقت قبل از فروش", desc: "اگر مسیری برای شما مناسب نیست، همان را می‌گوییم؛ حتی اگر یعنی خدمت ما را نخرید. هیچ «تضمین ویزا»ی دروغینی در کار نیست." },
  { icon: GraduationCap, title: "علم، نه شایعه", desc: "همه راهنماها بر اساس منابع رسمی (ZAB، YÖK، بهزیستی) و بازبینی فصلی تیم علمی منتشر می‌شوند." },
  { icon: HeartHandshake, title: "خانواده در مرکز", desc: "پشت هر پرونده مهاجرت یا تأسیس مرکز، کودکی هست که زودتر به خدمت درست برسد؛ این را فراموش نمی‌کنیم." },
  { icon: Globe2, title: "پل، نه دیوار", desc: "دانش و تجربه باید بین کشورها جریان داشته باشد؛ درمانگر تهرانی از برلین می‌آموزد و بالعکس." },
];

export default function About({ go }: { go: GoFn }) {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-700/10 px-4 py-2 text-[13px] font-bold text-teal-800">
              <Compass className="h-4 w-4" /> درباره پل اوتیسم
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.3] text-slate-900 md:text-5xl md:leading-[1.25]">
              پلی میان استعدادهای ایران و <span className="text-teal-700"> بهترین تجربه‌های جهان</span>
            </h1>
            <p className="mt-5 text-base leading-9 text-slate-600">
              پل اوتیسم (AutismBridge) از دل یک مشاهده ساده به دنیا آمد: متخصص ایرانی برای کار در آلمان ماه‌ها در تاریکی اطلاعات ضدونقیض سرگردان بود، خانواده مهاجر در استانبول مرکز مطمئن پیدا نمی‌کرد و مرکز تازه‌تأسیس در مشهد استاندارد اتاق حس را نمی‌شناخت. ما این سه نقطه را به هم وصل کردیم.
            </p>
            <p className="mt-3 text-base leading-9 text-slate-600">
              امروز پل اوتیسم شبکه‌ای از درمانگران، روانشناسان، مشاوران حقوقی و والدین باتجربه در ایران، آلمان و ترکیه است که دانش را به زبان ساده و مسیر را قدم‌به‌قدم منتقل می‌کند.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => go("pathfinder")} className="rounded-full bg-teal-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/25 hover:bg-teal-800">
                ساخت نقشه راه من
              </button>
              <button onClick={() => go("community")} className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-700 ring-1 ring-stone-300 hover:ring-teal-600/50">
                آشنایی با انجمن
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative">
              <img src={IMG.classroom} alt="کلاس آموزش ویژه" className="h-[420px] w-full rounded-[28px] object-cover shadow-2xl" />
              <div className="absolute -bottom-6 right-6 flex items-center gap-4 rounded-3xl bg-white px-6 py-5 shadow-xl ring-1 ring-stone-200/70">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-700/10 text-teal-700"><Users className="h-6 w-6" /></span>
                <div>
                  <p className="text-xl font-black text-slate-900">+۴۵۰ متخصص</p>
                  <p className="text-[12px] font-semibold text-slate-500">در شبکه همکار سه کشور</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* numbers */}
        <Reveal>
          <div className="mt-20 grid grid-cols-2 gap-4 rounded-[28px] bg-pine px-6 py-9 text-center text-white md:grid-cols-4">
            {[
              { v: "+۲۱۰", l: "پرونده موفق معادلسازی و استخدام" },
              { v: "+۳۰", l: "مرکز راه‌اندازی یا بهینه‌سازی‌شده" },
              { v: "+۱۲٬۰۰۰", l: "خانواده عضو انجمن والدین" },
              { v: "۶۴", l: "اتاق کلاب‌هاوس و وبینار برگزارشده" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-3xl font-black text-amber-400">{s.v}</p>
                <p className="mt-1.5 text-[12.5px] font-semibold text-slate-300">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* values */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <SectionHead badge="ارزش‌های ما" title="چهار اصلی که هیچ‌وقت زیر پا نمی‌گذاریم" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-stone-200/75 transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/25">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-[15.5px] font-black text-slate-900">{v.title}</h3>
                <p className="mt-2 text-[13px] leading-7.5 text-slate-600">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* timeline */}
      <section className="bg-white py-20 ring-1 ring-stone-200/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHead badge="مسیر ما" title="از یک اتاق صوتی تا یک پلتفرم سه‌کشوری" />
          <div className="relative mx-auto mt-14 max-w-3xl">
            <span className="absolute bottom-2 right-[26px] top-2 w-px bg-stone-200 md:right-1/2" />
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={0.05}>
                <div className={`relative flex gap-5 pb-10 last:pb-0 md:w-1/2 ${i % 2 === 0 ? "md:pe-12" : "md:me-auto md:ps-12"}`}>
                  <span className={`absolute right-0 top-0 z-10 grid h-[52px] w-[52px] place-items-center rounded-full bg-teal-700 text-[13px] font-black text-white ring-4 ring-white ${i % 2 === 0 ? "md:-left-[26px] md:right-auto" : "md:-right-[26px]"}`}>
                    {t.year}
                  </span>
                  <div className="ms-16 flex-1 rounded-3xl bg-cream p-6 ring-1 ring-stone-200/70 md:ms-0">
                    <h3 className="text-[15.5px] font-black text-slate-900">{t.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-8 text-slate-600">{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* team */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <SectionHead badge="تیم ما" title="متخصصانی که خودشان این مسیر را رفته‌اند" desc="مشاور آلمان ما در برلین کار درمانی می‌کند؛ مشاور ترکیه ما وکیل استانبول است؛ تیم علمی ما هر هفته کیس واقعی می‌بیند." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white p-6 text-center ring-1 ring-stone-200/75 transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className={`mx-auto grid h-20 w-20 place-items-center rounded-full text-2xl font-black text-white ring-4 ring-cream ${m.color}`}>
                  {m.initials}
                </span>
                <h3 className="mt-4 text-[15.5px] font-black text-slate-900">{m.name}</h3>
                <p className="mt-1 text-[12.5px] font-bold text-teal-700">{m.role}</p>
                <span className="mt-2 inline-block rounded-full bg-sand px-3 py-1 text-[11px] font-black text-slate-600">{m.loc}</span>
                <p className="mt-3 text-[12.5px] leading-7 text-slate-500">{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-[28px] bg-teal-800 px-8 py-9 text-white md:flex-row">
            <div className="flex items-center gap-4">
              <Lightbulb className="h-10 w-10 shrink-0 text-amber-400" />
              <div>
                <h3 className="text-xl font-black">می‌خواهید عضو تیم یا شبکه همکار ما شوید؟</h3>
                <p className="mt-1 text-[13.5px] text-teal-50/85">درمانگران هر سه کشور می‌توانند برای همکاری آموزشی و بالینی درخواست بدهند.</p>
              </div>
            </div>
            <button onClick={() => go("contact")} className="flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-teal-900 transition-transform hover:scale-[1.03]">
              ارسال درخواست همکاری <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
