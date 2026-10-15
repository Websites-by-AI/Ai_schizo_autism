import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Building2, CheckCircle2, Globe2, GraduationCap, HeartHandshake, HelpCircle, MapPin,
  MessagesSquare, Send, Sparkles, Star, Users,
} from "lucide-react";
import { CENTERS, FAMILY_CIRCLES, MENTORS } from "../data/site";
import { Reveal, SectionHead, faNum, type GoFn } from "../components/ui";

const CITY_POS: Record<string, { x: number; y: number; country: "iran" | "germany" | "turkey" }> = {
  "هامبورگ": { x: 16, y: 12, country: "germany" },
  "برلین": { x: 25, y: 18, country: "germany" },
  "مونیخ": { x: 20, y: 33, country: "germany" },
  "استانبول": { x: 40, y: 36, country: "turkey" },
  "آنکارا": { x: 48, y: 41, country: "turkey" },
  "تهران": { x: 68, y: 45, country: "iran" },
  "مشهد": { x: 85, y: 41, country: "iran" },
  "اصفهان": { x: 71, y: 59, country: "iran" },
  "شیراز": { x: 66, y: 73, country: "iran" },
};

const ROUTES: [string, string][] = [
  ["برلین", "استانبول"], ["استانبول", "تهران"], ["استانبول", "آنکارا"],
  ["تهران", "مشهد"], ["تهران", "اصفهان"], ["اصفهان", "شیراز"], ["برلین", "مونیخ"], ["برلین", "هامبورگ"],
];

const COUNTRY_CHIPS = [
  { id: "all", label: "هر سه کشور" },
  { id: "germany", label: "آلمان" },
  { id: "turkey", label: "ترکیه" },
  { id: "iran", label: "ایران" },
] as const;

const SEED_QA = [
  { id: 1, author: "مریم س.", city: "تهران", q: "برای پسر ۴ ساله‌ام بین ABA و مدل دنور مانده‌ام؛ مرکزها هرکدام یک چیز می‌گویند. تجربه شما چه بود؟", answers: 14, tag: "انتخاب متد" },
  { id: 2, author: "خانواده احمدی", city: "برلین", q: "در برلین برای گرفتن مربی سایه (Schulbegleiter) از کجا شروع کردید؟ اداره جوانان (Jugendamt) چه مدارکی خواست؟", answers: 9, tag: "مدرسه در آلمان" },
  { id: 3, author: "الهام ر.", city: "استانبول", q: "هزینه واقعی ماهانه درمان در استانبول چقدر برایتان درآمده؟ مرکز خصوصی بهتر است یا درمانگر خانگی؟", answers: 21, tag: "هزینه درمان" },
  { id: 4, author: "پدر آرش", city: "مشهد", q: "پسرم به صدای محیط خیلی حساس است؛ برای مهدکودک چطور محیط را آماده کردید که همکاری کنند؟", answers: 7, tag: "حساسیت حسی" },
];

export default function FamilyMap({ go }: { go: GoFn }) {
  const [country, setCountry] = useState<string>("all");
  const [city, setCity] = useState<string | null>(null);
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [mentorReq, setMentorReq] = useState<Set<number>>(new Set());
  const [qa, setQa] = useState(SEED_QA);
  const [form, setForm] = useState({ name: "", city: "تهران", q: "" });
  const [qaError, setQaError] = useState("");

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, id: number) =>
    setter((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const centers = CENTERS.filter(
    (c) => (country === "all" || c.countryId === country) && (!city || c.city === city)
  );
  const cityNames = Object.keys(CITY_POS);

  const submitQa = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setQaError("نام یا نام مستعارتان را بنویسید.");
    if (form.q.trim().length < 12) return setQaError("سؤالتان را کمی کامل‌تر بنویسید تا خانواده‌ها بهتر کمک کنند.");
    setQaError("");
    setQa([{ id: Date.now(), author: form.name.trim(), city: form.city, q: form.q.trim(), answers: 0, tag: "سؤال تازه" }, ...qa]);
    setForm({ name: "", city: "تهران", q: "" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="شبکه خانواده‌ها و مراکز"
        title="روی نقشه، نزدیک‌ترین کمک را پیدا کنید"
        desc="مثل نقشه‌های اجتماعی؛ مراکز توانبخشی، مدرسه‌های فراگیر، گروه‌های حمایت والدین و خانواده‌های باتجربه در شهرهای ایران، آلمان و ترکیه — روی نقشه ببینید، وصل شوید و از هم کمک بگیرید."
      />

      {/* country chips */}
      <Reveal className="mt-10">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {COUNTRY_CHIPS.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCountry(c.id); setCity(null); }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold transition-all ${country === c.id ? "bg-teal-700 text-white shadow-lg shadow-teal-700/25" : "bg-white text-slate-600 ring-1 ring-stone-300 hover:ring-teal-600/40"}`}
            >
              <Globe2 className="h-4 w-4" /> {c.label}
            </button>
          ))}
          {city && (
            <button onClick={() => setCity(null)} className="rounded-full bg-rose-50 px-4 py-2.5 text-[12.5px] font-black text-rose-600 ring-1 ring-rose-200">
              حذف فیلتر شهر «{city}» ✕
            </button>
          )}
        </div>
      </Reveal>

      {/* map + list */}
      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div
            className="relative h-[420px] overflow-hidden rounded-[28px] ring-1 ring-teal-900/15 md:h-[480px]"
            style={{ backgroundImage: "radial-gradient(rgba(15,118,110,0.14) 1.2px, transparent 1.2px)", backgroundSize: "22px 22px", backgroundColor: "#f6efe0" }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-teal-700/5" />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              {ROUTES.map(([a, b]) => (
                <line key={a + b} x1={CITY_POS[a].x} y1={CITY_POS[a].y} x2={CITY_POS[b].x} y2={CITY_POS[b].y} stroke="#0f766e" strokeOpacity="0.35" strokeWidth="0.35" strokeDasharray="1.4 1.4" />
              ))}
            </svg>

            <span className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[12px] font-black text-slate-700 shadow ring-1 ring-stone-200 backdrop-blur">
              شبکه زنده پل اوتیسم · {faNum(CENTERS.length)} مرکز و گروه فعال
            </span>
            <span className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-pine px-4 py-2 text-[11.5px] font-bold text-white shadow">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              روی هر شهر کلیک کنید
            </span>

            {cityNames.map((name) => {
              const p = CITY_POS[name];
              const dim = country !== "all" && p.country !== country;
              const active = city === name;
              const count = CENTERS.filter((c) => c.city === name).length;
              return (
                <button
                  key={name}
                  onClick={() => setCity(active ? null : name)}
                  className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${dim ? "pointer-events-none opacity-25" : "opacity-100"}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  aria-label={name}
                >
                  <span className={`relative mx-auto grid place-items-center rounded-full text-white shadow-xl transition-all ${active ? "h-12 w-12 bg-rose-500 ring-4 ring-rose-200" : "h-9 w-9 bg-teal-700 group-hover:scale-110"}`}>
                    <MapPin className="h-5 w-5" />
                    {active && <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/50" />}
                  </span>
                  <span className={`mx-auto mt-1.5 block w-max rounded-full px-2.5 py-1 text-[10.5px] font-black shadow ring-1 ${active ? "bg-rose-500 text-white ring-rose-300" : "bg-white/95 text-slate-700 ring-stone-200"}`}>
                    {name} · {faNum(count)}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* centers list */}
        <Reveal delay={0.1} className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-[28px] bg-white p-6 ring-1 ring-stone-200/80">
            <h3 className="flex items-center gap-2.5 text-[16px] font-black text-slate-900">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white"><Building2 className="h-5 w-5" /></span>
              {city ? `مراکز و گروه‌های ${city}` : "همه مراکز و گروه‌ها"}
              <span className="ms-auto rounded-full bg-sand px-3 py-1 text-[11.5px] font-black text-slate-600">{faNum(centers.length)} مورد</span>
            </h3>
            <div className="no-scrollbar mt-5 flex-1 space-y-3 overflow-y-auto pe-1 lg:max-h-[392px]">
              {centers.length === 0 ? (
                <div className="rounded-2xl bg-cream px-5 py-8 text-center ring-1 ring-stone-200">
                  <MapPin className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-[13px] font-bold text-slate-600">در این شهر هنوز مرکز ثبت‌شده‌ای نداریم.</p>
                  <button onClick={() => go("collaborate")} className="mt-2 text-[12.5px] font-black text-teal-700">مرکزتان را به نقشه اضافه کنید ←</button>
                </div>
              ) : (
                centers.map((c) => (
                  <div key={c.id} className="rounded-2xl bg-cream px-5 py-4 ring-1 ring-stone-200/70 transition-all hover:ring-teal-600/35">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[13.5px] font-black leading-6 text-slate-900">{c.name}</h4>
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-black text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {faNum(c.rating)} ({faNum(c.reviews)})
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-[11.5px] font-bold text-teal-700">
                      <MapPin className="h-3.5 w-3.5" /> {c.city} · {c.type}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-6.5 text-slate-600">{c.desc}</p>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => go("collaborate")} className="mt-5 w-full rounded-full bg-cream py-3 text-[13px] font-black text-teal-800 ring-1 ring-stone-200 transition-colors hover:ring-teal-600/40">
              مرکز یا گروه شما روی نقشه نیست؟ اضافه‌اش کنید
            </button>
          </div>
        </Reveal>
      </div>

      {/* family circles */}
      <section className="py-14">
        <SectionHead badge="خانواده‌ها به خانواده‌ها کمک می‌کنند" title="گروه‌های محلی والدین؛ تجربه‌ای که هیچ مقاله‌ای ندارد" desc="در شهر خودتان به یک دورهمی بپیوندید؛ یا اگر تازه به شهری مهاجرت کرده‌اید، از همین هفته تنها نیستید." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FAMILY_CIRCLES.map((c, i) => {
            const isJoined = joined.has(c.id);
            return (
              <Reveal key={c.id} delay={(i % 3) * 0.07}>
                <div className="flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-stone-200/80 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/25">
                      <Users className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-teal-700/10 px-3 py-1 text-[11px] font-black text-teal-800">{c.mode}</span>
                  </div>
                  <h3 className="mt-4 text-[15px] font-black text-slate-900">{c.name}</h3>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-bold text-slate-500">
                    <MapPin className="h-4 w-4 text-teal-700" /> {c.city} · {c.meet}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-black text-teal-700">
                    <HeartHandshake className="h-4 w-4" /> {faNum(c.members)} خانواده عضو
                  </p>
                  <button
                    onClick={() => toggleSet(setJoined, c.id)}
                    className={`mt-5 w-full rounded-full py-2.5 text-[13px] font-bold transition-all mt-auto ${isJoined ? "bg-emerald-600 text-white" : "bg-cream text-slate-700 ring-1 ring-stone-300 hover:ring-teal-600/50"}`}
                  >
                    {isJoined ? <span className="flex items-center justify-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> عضو این گروه شدید</span> : "درخواست عضویت"}
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* mentors + Q&A */}
      <section className="grid gap-6 pb-20 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-[28px] bg-pine p-7 text-white">
            <h3 className="flex items-center gap-3 text-lg font-black">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-amber-400"><GraduationCap className="h-6 w-6" /></span>
              خانواده‌های راهنما (منتور)
            </h3>
            <p className="mt-2 text-[13px] leading-7 text-slate-300">خانواده‌هایی که این مسیر را قبلاً رفته‌اند و داوطلبانه کنار تازه‌واردها می‌ایستند.</p>
            <div className="mt-5 space-y-3.5">
              {MENTORS.map((m) => {
                const req = mentorReq.has(m.id);
                return (
                  <div key={m.id} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/12">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[14.5px] font-black">{m.name}</p>
                      <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-[10.5px] font-black text-amber-300 ring-1 ring-amber-400/30">{m.exp}</span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-semibold text-teal-200">
                      <MapPin className="h-3.5 w-3.5" /> {m.meta}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.topics.map((t) => (
                        <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-bold text-slate-200">{t}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleSet(setMentorReq, m.id)}
                      className={`mt-4 w-full rounded-full py-2.5 text-[12.5px] font-black transition-all ${req ? "bg-emerald-500 text-white" : "bg-amber-500 text-pine hover:bg-amber-400"}`}
                    >
                      {req ? "درخواست راهنمایی ارسال شد" : "درخواست گفت‌وگو با این خانواده"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col rounded-[28px] bg-white p-7 ring-1 ring-stone-200/80">
            <h3 className="flex items-center gap-3 text-lg font-black text-slate-900">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-700/10 text-teal-700"><MessagesSquare className="h-6 w-6" /></span>
              بپرسید؛ خانواده‌ها جواب می‌دهند
            </h3>
            <div className="no-scrollbar mt-5 flex-1 space-y-3 overflow-y-auto pe-1 lg:max-h-[300px]">
              {qa.map((q, i) => (
                <motion.div key={q.id} initial={i === 0 && q.answers === 0 ? { opacity: 0, y: -8 } : false} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-cream px-5 py-4 ring-1 ring-stone-200/70">
                  <p className="flex flex-wrap items-center gap-2 text-[11.5px] font-bold text-teal-700">
                    {q.author} · {q.city}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${q.answers === 0 ? "bg-rose-50 text-rose-600 ring-rose-200" : "bg-sand text-slate-500 ring-stone-200"}`}>{q.tag}</span>
                  </p>
                  <p className="mt-1.5 text-[13.5px] font-semibold leading-7 text-slate-800">{q.q}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11.5px] font-black text-slate-400">
                    <MessagesSquare className="h-3.5 w-3.5" />
                    {q.answers === 0 ? "هنوز پاسخی ندارد؛ اولین کمک باشید" : `${faNum(q.answers)} پاسخ از خانواده‌ها`}
                  </p>
                </motion.div>
              ))}
            </div>

            <form onSubmit={submitQa} className="mt-5 border-t border-stone-100 pt-5">
              <p className="flex items-center gap-2 text-[13.5px] font-black text-slate-800">
                <HelpCircle className="h-4.5 w-4.5 text-teal-700" /> سؤال شما از خانواده‌ها
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="نام یا نام مستعار" className="rounded-2xl bg-cream px-4 py-3 text-sm font-medium ring-1 ring-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-600" />
                <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-2xl bg-cream px-4 py-3 text-sm font-medium ring-1 ring-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-600">
                  {cityNames.map((c) => (<option key={c} value={c}>{c}</option>))}
                  <option value="آنلاین">آنلاین / شهر دیگر</option>
                </select>
              </div>
              <textarea value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} rows={3} placeholder="سؤالتان را بنویسید؛ مثلاً درباره مدرسه، هزینه درمان یا تجربه یک متد…" className="mt-3 w-full resize-none rounded-2xl bg-cream px-4 py-3 text-sm font-medium leading-7 ring-1 ring-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-600" />
              {qaError && <p className="mt-2 rounded-xl bg-rose-50 px-4 py-2.5 text-[12px] font-bold text-rose-700 ring-1 ring-rose-200">{qaError}</p>}
              <button type="submit" className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 py-3 text-sm font-black text-white transition-colors hover:bg-teal-800">
                <Send className="h-4.5 w-4.5 -scale-x-100" /> انتشار سؤال در شبکه خانواده‌ها
              </button>
              <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> سؤال‌های پرتکرار هر هفته در اتاق کلاب‌هاوس با حضور متخصص پاسخ داده می‌شوند.
              </p>
            </form>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
