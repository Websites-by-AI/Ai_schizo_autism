import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowUpLeft, BookOpen, Bot, Check, Download, Info, Loader2, LockKeyhole, MessageCircle, Plus, RefreshCw, Send, ShieldCheck, Sparkles, Square, Trash2 } from "lucide-react";
import { Reveal, type GoFn } from "../components/ui";
import { TelegramIcon } from "../components/icons";
import { useIntegrations } from "../components/IntegrationsProvider";
import { recentConversation, request, telegramStateLabel, type ChatMessage } from "../lib/api";

type Message = ChatMessage & { id: string; failed?: boolean; truncated?: boolean };
const STARTERS = [
  { label: "یک روز آرام‌تر", text: "چطور یک برنامه روزانه قابل پیش‌بینی و منعطف برای خانواده بسازیم؟" },
  { label: "آماده برای گفت‌وگو", text: "برای جلسه اول با متخصص رشد، چه سؤال‌هایی آماده کنم؟" },
  { label: "راه‌های ارتباط", text: "ارتباط جایگزین و افزوده (AAC) چیست؟ ساده و بدون توصیه شخصی توضیح بده." },
  { label: "درک بهتر تفاوت‌ها", text: "چطور درباره تفاوت‌های حسی با اعضای خانواده صحبت کنیم؟" },
];

export default function AiLab({ go }: { go: GoFn }) {
  const { status, loading, error: statusError, refresh } = useIntegrations();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [consent, setConsent] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [retryText, setRetryText] = useState("");
  const controller = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const configured = Boolean(status?.ai.configured);
  const ready = configured && consent && (!status?.webAccessRequired || Boolean(accessKey.trim()));

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, pending]);

  function reset() {
    controller.current?.abort();
    controller.current = null;
    setPending(false);
    setMessages([]);
    setError("");
    setRetryText("");
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || !ready || controller.current) return;
    const next = new AbortController();
    controller.current = next;
    const user: Message = { id: crypto.randomUUID(), role: "user", content };
    const history = recentConversation([...messages.filter(message => !message.failed), user]);
    setMessages(previous => [...previous, user]);
    setDraft("");
    setPending(true);
    setError("");
    setRetryText("");
    try {
      const reply = await request<{ text: string; model: string; truncated: boolean }>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: history, consent: true }),
        headers: status?.webAccessRequired ? { "X-App-Key": accessKey } : {},
        signal: next.signal,
      });
      if (controller.current !== next || next.signal.aborted) return;
      setMessages(previous => [...previous, { id: crypto.randomUUID(), role: "assistant", content: reply.text, truncated: reply.truncated }]);
    } catch (reason) {
      if (controller.current !== next) return;
      setMessages(previous => previous.map(message => message.id === user.id ? { ...message, failed: true } : message));
      setError(next.signal.aborted ? "درخواست متوقف شد. این سؤال به سابقه پاسخ‌های موفق اضافه نشد." : reason instanceof Error ? reason.message : "ارسال پیام ممکن نشد.");
      setRetryText(content);
    } finally {
      if (controller.current === next) {
        controller.current = null;
        setPending(false);
      }
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void send(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(draft);
    }
  }

  function download() {
    const text = ["گفتگوی آموزشی پل اوتیسم — نه تشخیص یا نسخه پزشکی", "خروجی ممکن است نادرست باشد؛ پیش از استفاده بررسی کنید.", "", ...messages.filter(message => !message.failed).map(message => `${message.role === "user" ? "شما" : "دستیار"}:\n${message.content}\n`)].join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "autismbridge-conversation.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function chooseStarter(text: string) {
    setDraft(text);
    textarea.current?.focus();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-[140px] lg:px-6 lg:pt-[160px]">
      <section className="relative mb-9 overflow-hidden rounded-[32px] bg-pine px-6 py-9 text-white md:px-10 md:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -left-10 -top-16 select-none text-[290px] font-light leading-none text-teal-300/[0.07] md:left-8 md:text-[370px]">∞</div>
        <div className="relative flex flex-wrap items-center justify-between gap-7">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15"><Sparkles className="h-3.5 w-3.5 text-amber-300" /> دستیار آموزشی پل اوتیسم</span>
              <span dir="ltr" className="rounded-full bg-amber-300 px-3 py-2 text-pine">Hugging Face</span>
            </div>
            <h1 className="text-3xl font-black leading-[1.7] md:text-[42px] md:leading-[1.65]">سؤال‌های کوچک،<br /><span className="text-teal-200">همراهیِ آگاهانه.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-teal-50/75 md:text-[15px]">برای فهم بهتر مفاهیم، ساختن روتین‌های حمایتی و آماده‌کردن سؤال‌های جلسه با متخصص. یک همراه آموزشی، در وب و تلگرام؛ نه جایگزین ارزیابی حرفه‌ای.</p>
          </div>
          <div className="grid w-full max-w-[260px] gap-3 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10">
            {["پاسخ به زبان فارسی و زبان سؤال شما", "بدون امتیاز تشخیص یا پیش‌بینی رشد", "بدون ذخیره گفتگو در پایگاه داده برنامه"].map(item => (
              <p key={item} className="flex items-start gap-2.5 text-xs leading-6 text-teal-50/85"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-teal-300" />{item}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3.5 text-xs ring-1 ring-stone-200/80" aria-live="polite">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="flex items-center gap-2 font-bold text-slate-600"><span className={`h-2 w-2 rounded-full ${configured ? "bg-teal-500" : "bg-amber-400"}`} />Hugging Face: {loading && !status ? "در حال بررسی تنظیمات" : configured ? "پیکربندی شده؛ تأیید سرویس با ارسال سؤال" : "نیاز به تنظیم HF_TOKEN"}</span>
          <span className="flex items-center gap-2 text-slate-500"><TelegramIcon className="h-4 w-4 text-sky-600" />{telegramStateLabel(status?.telegram)}</span>
        </div>
        <button onClick={refresh} disabled={loading} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-bold text-teal-800 disabled:opacity-40"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />بررسی دوباره</button>
      </div>
      {statusError && <p role="alert" className="mb-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">وضعیت سرور دریافت نشد: {statusError}</p>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_60px_-35px_rgba(12,59,57,0.3)] ring-1 ring-stone-200/80" aria-label="گفتگو با دستیار">
          <div className="flex items-center justify-between gap-3 border-b border-stone-100 p-5 md:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-700 text-white"><Bot className="h-6 w-6" /></span>
              <div className="min-w-0"><h2 className="text-sm font-black text-slate-900">فضایی برای سؤال‌های شما</h2><p className="mt-1 truncate text-[11px] text-slate-400" dir="ltr">{status?.ai.model || "Hugging Face Inference Providers"}</p></div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={download} disabled={!messages.some(message => !message.failed)} aria-label="دانلود گفتگو" title="دانلود گفتگو" className="rounded-xl p-2 text-slate-500 hover:bg-cream disabled:opacity-30"><Download className="h-4.5 w-4.5" /></button>
              <button onClick={reset} disabled={!messages.length && !pending} aria-label="پاک کردن گفتگو" title="پاک کردن گفتگو" className="rounded-xl p-2 text-slate-500 hover:bg-cream disabled:opacity-30"><Trash2 className="h-4.5 w-4.5" /></button>
            </div>
          </div>

          <div className="h-[460px] overflow-y-auto overscroll-contain px-5 py-6 md:px-7" role="log" aria-label="پیام‌های گفتگو" aria-live="polite" aria-relevant="additions" aria-busy={pending}>
            {!messages.length && !pending ? (
              <div className="flex min-h-full flex-col justify-center">
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100"><Sparkles className="h-6 w-6" /></span>
                <h3 className="text-xl font-black text-slate-900">از کجا شروع کنیم؟</h3>
                <p className="mb-6 mt-3 max-w-lg text-sm leading-8 text-slate-500">سؤال‌تان را ساده و بدون نام یا اطلاعات شخصی بنویسید. اگر هنوز نمی‌دانید چه بپرسید، یکی از این ایده‌ها را انتخاب کنید.</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {STARTERS.map(starter => (
                    <button key={starter.label} onClick={() => chooseStarter(starter.text)} className="group flex items-center justify-between gap-2 rounded-2xl bg-cream p-4 text-start ring-1 ring-stone-200/75 transition-colors hover:bg-teal-50 hover:ring-teal-700/25">
                      <span><span className="block text-xs font-black text-teal-800">{starter.label}</span><span className="mt-1.5 block text-[11.5px] leading-6 text-slate-500">{starter.text}</span></span><ArrowUpLeft className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-teal-700" />
                    </button>
                  ))}
                </div>
              </div>
            ) : messages.map(message => (
              <div key={message.id} className={`mb-5 flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[92%] rounded-[20px] p-4 md:px-5 ${message.role === "user" ? "rounded-tr-md bg-teal-700 text-white" : "rounded-tl-md bg-cream text-slate-700 ring-1 ring-stone-200/60"} ${message.failed ? "opacity-60" : ""}`}>
                  <span className={`mb-2 block text-[10px] font-bold ${message.role === "user" ? "text-teal-100/80" : "text-teal-700"}`}>{message.role === "user" ? "شما" : "دستیار آموزشی"}{message.failed ? " · پاسخ دریافت نشد" : ""}</span>
                  <p dir="auto" className="whitespace-pre-wrap break-words text-sm leading-8 [overflow-wrap:anywhere]">{message.content}</p>
                  {message.truncated && <p className="mt-3 border-t border-stone-200 pt-2 text-[11px] text-amber-700">پاسخ به سقف طول رسید؛ برای توضیح بیشتر سؤال کوتاه‌تری بپرسید.</p>}
                </div>
              </div>
            ))}
            {pending && <div className="flex items-center gap-2.5 py-2 text-xs font-bold text-teal-700"><Loader2 className="h-4 w-4 animate-spin" />در انتظار پاسخ مدل…</div>}
            <div ref={end} />
          </div>

          <div className="border-t border-stone-100 bg-stone-50/50 p-5 md:px-7">
            {!configured && !loading && <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-amber-50 p-3.5 text-xs leading-7 text-amber-900 ring-1 ring-amber-200/70"><Info className="mt-1 h-4 w-4 shrink-0" /><p>دستیار هنوز به مدل وصل نیست. مدیر سایت باید <code dir="ltr" className="font-bold">HF_TOKEN</code> را در متغیرهای محرمانه سرور یا Space اضافه کند. تا آن زمان هیچ پاسخ ساختگی نمایش داده نمی‌شود.</p></div>}
            {status?.webAccessRequired && <div className="mb-4"><label htmlFor="access-key" className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-600"><LockKeyhole className="h-3.5 w-3.5" />کلید دسترسی این سایت</label><input id="access-key" type="password" autoComplete="off" value={accessKey} onChange={event => setAccessKey(event.target.value)} placeholder="فقط کلید اشتراکی سایت، نه توکن Hugging Face یا تلگرام" className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-teal-600" /></div>}
            <label className="mb-4 flex cursor-pointer items-start gap-2.5 text-[11.5px] leading-6 text-slate-500"><input type="checkbox" checked={consent} onChange={event => { setConsent(event.target.checked); if (!event.target.checked) reset(); }} className="mt-1 h-4 w-4 shrink-0 accent-teal-700" /><span>با ارسال متن گفتگو به Hugging Face و ارائه‌دهنده مدل برای پردازش موافقم. اطلاعات شناسایی یا پزشکی حساس وارد نمی‌کنم. <a href="https://huggingface.co/privacy" target="_blank" rel="noopener noreferrer" className="font-bold text-teal-800 underline underline-offset-4">سیاست حریم خصوصی</a></span></label>
            {error && <div role="alert" className="mb-4 rounded-2xl bg-rose-50 p-3.5 text-xs leading-7 text-rose-700"><p>{error}</p>{retryText && <button type="button" onClick={() => { setDraft(retryText); textarea.current?.focus(); }} className="mt-1 font-black underline underline-offset-4">برگرداندن سؤال به کادر پیام</button>}</div>}
            <form onSubmit={submit}>
              <label htmlFor="assistant-prompt" className="sr-only">سؤال شما</label>
              <div className="rounded-2xl border border-stone-200 bg-white p-3 transition-shadow focus-within:border-teal-600/50 focus-within:ring-2 focus-within:ring-teal-700/10">
                <textarea id="assistant-prompt" ref={textarea} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={onKeyDown} rows={2} maxLength={4000} placeholder="چه چیزی را دوست دارید بهتر بفهمید؟" className="w-full resize-none bg-transparent px-1 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400" />
                <div className="mt-2 flex items-center justify-between gap-2"><span className="text-[10px] text-slate-400">{draft.length.toLocaleString("fa-IR")} / ۴۰۰۰ · Enter ارسال</span>{pending ? <button type="button" onClick={() => controller.current?.abort()} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700"><Square className="h-3.5 w-3.5" />توقف پاسخ</button> : <button type="submit" disabled={!ready || !draft.trim()} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"><Send className="h-4 w-4 -scale-x-100" />ارسال سؤال</button>}</div>
              </div>
            </form>
            <p className="mt-3 text-center text-[10.5px] leading-6 text-slate-400">پاسخ مدل ممکن است نادرست باشد. راهنمای آموزشی است، نه تشخیص، پیش‌بینی رشد یا نسخه پزشکی.</p>
          </div>
        </section>

        <aside className="space-y-5">
          <Reveal><div className="rounded-[26px] bg-[#e9f3f9] p-6 ring-1 ring-sky-900/10"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-600 text-white"><TelegramIcon className="h-6 w-6" /></span><span dir="ltr" className="text-[10px] font-bold tracking-[0.18em] text-sky-700">TAKE IT WITH YOU</span></div><h2 className="mt-5 text-lg font-black text-slate-900">همین همراه، در تلگرام</h2><p className="mt-2 text-xs leading-7 text-slate-600">بدون باز کردن سایت سؤال بپرسید. سابقه تلگرام از این صفحه جداست و پیام‌های وب خودکار به ربات ارسال نمی‌شوند.</p><div className="my-4 rounded-2xl bg-white/65 px-4 py-3 text-[11px] leading-7 text-slate-500">شروع با <code dir="ltr" className="font-bold text-sky-800">/start</code> و سپس اعلام رضایت با <code dir="ltr" className="font-bold text-sky-800">/agree</code><br />پاک‌کردن حافظه برنامه با <code dir="ltr" className="font-bold text-sky-800">/forget</code></div>{status?.telegram.url ? <a href={status.telegram.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-xs font-black text-white transition-colors hover:bg-sky-700">باز کردن ربات در تلگرام<ArrowUpLeft className="h-4 w-4" /></a> : <p className="rounded-xl border border-dashed border-sky-300 px-3 py-3 text-center text-[11px] leading-6 text-sky-800">پس از تنظیم توکن و نام کاربری ربات، لینک آن اینجا ظاهر می‌شود.</p>}</div></Reveal>
          <Reveal delay={0.08}><div className="rounded-[26px] bg-white p-6 ring-1 ring-stone-200/80"><ShieldCheck className="h-6 w-6 text-teal-700" /><h2 className="mt-3 text-sm font-black text-slate-900">حریم خصوصی، با توضیح روشن</h2><p className="mt-2 text-xs leading-7 text-slate-500">گفتگوی وب فقط در حافظه همین صفحه می‌ماند؛ با خروج از صفحه پاک می‌شود. برای پاسخ، بخش اخیر گفتگو به مدل فرستاده می‌شود. نگهداری داده نزد Hugging Face، ارائه‌دهنده مدل و تلگرام تابع سیاست‌های خود آن‌هاست.</p><p className="mt-3 text-[11px] leading-7 text-slate-400">دکمه پاک‌کردن، سابقه این صفحه را حذف می‌کند؛ نه داده‌ای که قبلاً به ارائه‌دهنده ارسال شده است.</p></div></Reveal>
          <Reveal delay={0.12}><div className="rounded-[26px] border border-dashed border-stone-300 p-6"><BookOpen className="h-6 w-6 text-amber-600" /><h2 className="mt-3 text-sm font-black text-slate-900">یک قدم فراتر از گفتگو</h2><p className="mt-2 text-xs leading-7 text-slate-500">مرکز دانش را برای آشنایی با مفاهیم مرور کنید و سؤال‌های شخصی را با متخصص واجد صلاحیت مطرح کنید. در خطر فوری با خدمات اضطراری محل زندگی تماس بگیرید.</p><button onClick={() => go("hub")} className="mt-4 flex items-center gap-2 text-xs font-black text-teal-800">رفتن به مرکز دانش<ArrowLeft className="h-4 w-4" /></button></div></Reveal>
          <p className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400"><MessageCircle className="h-3.5 w-3.5" /> آموزشی، محترمانه، بدون برچسب‌گذاری</p>
        </aside>
      </div>
      <button onClick={() => { reset(); textarea.current?.focus(); }} className="mx-auto mt-7 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-teal-800 hover:bg-teal-50"><Plus className="h-4 w-4" />یک گفتگوی تازه</button>
    </div>
  );
}
