import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2, Clock3, Globe2, Mail, MapPin, MessageSquareText, Send, User,
} from "lucide-react";
import { Reveal, SectionHead } from "../components/ui";
import { InstagramIcon, TelegramIcon, YoutubeIcon } from "../components/icons";

const TOPICS = ["سؤال درباره مهاجرت کاری", "تأسیس مرکز", "خدمات برای کودکم", "همکاری و عضویت در تیم", "رسانه و مصاحبه", "موضوع دیگر"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", contact: "", topic: TOPICS[0], message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return setError("لطفاً نام کامل را وارد کنید.");
    if (form.contact.trim().length < 5) return setError("لطفاً ایمیل یا شماره تماس معتبر وارد کنید.");
    if (form.message.trim().length < 10) return setError("پیام شما خیلی کوتاه است؛ کمی بیشتر توضیح دهید.");
    setError("");
    setSent(true);
  };

  const cls =
    "w-full rounded-2xl bg-cream px-4 py-3 text-sm font-medium text-slate-800 ring-1 ring-stone-200 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600";

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="تماس با ما"
        title="حرفتان را می‌شنویم؛ از هر کجای دنیا"
        desc="تیم پشتیبانی شنبه تا پنجشنبه پاسخ‌گوست. برای سؤال‌های فوری، تلگرام سریع‌ترین مسیر است."
      />

      <div className="grid gap-8 pb-20 pt-12 lg:grid-cols-5">
        {/* info */}
        <div className="space-y-4 lg:col-span-2">
          {[
            { icon: Mail, title: "ایمیل", lines: ["hello@autismbridge.ir", "support@autismbridge.ir"], color: "bg-teal-700" },
            { icon: TelegramIcon, title: "تلگرام (پاسخ سریع)", lines: ["AutismBridge@ — کانال و پشتیبانی", "معمولاً کمتر از ۳ ساعت پاسخ می‌دهید"], color: "bg-sky-600" },
            { icon: Clock3, title: "ساعات پاسخ‌گویی", lines: ["شنبه تا پنجشنبه · ۹ تا ۱۸ به وقت تهران", "جلسات مشاوره تا ساعت ۲۲ هم برگزار می‌شود"], color: "bg-amber-600" },
            { icon: MapPin, title: "دفاتر همکار", lines: ["تهران · سعادت‌آباد (دفتر اصلی)", "برلین · استانبول (همکاران محلی)"], color: "bg-rose-700" },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <div className="flex items-start gap-4 rounded-3xl bg-white p-5 ring-1 ring-stone-200/75">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg ${c.color}`}>
                  <c.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-[15px] font-black text-slate-900">{c.title}</h3>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-0.5 text-[13px] font-medium leading-6 text-slate-500">{l}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.3}>
            <div className="rounded-3xl bg-pine p-6 text-white">
              <Globe2 className="h-8 w-8 text-amber-400" />
              <h3 className="mt-3 text-[15.5px] font-black">ما را در شبکه‌های اجتماعی دنبال کنید</h3>
              <p className="mt-1.5 text-[12.5px] leading-7 text-slate-300">پاسخ بسیاری از سؤال‌های رایج، هر هفته در لایوها و پست‌های آموزشی داده می‌شود.</p>
              <div className="mt-4 flex gap-2.5">
                {[
                  { icon: YoutubeIcon, label: "یوتیوب" },
                  { icon: InstagramIcon, label: "اینستاگرام" },
                  { icon: TelegramIcon, label: "تلگرام" },
                ].map((s) => (
                  <span key={s.label} className="flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-bold ring-1 ring-white/20 transition-colors hover:bg-white/20">
                    <s.icon className="h-4 w-4" /> {s.label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* form */}
        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="h-full rounded-[28px] bg-white p-7 shadow-[0_20px_50px_-30px_rgba(12,59,57,0.4)] ring-1 ring-stone-200/80 md:p-9">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center py-14 text-center"
                >
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </span>
                  <h3 className="mt-6 text-2xl font-black text-slate-900">پیام شما رسید، {form.name.split(" ")[0]} عزیز</h3>
                  <p className="mt-3 max-w-md text-sm leading-8 text-slate-600">
                    موضوع «{form.topic}» برای تیم مربوطه ارسال شد و حداکثر تا یک روز کاری آینده پاسخ می‌دهید. اگر موضوعتان فوری است، در تلگرام هم پیام بگذارید.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", contact: "", topic: TOPICS[0], message: "" }); }}
                    className="mt-7 rounded-full bg-teal-700 px-7 py-3 text-sm font-bold text-white hover:bg-teal-800"
                  >
                    ارسال پیام جدید
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
                  <h3 className="flex items-center gap-2.5 text-lg font-black text-slate-900 sm:col-span-2">
                    <MessageSquareText className="h-6 w-6 text-teal-700" /> فرم پیام مستقیم
                  </h3>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-slate-700"><User className="h-4 w-4 text-teal-700" /> نام شما *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="نام و نام خانوادگی" className={cls} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">ایمیل یا شماره تماس *</label>
                    <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="برای پاسخ‌گویی به شما" className={cls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">موضوع پیام</label>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setForm({ ...form, topic: t })}
                          className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-all ${
                            form.topic === t ? "bg-teal-700 text-white" : "bg-cream text-slate-600 ring-1 ring-stone-200 hover:ring-teal-600/40"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[13px] font-bold text-slate-700">متن پیام *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={6}
                      placeholder="شرایط، سؤال یا درخواستتان را بنویسید…"
                      className={`${cls} resize-none leading-7`}
                    />
                  </div>
                  {error && (
                    <p className="rounded-2xl bg-rose-50 px-4 py-3 text-[12.5px] font-bold text-rose-700 ring-1 ring-rose-200 sm:col-span-2">{error}</p>
                  )}
                  <button type="submit" className="flex items-center justify-center gap-2 rounded-full bg-teal-700 py-4 text-[15px] font-black text-white shadow-xl shadow-teal-700/25 transition-colors hover:bg-teal-800 sm:col-span-2">
                    <Send className="h-5 w-5 -scale-x-100" /> ارسال پیام
                  </button>
                  <p className="text-center text-[11.5px] text-slate-400 sm:col-span-2">اطلاعات شما نزد ما محفوظ است و هرگز با شخص ثالث به اشتراک گذاشته نمی‌شود.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
