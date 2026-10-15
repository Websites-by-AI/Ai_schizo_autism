import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Info, Loader2, MessageSquareText, Send, ShieldCheck, User } from "lucide-react";
import { Reveal, SectionHead } from "../components/ui";
import { TelegramIcon } from "../components/icons";
import { useIntegrations } from "../components/IntegrationsProvider";
import { request, telegramStateLabel } from "../lib/api";

const TOPICS = ["سؤال درباره مهاجرت کاری", "تأسیس مرکز", "اطلاعات عمومی خدمات", "همکاری و عضویت در تیم", "رسانه و مصاحبه", "موضوع دیگر"];
const EMPTY_FORM = { name: "", contact: "", topic: TOPICS[0], message: "", website: "" };

export default function Contact() {
  const { status, loading, refresh } = useIntegrations();
  const [form, setForm] = useState(EMPTY_FORM);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (controller.current) return;
    if (form.name.trim().length < 2) return setError("لطفاً نام یا یک نام مستعار وارد کنید.");
    if (form.contact.trim().length < 5) return setError("لطفاً راه تماس قابل استفاده وارد کنید.");
    if (form.message.trim().length < 10) return setError("لطفاً پیام را با حداقل ۱۰ نویسه بنویسید.");
    if (!consent) return setError("برای ارسال اطلاعات از طریق تلگرام باید رضایت خود را اعلام کنید.");
    const next = new AbortController();
    controller.current = next;
    setPending(true);
    setError("");
    try {
      const result = await request<{ ok: boolean }>("/api/contact", { method: "POST", body: JSON.stringify({ ...form, consent }), signal: next.signal });
      if (result.ok !== true) throw new Error("دریافت پیام تأیید نشد. لطفاً دوباره تلاش کنید.");
      if (!next.signal.aborted) setSent(true);
    } catch (reason) {
      if (!next.signal.aborted) setError(reason instanceof Error ? reason.message : "ارسال پیام ممکن نشد.");
    } finally {
      if (!next.signal.aborted) setPending(false);
      controller.current = null;
    }
  }

  const cls = "w-full rounded-2xl bg-cream px-4 py-3 text-sm font-medium text-slate-800 ring-1 ring-stone-200 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600";

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[140px] lg:px-6 lg:pt-[160px]">
      <SectionHead badge="تماس با ما" title="یک پیام، یک ارتباط روشن" desc="سؤال عمومی یا درخواست همکاری خود را به مدیر سایت برسانید. فرم زیر تنها پس از تأیید دریافت توسط تلگرام، پیام موفقیت نشان می‌دهد." />
      <div className="grid gap-8 pb-20 pt-12 lg:grid-cols-5">
        <aside className="space-y-5 lg:col-span-2">
          <Reveal><div className="rounded-3xl bg-pine p-7 text-white"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><TelegramIcon className="h-7 w-7 text-sky-300" /></span><h2 className="mt-5 text-lg font-black">ارتباط از طریق تلگرام</h2><p className="mt-3 text-sm leading-8 text-teal-50/75">برای گفتگو با دستیار آموزشی، ربات را باز کنید. برای فرستادن درخواست به مدیر، از فرم همین صفحه استفاده کنید.</p><p className="mt-4 text-xs text-teal-200">{telegramStateLabel(status?.telegram)}</p>{status?.telegram.url && <a href={status.telegram.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-xs font-black text-white"><TelegramIcon className="h-4 w-4" />باز کردن ربات</a>}</div></Reveal>
          <Reveal delay={0.08}><div className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/80"><ShieldCheck className="h-7 w-7 text-teal-700" /><h2 className="mt-3 text-sm font-black text-slate-900">فقط اطلاعات لازم</h2><p className="mt-2 text-xs leading-8 text-slate-500">می‌توانید از نام مستعار استفاده کنید. فقط یک راه تماس بنویسید. نام کودک، آدرس منزل، شماره شناسایی، نتیجه آزمایش یا پرونده پزشکی نفرستید.</p><p className="mt-3 text-xs leading-8 text-slate-500">نام، راه تماس، موضوع و متن پیام از طریق Telegram Bot API به گفتگوی مدیر ارسال می‌شود. این فرم به مدل هوش مصنوعی فرستاده نمی‌شود و در پایگاه داده این برنامه ذخیره نمی‌شود.</p></div></Reveal>
          <p className="px-2 text-xs leading-8 text-slate-400">این فرم برای درخواست اضطراری یا مشاوره پزشکی شخصی مناسب نیست. در خطر فوری از خدمات اضطراری محلی کمک بگیرید. زمان پاسخ‌گویی مدیر تضمین نمی‌شود.</p>
        </aside>

        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="rounded-[28px] bg-white p-7 shadow-[0_20px_50px_-30px_rgba(12,59,57,0.4)] ring-1 ring-stone-200/80 md:p-9">
            {sent ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center text-center" role="status">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-50 ring-1 ring-emerald-200"><CheckCircle2 className="h-10 w-10 text-emerald-600" /></span>
                <h2 className="mt-6 text-2xl font-black text-slate-900">پیام به تلگرام مدیر رسید</h2>
                <p className="mt-3 max-w-md text-sm leading-8 text-slate-600">تلگرام دریافت پیام با موضوع «{form.topic}» را تأیید کرد. این تأیید به معنی خوانده‌شدن پیام یا رزرو مشاوره نیست.</p>
                <button onClick={() => { setSent(false); setForm(EMPTY_FORM); setConsent(false); }} className="mt-7 rounded-full bg-teal-700 px-7 py-3 text-sm font-bold text-white hover:bg-teal-800">ارسال پیام جدید</button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
                <h2 className="flex items-center gap-2.5 text-lg font-black text-slate-900 sm:col-span-2"><MessageSquareText className="h-6 w-6 text-teal-700" />پیام مستقیم به مدیر</h2>
                {!loading && !status?.contact.enabled && <div className="flex gap-2.5 rounded-2xl bg-amber-50 p-4 text-xs leading-7 text-amber-900 ring-1 ring-amber-200/70 sm:col-span-2"><Info className="mt-1 h-4 w-4 shrink-0" /><div>دریافت پیام هنوز فعال نشده است. مدیر سایت باید <code dir="ltr">TELEGRAM_BOT_TOKEN</code> و <code dir="ltr">TELEGRAM_ADMIN_CHAT_ID</code> را در تنظیمات محرمانه سرور وارد کند.<button type="button" onClick={refresh} className="mr-2 font-black underline underline-offset-4">بررسی دوباره</button></div></div>}
                <div><label htmlFor="contact-name" className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-700"><User className="h-4 w-4 text-teal-700" />نام یا نام مستعار *</label><input id="contact-name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} minLength={2} maxLength={80} required autoComplete="nickname" placeholder="چه صدایتان کنیم؟" className={cls} /></div>
                <div><label htmlFor="contact-address" className="mb-2 block text-xs font-bold text-slate-700">ایمیل یا راه تماس *</label><input id="contact-address" value={form.contact} onChange={event => setForm({ ...form, contact: event.target.value })} minLength={5} maxLength={150} required placeholder="فقط یک راه برای پاسخ‌گویی" className={cls} /></div>
                <div className="sm:col-span-2"><label htmlFor="contact-topic" className="mb-2 block text-xs font-bold text-slate-700">موضوع پیام *</label><select id="contact-topic" value={form.topic} onChange={event => setForm({ ...form, topic: event.target.value })} className={cls}>{TOPICS.map(topic => <option key={topic}>{topic}</option>)}</select></div>
                <div className="sm:col-span-2"><label htmlFor="contact-message" className="mb-2 block text-xs font-bold text-slate-700">متن پیام *</label><textarea id="contact-message" value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} rows={6} minLength={10} maxLength={2000} required placeholder="سؤال عمومی یا درخواست خود را بدون اطلاعات حساس بنویسید…" className={`${cls} resize-y leading-8`} /></div>
                <div hidden aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={event => setForm({ ...form, website: event.target.value })} /></div>
                <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-7 text-slate-500 sm:col-span-2"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-1.5 h-4 w-4 shrink-0 accent-teal-700" /><span>موافقم اطلاعات این فرم برای پاسخ‌گویی از طریق تلگرام به مدیر سایت ارسال شود. می‌دانم تلگرام و گیرنده پیام ممکن است آن را نگهداری کنند.</span></label>
                {error && <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-xs font-bold leading-7 text-rose-700 ring-1 ring-rose-200 sm:col-span-2">{error}</p>}
                <button type="submit" disabled={pending || !consent || !status?.contact.enabled} className="flex items-center justify-center gap-2 rounded-2xl bg-teal-700 py-4 text-sm font-black text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 sm:col-span-2">{pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 -scale-x-100" />}{pending ? "در انتظار تأیید تلگرام…" : "ارسال به مدیر سایت"}</button>
                <p className="text-center text-[11px] leading-6 text-slate-400 sm:col-span-2">ارسال بدون رضایت انجام نمی‌شود. موفقیت فقط پس از تأیید Telegram Bot API نمایش داده می‌شود.</p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
