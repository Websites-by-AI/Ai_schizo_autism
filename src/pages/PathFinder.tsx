import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Briefcase, Building2, CalendarCheck, CheckCircle2,
  Clock3, FileCheck2, Flag, Gauge, GraduationCap, HandHeart, HeartHandshake, Languages,
  MapPin, MessagesSquare, RotateCcw, Route, Sparkles, Stethoscope, Target,
} from "lucide-react";
import { COUNTRIES, type CountryId } from "../data/site";
import { Meter, Reveal, SectionHead, faNum, type GoFn } from "../components/ui";

type RoleId = "ot" | "speech" | "psych" | "educator" | "parent" | "founder" | "student";
type DestId = CountryId | "undecided";
type LangId = "none" | "a2" | "b1" | "b2";
type GoalId = "employment" | "ausbildung" | "business" | "skill";

interface Answers { role?: RoleId; dest?: DestId; lang?: LangId; goal?: GoalId; }
interface RStep { t: string; d: string; m: [number, number]; }

const ROLE_OPTIONS: { id: RoleId; label: string; desc: string; icon: typeof Stethoscope }[] = [
  { id: "ot", label: "کاردرمانگر", desc: "ذهنی، حسی یا جسمی", icon: Stethoscope },
  { id: "speech", label: "گفتاردرمانگر", desc: "زبان و ارتباط کودک", icon: MessagesSquare },
  { id: "psych", label: "روانشناس", desc: "بالینی، کودک یا تربیتی", icon: BookOpen },
  { id: "educator", label: "مربی / معلم آموزش ویژه", desc: "ABA، سایه و آموزش استثنایی", icon: GraduationCap },
  { id: "parent", label: "والد / خانواده", desc: "به دنبال خدمات برای فرزندم", icon: HeartHandshake },
  { id: "founder", label: "کارآفرین سلامت", desc: "قصد تأسیس مرکز دارم", icon: Building2 },
  { id: "student", label: "دانشجو / تازه‌کار", desc: "هنوز مدرک تخصصی ندارم", icon: BookOpen },
];

const DEST_OPTIONS: { id: DestId; label: string; desc: string }[] = [
  { id: "germany", label: "آلمان", desc: "درآمد و امنیت بالا، مسیر قانون‌مند" },
  { id: "turkey", label: "ترکیه · استانبول", desc: "شروع سریع‌تر، نزدیکی فرهنگی" },
  { id: "iran", label: "ایران", desc: "پیشرفت یا تأسیس مرکز در کشور خودم" },
  { id: "undecided", label: "هنوز مطمئن نیستم", desc: "پیشنهاد مسیر‌یاب را می‌خواهم" },
];

const LANG_OPTIONS: { id: LangId; label: string; desc: string }[] = [
  { id: "none", label: "شروع نکرده‌ام", desc: "از صفر باید شروع کنم" },
  { id: "a2", label: "مقدماتی (A1–A2)", desc: "جملات ساده را می‌فهمم" },
  { id: "b1", label: "متوسط (B1)", desc: "مکالمه روزمره را مدیریت می‌کنم" },
  { id: "b2", label: "خوب (B2 به بالا)", desc: "مدرک زبان دارم یا نزدیک آنم" },
];

const GOAL_OPTIONS: { id: GoalId; label: string; desc: string; icon: typeof Briefcase }[] = [
  { id: "employment", label: "استخدام در کلینیک / مرکز", desc: "کار درمانی با قرارداد رسمی", icon: Briefcase },
  { id: "ausbildung", label: "آوسبیلدونگ / تحصیل", desc: "آموزش همراه با حقوق در آلمان", icon: GraduationCap },
  { id: "business", label: "تأسیس مرکز شخصی", desc: "راه‌اندازی مرکز توانبخشی یا مشاوره", icon: Building2 },
  { id: "skill", label: "یادگیری متد و پیشرفت شغلی", desc: "بدون مهاجرت؛ ارتقای تخصص", icon: Award },
];

const fmtMonths = (m: [number, number]) =>
  m[0] === m[1] ? (m[0] === 0 ? "همزمان" : `${faNum(m[0])} ماه`) : `${faNum(m[0])} تا ${faNum(m[1])} ماه`;

function langStep(dest: CountryId, lang: LangId): RStep | null {
  if (dest === "iran") return { t: "تقویت انگلیسی تخصصی (موازی با کار)", d: "دسترسی به منابع اصلی متدها و ساخت مزیت رقابتی برای آینده؛ مانع شروع مسیر نیست.", m: [2, 3] };
  const table: Record<string, Record<LangId, RStep>> = {
    germany: {
      none: { t: "یادگیری زبان آلمانی تا B2", d: "دوره فشرده روزانه؛ مهم‌ترین و زمان‌برترین گام. از همین هفته شروع کنید.", m: [10, 14] },
      a2: { t: "ادامه زبان آلمانی از A2 تا B2", d: "تمرکز بر مهارت مکالمه درمانی و آمادگی آزمون گوته/telc.", m: [6, 9] },
      b1: { t: "رسیدن از B1 به B2 + شروع C1 تخصصی", d: "همزمان با آماده‌سازی مدارک می‌توانید این مرحله را پیش ببرید.", m: [4, 6] },
      b2: { t: "تثبیت B2 و آماده‌سازی C1 تخصصی", d: "واژگان گزارش‌نویسی و جلسه تیمی؛ مزیت بزرگ شما در مصاحبه‌ها.", m: [1, 3] },
    },
    turkey: {
      none: { t: "یادگیری زبان ترکی تا سطح بالا (C1)", d: "برای آزمون STS و کار بالینی ضروری است؛ برای فارسی‌زبانان سریع‌تر از میانگین پیش می‌رود.", m: [7, 10] },
      a2: { t: "ادامه ترکی استانبولی تا C1 (TÖMER)", d: "تمرکز همزمان بر واژگان تخصصی سلامت و آموزش.", m: [4, 6] },
      b1: { t: "رسیدن به C1 و آمادگی آزمون STS", d: "حل نمونه‌سؤالات تخصصی سال‌های قبل را در برنامه بگذارید.", m: [3, 5] },
      b2: { t: "تکمیل C1 تخصصی", d: "مکالمه با خانواده‌ها و مستندنویسی پرونده به ترکی.", m: [1, 2] },
    },
  };
  return table[dest][lang];
}

function buildRoadmap(a: Required<Answers>, dest: CountryId): RStep[] {
  const steps: RStep[] = [];
  if (a.role === "parent") {
    steps.push(
      { t: "ارزیابی جامع و به‌روز کودک", d: "ارزیابی چندرشته‌ای (روانشناس، کاردرمانگر، گفتاردرمانگر) و تدوین پروفایل قوت و نیاز کودک؛ پایه همه تصمیم‌های بعدی.", m: [1, 1] },
      { t: "انتخاب متد و مرکز مناسب در مقصد", d: dest === "iran" ? "انتخاب مرکز دارای مجوز با برنامه IEP شفاف در شهر شما." : "شناسایی مراکز اوتیسم و مدارس فراگیر مقصد و شرایط پذیرش کودک مهاجر.", m: [1, 2] },
      { t: "برنامه آموزش والدین", d: "دوره مدل دنور یا فلورتایم برای والدین تا خانه به ادامه طبیعی درمان تبدیل شود.", m: [2, 3] },
      ...(dest !== "iran"
        ? [{ t: "امور اقامت خانواده و ثبت‌نام مدرسه/مهد", d: "ویزای پیوند خانواده، بیمه درمانی کودک و فرآیند ثبت‌نام در مدرسه یا مرکز مقصد.", m: [2, 4] } as RStep]
        : [{ t: "اتصال به انجمن والدین و گروه‌های حمایتی", d: "شبکه والدین هم‌تجربه، هزینه پنهان درمان را کم و تاب‌آوری خانواده را بالا می‌برد.", m: [1, 1] } as RStep]),
    );
    return steps;
  }

  const ls = langStep(dest, a.lang);
  if (ls && a.goal !== "skill") steps.push(ls);

  if (a.goal === "ausbildung") {
    if (dest !== "germany") steps.push({ t: "نکته مهم: آوسبیلدونگ مسیر آلمان است", d: "این مدل کارآموزی همراه با حقوق در آلمان تعریف شده؛ نقشه زیر بر مبنای آلمان ساخته شده است.", m: [0, 0] });
    steps.push(
      { t: "اپلای برای مدارس فنی (Berufsfachschule)", d: "رشته‌های Ergotherapie یا Heilerziehungspflege؛ ارسال مدرک دیپلم معادل‌سازی‌شده و انگیزه‌نامه.", m: [2, 4] },
      { t: "مصاحبه و دریافت قرارداد آوسبیلدونگ", d: "بسیاری از مدارس و مؤسسات حامل (Träger) در مصاحبه آنلاین هم نیرو می‌پذیرند.", m: [1, 3] },
      { t: "ویزای آوسبیلدونگ و ورود به آلمان", d: "با قرارداد و مدرک زبان B1/B2؛ امکان کار جانبی محدود هم وجود دارد.", m: [2, 3] },
      { t: "دوره ۳ ساله همراه با حقوق ماهانه", d: "حقوق ۱٬۱۰۰ تا ۱٬۳۰۰ یورو در ماه و استخدام تقریباً تضمینی پس از پایان دوره.", m: [36, 36] },
    );
    return steps;
  }

  if (a.goal === "business") {
    if (dest === "turkey") steps.push(
      { t: "امکان‌سنجی و انتخاب محله در استانبول", d: "تحلیل تراکم مراکز رقیب، جمعیت خانواده‌های مهاجر و اجاره ملک با کاربری آموزشی.", m: [1, 1] },
      { t: "ثبت شرکت (Ltd. Şti.) و امور مالیاتی", d: "ثبت با پاسپورت در ۵ تا ۱۰ روز کاری؛ افتتاح حساب و تعیین حسابدار رسمی (Mali Müşavir).", m: [0, 1] },
      { t: "اخذ مجوز فعالیت (MEB / مشاوره خانواده)", d: "متناسب با نوع مرکز: آموزش خصوصی، توانبخشی یا مشاوره؛ بازدید و تأیید استاندارد فضا.", m: [2, 4] },
      { t: "تجهیز مرکز و استخدام تیم درمان", d: "اتاق حسی، اتاق‌های درمان فردی و تیم چندرشته‌ای؛ مزیت شما: خدمات دوزبانه فارسی-ترکی.", m: [2, 3] },
      { t: "شروع جذب مراجع و قرارداد با مراکز ارجاع‌دهنده", d: "همکاری با مدارس بین‌المللی و انجمن‌های والدین مهاجر از ماه اول.", m: [1, 2] },
    );
    else if (dest === "iran") steps.push(
      { t: "دریافت پروانه اشتغال تخصصی", d: "از سازمان نظام روانشناسی یا نظام پزشکی؛ پیش‌شرط همه مراحل بعد.", m: [1, 3] },
      { t: "درخواست مجوز مرکز از بهزیستی استان", d: "ارائه طرح توجیهی، معرفی مسئول فنی و مشخصات ملک؛ پیگیری از معاونت توانبخشی.", m: [2, 4] },
      { t: "تأمین فضا و تجهیز اتاق حسی استاندارد", d: "بزرگ‌ترین مزیت رقابتی شما در بازار؛ طبق چک‌لیست استاندارد پل اوتیسم تجهیز کنید.", m: [2, 3] },
      { t: "جذب تیم درمان و تدوین پروتکل ارزیابی", d: "کاردرمانگر، گفتاردرمانگر و مربی ABA با سوپرویژن منظم هفتگی.", m: [1, 2] },
      { t: "بازدید نهایی، صدور پروانه و شروع پذیرش", d: "قرارداد با مدارس استثنایی و بیمه‌ها مسیر ارجاع پایدار می‌سازد.", m: [1, 2] },
    );
    else steps.push(
      { t: "واقعیت‌سنجی: تأسیس مستقیم در آلمان دشوار است", d: "برای تازه‌واردان، مسیر منطقی ابتدا استخدام و شناخت سیستم بیمه و ارجاع آلمان است.", m: [0, 0] },
      { t: "معادلسازی مدرک و استخدام در مرکز آلمانی", d: "همان مسیر Anerkennung؛ ۱ تا ۲ سال تجربه داخلی، سرمایه اصلی تأسیس آینده است.", m: [12, 24] },
      { t: "شراکت یا تأسیس Praxis با شریک آلمانی", d: "با سابقه داخلی و شبکه ارجاع، تأسیس درمانگاه خصوصی (Praxis) واقع‌بینانه می‌شود.", m: [6, 12] },
    );
    return steps;
  }

  if (a.goal === "skill") {
    steps.push(
      { t: "انتخاب متد هدف بر اساس کیس‌های فعلی شما", d: "ABA و دنور برای مداخله زودهنگام؛ یکپارچگی حسی برای کاردرمانگران؛ PECS برای گفتاردرمانگران.", m: [0, 1] },
      { t: "دوره تخصصی استاندارد (آنلاین/حضوری)", d: "دوره‌های دارای ساعت آموزشی مشخص و مدرک معتبر؛ از دوره‌های بدون سوپرویژن پرهیز کنید.", m: [2, 4] },
      { t: "سوپرویژن و کارورزی روی کیس واقعی", d: "حداقل ۳ تا ۶ ماه اجرای متد زیر نظر سوپروایزر؛ جایی که مهارت واقعی ساخته می‌شود.", m: [3, 6] },
      { t: "مستندسازی و ساخت برند تخصصی", d: "گزارش پیشرفت داده‌محور برای خانواده‌ها؛ سکوی پرش شما برای مرکز شخصی یا مهاجرت آینده.", m: [2, 3] },
    );
    return steps;
  }

  // employment
  if (dest === "germany") steps.push(
    { t: "ترجمه رسمی مدارک و بررسی Anabin", d: "ترجمه قسم‌خورده مدرک و ریزنمرات؛ وضعیت دانشگاه شما مسیر پرونده را مشخص می‌کند.", m: [1, 2] },
    { t: "ثبت و پیگیری پرونده Anerkennung", d: "ارسال به اداره ایالت مقصد و دریافت Bescheid (کامل یا جزئی).", m: [2, 4] },
    { t: "دوره تطبیقی یا آزمون دانش (در صورت کسری)", d: "Anpassungslehrgang تحت نظارت یا Kenntnisprüfung؛ با آمادگی هدفمند قابل مدیریت است.", m: [3, 9] },
    { t: "جستجوی کار و قرارداد با مرکز اوتیسم", d: "مصاحبه با Autismus-Zentren و مؤسسات بزرگ؛ رزومه Europass آلمانی آماده کنید.", m: [1, 3] },
    { t: "ویزای نیروی متخصص و ورود", d: "شروع کار، Anmeldung و آغاز مسیر اقامت دائم.", m: [2, 3] },
  );
  else if (dest === "turkey") steps.push(
    { t: "ترجمه رسمی و معادلسازی YÖK", d: "ثبت مدارک در سامانه شورای آموزش عالی ترکیه و دریافت نامه معادلسازی.", m: [2, 4] },
    { t: "قبولی در آزمون STS (رشته‌های سلامت)", d: "با بانک سؤالات تخصصی ترکی و دوره آمادگی ۳ تا ۶ ماهه.", m: [2, 4] },
    { t: "قرارداد با مرکز خصوصی و مجوز کار", d: "کارفرما درخواست Çalışma İzni را ثبت می‌کند؛ مراکز استانبول فعالانه نیرو می‌گیرند.", m: [1, 2] },
    { t: "شروع کار و تثبیت اقامت کاری", d: "بیمه SGK از روز اول؛ تمدید سالانه مجوز و اقامت.", m: [0, 1] },
  );
  else steps.push(
    { t: "تکمیل رزومه بالینی ساخت‌یافته", d: "مستندسازی کیس‌ها با قالب بین‌المللی (ارزیابی، هدف، داده پیشرفت)؛ سرمایه آینده شما.", m: [1, 2] },
    { t: "ورود به مرکز معتبر و سوپرویژن منظم", d: "مراکزی با تیم چندرشته‌ای و جلسه کیس هفتگی انتخاب کنید، نه صرفاً حقوق بالاتر.", m: [1, 2] },
    { t: "تخصص در یک متد پرتقاضا", d: "ABA، دنور یا یکپارچگی حسی؛ تخصص عمیق در یک متد، شما را از بازار عمومی جدا می‌کند.", m: [3, 6] },
    { t: "حرکت به سمت مسئولیت فنی یا مرکز شخصی", d: "با سابقه و امتیاز لازم، مسیر مجوز بهزیستی و تأسیس مرکز باز می‌شود.", m: [6, 12] },
  );
  return steps;
}

function recommendDest(a: Answers): { dest: CountryId; reason: string } {
  if (a.dest && a.dest !== "undecided") {
    const c = COUNTRIES.find((x) => x.id === a.dest)!;
    return { dest: a.dest, reason: `مقصد انتخابی شما: ${c.name}` };
  }
  if (a.goal === "ausbildung") return { dest: "germany", reason: "آوسبیلدونگ فقط در آلمان تعریف شده و بهترین ورود بدون مدرک دانشگاهی است." };
  if (a.goal === "business") return { dest: "turkey", reason: "برای تأسیس سریع مرکز با سرمایه متوسط، استانبول تعادل بهتری از سرعت، هزینه و بازار دارد؛ ایران گزینه کم‌هزینه‌تر خانگی است." };
  if (a.goal === "skill") return { dest: "iran", reason: "برای یادگیری متد بدون مهاجرت، اجرای عملی در محیط کاری فعلی ایران سریع‌ترین بازده را دارد." };
  if (a.role === "parent") return { dest: "germany", reason: "کامل‌ترین پوشش بیمه‌ای و شبکه مدارس فراگیر برای خانواده‌ها در آلمان است؛ ترکیه گزینه نزدیک‌تر فرهنگی است." };
  if (a.lang === "b2" || a.lang === "b1") return { dest: "germany", reason: "با سطح زبان فعلی شما، آلمان بالاترین بازده بلندمدت (حقوق، امنیت، اقامت) را می‌دهد." };
  return { dest: "germany", reason: "پیشنهاد ما آلمان است؛ اما چون زبان از صفر شروع می‌شود، ترکیه مسیر موازی سریع‌تری است که در مشاوره مقایسه می‌کنیم." };
}

const QUESTIONS = [
  { key: "role", title: "نقش شما در دنیای اوتیسم چیست؟", sub: "نزدیک‌ترین گزینه را انتخاب کنید" },
  { key: "dest", title: "مقصد ایده‌آل شما کجاست؟", sub: "اگر مردد هستید، گزینه آخر را بزنید؛ ما پیشنهاد می‌دهیم" },
  { key: "lang", title: "سطح زبان مقصدتان الان چقدر است؟", sub: "آلمانی برای آلمان، ترکی برای ترکیه" },
  { key: "goal", title: "هدف اصلی‌تان چیست؟", sub: "در ۱۲ تا ۲۴ ماه آینده به چه چیزی می‌خواهید برسید؟" },
] as const;

export default function PathFinder({ go }: { go: GoFn }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);

  const rec = useMemo(() => recommendDest(answers), [answers]);
  const destCountry = COUNTRIES.find((c) => c.id === rec.dest) ?? COUNTRIES[0];

  const roadmap = useMemo(() => {
    if (!answers.role || !answers.lang || !answers.goal) return [];
    return buildRoadmap(
      { role: answers.role, dest: rec.dest, lang: answers.lang, goal: answers.goal },
      rec.dest
    );
  }, [answers, rec.dest]);

  const total: [number, number] = roadmap.reduce(
    (acc, s) => [acc[0] + s.m[0], acc[1] + s.m[1]],
    [0, 0] as [number, number]
  );

  const readiness = useMemo(() => {
    const langPts = { none: 5, a2: 15, b1: 26, b2: 36 }[answers.lang ?? "none"];
    const rolePts = { ot: 34, speech: 34, psych: 34, educator: 29, founder: 26, student: 14, parent: 20 }[answers.role ?? "student"];
    return Math.min(95, langPts + rolePts + 18);
  }, [answers]);

  const difficulty =
    rec.dest === "germany" && answers.goal !== "skill"
      ? { t: "بالا — اما با بازده بالا", c: "text-rose-600", v: 82 }
      : rec.dest === "turkey"
        ? { t: "متوسط — شروع سریع‌تر", c: "text-amber-600", v: 55 }
        : { t: "قابل مدیریت — شروع فوری", c: "text-emerald-600", v: 34 };

  const pick = (key: keyof Answers, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) setStep(step + 1);
      else setFinished(true);
    }, 260);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setFinished(false);
  };

  const currentQ = QUESTIONS[step];

  const renderOptions = () => {
    switch (currentQ.key) {
      case "role":
        return ROLE_OPTIONS.map((o) => (
          <OptionCard key={o.id} active={answers.role === o.id} onClick={() => pick("role", o.id)} icon={<o.icon className="h-6 w-6" />} title={o.label} desc={o.desc} />
        ));
      case "dest":
        return DEST_OPTIONS.map((o) => (
          <OptionCard
            key={o.id}
            active={answers.dest === o.id}
            onClick={() => pick("dest", o.id)}
            icon={<MapPin className="h-6 w-6" />}
            title={o.label}
            desc={o.desc}
            badge={o.id !== "undecided" ? COUNTRIES.find((c) => c.id === o.id)?.code : undefined}
          />
        ));
      case "lang":
        return LANG_OPTIONS.map((o) => (
          <OptionCard key={o.id} active={answers.lang === o.id} onClick={() => pick("lang", o.id)} icon={<Languages className="h-6 w-6" />} title={o.label} desc={o.desc} />
        ));
      case "goal":
        return GOAL_OPTIONS.map((o) => (
          <OptionCard key={o.id} active={answers.goal === o.id} onClick={() => pick("goal", o.id)} icon={<o.icon className="h-6 w-6" />} title={o.label} desc={o.desc} />
        ));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-[132px] lg:px-6 lg:pt-[148px]">
      <SectionHead
        badge="مسیر‌یاب هوشمند"
        title="در ۴ سؤال، نقشه راه شخصی شما ساخته می‌شود"
        desc="بر اساس رشته، مقصد، سطح زبان و هدفتان؛ همراه با برآورد زمان، سطح دشواری و اولین قدم عملی."
      />

      {!finished ? (
        <Reveal className="mx-auto mt-12 max-w-3xl pb-24">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-30px_rgba(12,59,57,0.4)] ring-1 ring-stone-200/80">
            {/* progress */}
            <div className="bg-pine px-7 py-6">
              <div className="flex items-center justify-between text-[12.5px] font-bold text-teal-200">
                <span className="flex items-center gap-2"><Route className="h-4 w-4 text-amber-400" /> سؤال {faNum(step + 1)} از {faNum(QUESTIONS.length)}</span>
                <span>{faNum(Math.round(((step) / QUESTIONS.length) * 100))}٪</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                <motion.div className="h-full rounded-full bg-amber-400" animate={{ width: `${(step / QUESTIONS.length) * 100}%` }} transition={{ duration: 0.4 }} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {QUESTIONS.map((q, i) => (
                  <span key={q.key} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-bold ring-1 ${i < step ? "bg-teal-500/25 text-teal-100 ring-teal-400/40" : i === step ? "bg-amber-500 text-pine ring-amber-300" : "bg-white/5 text-slate-400 ring-white/10"}`}>
                    {i < step && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {["نقش شما", "مقصد", "زبان", "هدف"][i]}
                  </span>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.3 }}
                className="px-7 py-8"
              >
                <h2 className="text-xl font-black text-slate-900 md:text-2xl">{currentQ.title}</h2>
                <p className="mt-1.5 text-[13.5px] text-slate-500">{currentQ.sub}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">{renderOptions()}</div>
                <div className="mt-7 flex items-center justify-between">
                  <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold text-slate-500 transition-all enabled:hover:bg-cream disabled:opacity-30"
                  >
                    <ArrowRight className="h-4 w-4" /> سؤال قبل
                  </button>
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400">
                    <Sparkles className="h-4 w-4 text-amber-500" /> با انتخاب هر گزینه، خودکار جلو می‌روید
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      ) : (
        <div className="pb-24">
          {/* result summary */}
          <Reveal className="mx-auto mt-12 max-w-5xl">
            <div className="overflow-hidden rounded-[28px] bg-pine text-white shadow-2xl">
              <div className="grid md:grid-cols-5">
                <div className="relative min-h-[220px] md:col-span-2">
                  <img src={destCountry.image} alt={destCountry.name} className="absolute inset-0 h-full w-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-pine/35" />
                  <div className="absolute bottom-5 right-5">
                    <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-bold ring-1 ring-white/30 backdrop-blur">مقصد پیشنهادی</span>
                    <p className="mt-2.5 text-3xl font-black">{destCountry.name}</p>
                    <p className="text-[13px] font-semibold text-teal-100">{destCountry.cities}</p>
                  </div>
                </div>
                <div className="p-7 md:col-span-3 md:p-8">
                  <h2 className="flex items-center gap-2.5 text-xl font-black">
                    <Flag className="h-6 w-6 text-amber-400" /> نقشه راه شخصی شما آماده است
                  </h2>
                  <p className="mt-3 text-[13.5px] leading-8 text-teal-50/90">{rec.reason}</p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/[0.07] px-3 py-3.5 text-center ring-1 ring-white/12">
                      <Clock3 className="mx-auto h-5 w-5 text-amber-400" />
                      <p className="mt-1.5 text-[15px] font-black">{faNum(total[0])} تا {faNum(total[1])} ماه</p>
                      <p className="text-[11px] text-slate-300">برآورد کل مسیر</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.07] px-3 py-3.5 text-center ring-1 ring-white/12">
                      <Gauge className="mx-auto h-5 w-5 text-amber-400" />
                      <p className={`mt-1.5 text-[13px] font-black leading-5 ${difficulty.c.replace("600", "300")}`}>{difficulty.t}</p>
                      <p className="text-[11px] text-slate-300">سطح دشواری</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.07] px-3 py-3.5 text-center ring-1 ring-white/12">
                      <Target className="mx-auto h-5 w-5 text-amber-400" />
                      <p className="mt-1.5 text-[15px] font-black">{faNum(readiness)}٪</p>
                      <p className="text-[11px] text-slate-300">آمادگی فعلی شما</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-[11.5px] font-bold text-slate-300">
                      <span>امتیاز آمادگی (زبان + تخصص)</span>
                      <span>{faNum(readiness)} از ۱۰۰</span>
                    </div>
                    <Meter value={readiness} color="bg-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* timeline */}
          <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Reveal>
                <h3 className="flex items-center gap-2.5 text-lg font-black text-slate-900">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white"><Route className="h-5 w-5" /></span>
                  گام‌های شما به ترتیب اجرا
                </h3>
              </Reveal>
              <div className="relative mt-7 space-y-4 before:absolute before:bottom-3 before:right-[21px] before:top-3 before:w-px before:bg-stone-300/80">
                {roadmap.map((s, i) => (
                  <Reveal key={s.t} delay={i * 0.06}>
                    <div className="relative flex gap-4">
                      <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-700 text-[15px] font-black text-white ring-4 ring-cream">
                        {faNum(i + 1)}
                      </span>
                      <div className="flex-1 rounded-3xl bg-white p-5 ring-1 ring-stone-200/75">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-[15px] font-black text-slate-900">{s.t}</h4>
                          <span className="rounded-full bg-sand px-3 py-1 text-[11.5px] font-black text-slate-600">{fmtMonths(s.m)}</span>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-7.5 text-slate-600">{s.d}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <Reveal delay={0.1}>
                <div className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/80">
                  <h3 className="flex items-center gap-2.5 text-[16px] font-black text-slate-900">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-white"><FileCheck2 className="h-5 w-5" /></span>
                    مدارک کلیدی این مسیر
                  </h3>
                  <ul className="mt-5 space-y-2.5">
                    {destCountry.documents.slice(0, 6).map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-[13px] font-semibold leading-6 text-slate-700">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal-600" /> {d}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => go("country", destCountry.id)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cream py-3 text-[13px] font-black text-teal-800 ring-1 ring-stone-200 transition-colors hover:ring-teal-600/40">
                    چک‌لیست کامل در راهنمای {destCountry.name} <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="mt-5 rounded-3xl bg-teal-800 p-6 text-white">
                  <HandHeart className="h-8 w-8 text-amber-400" />
                  <h3 className="mt-3 text-[16px] font-black">اولین قدم عملی شما (همین هفته)</h3>
                  <p className="mt-2 text-[13.5px] leading-8 text-teal-50/90">
                    {answers.lang === "none" || answers.lang === "a2"
                      ? `ثبت‌نام در دوره زبان ${rec.dest === "turkey" ? "ترکی" : rec.dest === "germany" ? "آلمانی" : "انگلیسی تخصصی"} و تعیین سطح رسمی؛ هر ماه تأخیر در زبان، یعنی یک ماه تأخیر در کل مسیر.`
                      : "رزرو جلسه ارزیابی پرونده تا مدارکتان پیش از ترجمه و ارسال، یک بار توسط متخصص بررسی شود؛ اصلاح زودهنگام، ماه‌ها صرفه‌جویی است."}
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <button onClick={() => go("services")} className="flex items-center justify-center gap-2 rounded-full bg-amber-500 py-3 text-sm font-black text-pine transition-colors hover:bg-amber-400">
                      <CalendarCheck className="h-4 w-4" /> رزرو مشاوره با همین نقشه راه
                    </button>
                    <button onClick={reset} className="flex items-center justify-center gap-2 rounded-full bg-white/10 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition-colors hover:bg-white/20">
                      <RotateCcw className="h-4 w-4" /> ساخت مسیر جدید
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionCard({
  active, onClick, icon, title, desc, badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-4 rounded-2xl p-4.5 text-start ring-1 transition-all duration-200 ${
        active
          ? "bg-teal-700/[0.07] ring-2 ring-teal-600"
          : "bg-cream ring-stone-200/80 hover:bg-teal-700/[0.04] hover:ring-teal-600/40"
      }`}
    >
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors ${active ? "bg-teal-700 text-white" : "bg-white text-teal-700 ring-1 ring-stone-200 group-hover:ring-teal-600/30"}`}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-[14.5px] font-black text-slate-800">
          {title}
          {badge && <span dir="ltr" className="rounded-md bg-pine px-1.5 py-0.5 text-[10px] font-black text-white">{badge}</span>}
        </span>
        <span className="mt-0.5 block text-[12px] leading-5.5 text-slate-500">{desc}</span>
      </span>
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all ${active ? "bg-teal-700 text-white" : "bg-white text-transparent ring-1 ring-stone-300"}`}>
        <CheckCircle2 className="h-4 w-4" />
      </span>
    </button>
  );
}
