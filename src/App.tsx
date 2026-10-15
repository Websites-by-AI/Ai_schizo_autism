import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Bot } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CountryPage from "./pages/CountryPage";
import AutismHub from "./pages/AutismHub";
import AiLab from "./pages/AiLab";
import NewsRoom from "./pages/NewsRoom";
import FamilyMap from "./pages/FamilyMap";
import PathFinder from "./pages/PathFinder";
import Community from "./pages/Community";
import Room from "./pages/Room";
import SeasonPlan from "./pages/SeasonPlan";
import Collaborate from "./pages/Collaborate";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import type { CountryId } from "./data/site";

const PAGES = new Set(["home", "country", "hub", "ailab", "news", "familymap", "pathfinder", "community", "room", "season", "collaborate", "services", "about", "contact"]);
const COUNTRIES = new Set(["germany", "turkey", "iran"]);

function readRoute(): { page: string; countryId: CountryId } {
  const route = window.location.hash.slice(1) || window.location.pathname.slice(1);
  const [candidate, country] = route.replace(/^\//, "").split("/");
  return { page: PAGES.has(candidate) ? candidate : "home", countryId: (COUNTRIES.has(country) ? country : "germany") as CountryId };
}

export default function App() {
  const [{ page, countryId }, setRoute] = useState(readRoute);
  const [showTop, setShowTop] = useState(false);

  const go = useCallback((next: string, cId?: string) => {
    const safePage = PAGES.has(next) ? next : "home";
    const country = cId && COUNTRIES.has(cId) ? cId : "germany";
    const hash = `#${safePage}${safePage === "country" ? "/" + country : ""}`;
    if (window.location.hash === hash) setRoute(readRoute());
    else window.location.hash = hash;
  }, []);

  useEffect(() => {
    const changed = () => setRoute(readRoute());
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [page, countryId]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "country":
        return <CountryPage key={`country-${countryId}`} countryId={countryId} go={go} />;
      case "hub":
        return <AutismHub go={go} />;
      case "ailab":
        return <AiLab go={go} />;
      case "news":
        return <NewsRoom go={go} />;
      case "familymap":
        return <FamilyMap go={go} />;
      case "pathfinder":
        return <PathFinder go={go} />;
      case "community":
        return <Community go={go} />;
      case "room":
        return <Room go={go} />;
      case "season":
        return <SeasonPlan go={go} />;
      case "collaborate":
        return <Collaborate go={go} />;
      case "services":
        return <Services go={go} />;
      case "about":
        return <About go={go} />;
      case "contact":
        return <Contact />;
      default:
        return <Home go={go} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <Navbar page={page} go={go} />
      <AnimatePresence mode="wait">
        <motion.main
          key={page + (page === "country" ? countryId : "")}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
      <Footer go={go} />
      {page !== "ailab" && (
        <button onClick={() => go("ailab")} aria-label="باز کردن دستیار آموزشی" className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full bg-pine px-4 py-3.5 text-xs font-black text-white shadow-xl ring-1 ring-white/20 transition-colors hover:bg-teal-800">
          <Bot className="h-5 w-5" /><span className="hidden sm:inline">پرسش از دستیار</span>
        </button>
      )}

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="بازگشت به بالا"
            className="fixed bottom-6 left-6 z-50 grid h-12 w-12 place-items-center rounded-full bg-teal-700 text-white shadow-2xl shadow-teal-900/40 transition-colors hover:bg-teal-800"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
