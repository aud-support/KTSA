import { motion } from "motion/react";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Medal,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router";
import { TopPlayersStack } from "../components/ui/TopPlayersStack";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useEffect, useState, useRef, useCallback } from "react";
import logo from "../../assets/LOGO gif.gif";
import april from "../../assets/april-25-2026.jpg";
import april1 from "../../assets/april-2026.jpg";
import jan from "../../assets/jan-2026.jpg";
import march from "../../assets/march-2026.jpg";
import image1 from "../../assets/ktsa-image10.jpg";
import image2 from "../../assets/ktsa-image7.jpg";
import image3 from "../../assets/ktsa-image11.jpg";

const tournaments = [
  {
    id: 1,
    title: "Karnataka Open",
    date: "25th April, 2026",
    location: "Bengaluru",
    status: "Upcoming",
    image: april,
  },
  {
    id: 2,
    title: "Women's Foosball",
    date: "25th April, 2026",
    location: "Near Silkboard, Bengaluru",
    status: "Upcoming",
    image: april1,
  },
  {
    id: 3,
    title: "Bengaluru Foosball Tournament",
    date: "31 January, 2026",
    location: "Whitefield, Bengaluru",
    status: "Completed",
    image: jan,
  },
  {
    id: 4,
    title: "Bengaluru Foosball Tournament",
    date: "29th March, 2026",
    location: "Kormangala, Bengaluru",
    status: "Completed",
    image: march,
  },
];

const CARD_W = 288;
const CARD_GAP = 24;
const CARD_STEP = CARD_W + CARD_GAP;
const CLONE_COUNT = tournaments.length;
const LOOP_WIDTH = CLONE_COUNT * CARD_STEP;

const infiniteTournaments = [
  ...tournaments.map((t) => ({ ...t, _key: "pre-" + t.id })),
  ...tournaments.map((t) => ({ ...t, _key: "mid-" + t.id })),
  ...tournaments.map((t) => ({ ...t, _key: "post-" + t.id })),
];
const pillars = [
  {
    id: 1,
    title: "Structure",
    description: "Giving the sport a stronger foundation",
    content:
      "KTSA brings order and consistency through organized tournaments, rankings, and a stronger competitive framework.",
  },
  {
    id: 2,
    title: "Opportunity",
    description: "Creating pathways for players",
    content:
      "KTSA creates pathways for players of all ages to participate, develop, compete, and progress in the sport.",
  },
  {
    id: 3,
    title: "Recognition",
    description: "Building visibility for foosball",
    content:
      "KTSA is helping foosball earn the credibility and legitimacy it deserves as a serious and growing sport.",
  },
  {
    id: 4,
    title: "Growth",
    description: "Expanding the ecosystem with intent",
    content:
      "KTSA continues to grow the sport through clubs, tournaments, community engagement, and educational institutions.",
  },
];
const trainingAndDevelopment = [
  {
    id: "01",
    title: "Player Training",
    description:
      "Learn the game, improve your technique, and build the confidence you need for structured competition at every level.",
    ctatext: "Join a Training Program",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 stroke-ktsa-text fill-none stroke-[1.7] stroke-linecap-round stroke-linejoin-round"
      >
        <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z" />
        <path d="M20 21a8 8 0 1 0-16 0" />
        <path d="M12 14v4" />
        <path d="M9.5 17.5l2.5-2 2.5 2" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Referee Development",
    description:
      "Become part of a credible and organised competitive ecosystem through official referee registration and structured development.",
    ctatext: "Become a Registered Referee",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 stroke-ktsa-text fill-none stroke-[1.7] stroke-linecap-round stroke-linejoin-round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Workshops & Intro Sessions",
    description:
      "Bring guided foosball sessions to your campus, company, or organisation — tailored intro programmes for groups of all sizes.",
    ctatext: "Host a Workshop",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 stroke-ktsa-text fill-none stroke-[1.7] stroke-linecap-round stroke-linejoin-round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Development Pathways",
    description:
      "Explore structured opportunities to grow within the sport — from casual play to competitive careers, coaching, and club leadership.",
    ctatext: "Learn More",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 stroke-ktsa-text fill-none stroke-[1.7] stroke-linecap-round stroke-linejoin-round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];
const newsArticles = [
  {
    id: 1,
    title: "KTSA Officially Launched",
    date: "April 25, 2026",
    category: "KTSA",
    image:
      "https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0cm9waHklMjBjaGFtcGlvbnNoaXAlMjBhd2FyZHxlbnwxfHx8fDE3NzQ5MzgzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Bengaluru Open",
    date: "May, 2026, Bengaluru",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1751916856395-3dd0c4fe49e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRvdXJuYW1lbnQlMjBjb21wZXRpdGl2ZSUyMHNwb3J0c3xlbnwxfHx8fDE3NzQ5MzgyOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "Karnataka Open",
    date: "25th April, 2026, Bengaluru",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1746396887626-6bd54c6b2181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGF0aGxldGVzJTIwY2VsZWJyYXRpbmclMjB2aWN0b3J5fGVufDF8fHx8MTc3NDkzODMwMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const galleryImages = [image1, image2, image3];

function Counter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    let animationFrame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);
      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function TournamentCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<number>(LOOP_WIDTH);
  const pausedRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SPEED = 0.05;

  const applyOffset = useCallback((offset: number, withTransition = false) => {
    const el = trackRef.current;
    if (!el) return;
    if (offset >= LOOP_WIDTH * 2) offset -= LOOP_WIDTH;
    if (offset < 0) offset += LOOP_WIDTH;
    offsetRef.current = offset;
    el.style.transition = withTransition
      ? "transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94)"
      : "none";
    el.style.transform = "translateX(" + -offset + "px)";
  }, []);

  const tick = useCallback(
    (ts: number) => {
      if (!pausedRef.current) {
        if (lastTsRef.current !== null) {
          applyOffset(offsetRef.current + SPEED * (ts - lastTsRef.current));
        }
        lastTsRef.current = ts;
      } else {
        lastTsRef.current = null;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    },
    [applyOffset],
  );

  useEffect(() => {
    applyOffset(LOOP_WIDTH);
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [applyOffset, tick]);

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const resume = (delay = 0) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  };

  const step = (dir: "left" | "right") => {
    pause();
    applyOffset(
      offsetRef.current + (dir === "right" ? CARD_STEP : -CARD_STEP),
      true,
    );
    resume(2500);
  };

  return (
    <div className="relative">
      <button
        onClick={() => step("left")}
        onMouseEnter={pause}
        onMouseLeave={() => resume(800)}
        aria-label="Previous"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full flex items-center justify-center border border-ktsa-accent/40 bg-ktsa-bg/80 backdrop-blur-sm text-ktsa-accent hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-200 cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => step("right")}
        onMouseEnter={pause}
        onMouseLeave={() => resume(800)}
        aria-label="Next"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full flex items-center justify-center border border-ktsa-accent/40 bg-ktsa-bg/80 backdrop-blur-sm text-ktsa-accent hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-200 cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>

      <div
        className="overflow-hidden"
        onMouseEnter={pause}
        onMouseLeave={() => resume(800)}
        onTouchStart={pause}
        onTouchEnd={() => resume(3000)}
      >
        <div
          ref={trackRef}
          className="flex pb-4"
          style={{ gap: CARD_GAP + "px", willChange: "transform" }}
        >
          {infiniteTournaments.map((tournament) => (
            <div
              key={tournament._key}
              className="flex-shrink-0 bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-ktsa-accent/30 hover:border-ktsa-accent transition-all duration-300 group"
              style={{
                width: CARD_W + "px",
                boxShadow: "0 8px 30px rgba(0,229,255,0.12)",
              }}
            >
              <div className="relative h-44 overflow-hidden">
                <ImageWithFallback
                  src={tournament.image}
                  alt={tournament.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0" />
                <div className="absolute top-3 right-3">
                  <span
                    className={
                      "px-3 py-1 rounded-full text-xs font-bold " +
                      (tournament.status === "Live"
                        ? "bg-red-500 text-white animate-pulse"
                        : tournament.status === "Completed"
                          ? "bg-green-600 text-white"
                          : "bg-ktsa-highlight text-ktsa-text")
                    }
                  >
                    {tournament.status === "Live"
                      ? "LIVE"
                      : tournament.status === "Completed"
                        ? "COMPLETED"
                        : "UPCOMING"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-black text-ktsa-accent mb-3 group-hover:text-ktsa-text transition-colors leading-tight">
                  {tournament.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ktsa-text/80">
                    <Calendar size={14} className="text-ktsa-accent" />
                    <span className="font-semibold text-ktsa-text text-sm">
                      {tournament.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-ktsa-text/80">
                    <MapPin size={14} className="text-ktsa-accent" />
                    <span className="font-semibold text-ktsa-text text-sm">
                      {tournament.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind sm breakpoint
    };

    handleResize(); // run once
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero — 100svh keeps content inside the mobile viewport */}
      <section className="relative flex items-center justify-center overflow-hidden py-10 sm:py-10">
        {/* Background image */}
        <div className="cover mx-auto absolute inset-0 opacity-80">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1716703370285-d7ff2960abb4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Foosball Action"
            className="w-full h-full object-cover scale-110 sm:scale-105"
          />

          {/* keep your same overlays --changes*/}
          <div className="absolute inset-0 bg-gradient-to-b from-ktsa-bg/40 via-ktsa-bg/40 to-ktsa-bg/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-ktsa-accent/10 via-transparent to-ktsa-highlight/10" />
        </div>

        {/* CENTER CONTENT */}
        <div
          className="relative z-10 w-full flex flex-col items-center justify-center text-center px-8 sm:px-12 max-w-4xl mx-auto "
          style={{ marginTop: "40px" }}
        >
          {/* LOGO */}
          <motion.img
            src={logo} // or "/src/assets/logo.png"
            alt="KTSA Logo"
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-52 sm:w-44 md:w-80 -mb-5"
          />

          {/* DESCRIPTION */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 sm:mb-10 text-center max-w-2xl"
          >
            {/* MAIN HEADING */}
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-ktsa-text leading-snug">
              The home of organized foosball in Karnataka
            </h1>

            {/* SUB TEXT */}
            <p className="text-xs sm:text-sm md:text-base text-ktsa-text/90 leading-relaxed font-medium">
              Foosball deserves structure, recognition, and opportunity.{" "}
              {/* <br className="hidden sm:block" /> */}
              KTSA delivers all three.
            </p>

            {/* STATS LINE */}
            <p className=" text-[11px] sm:text-sm text-ktsa-text/90 leading-relaxed">
              700+ players • 500+ active • structured tournaments • clear growth
              pathway
            </p>
          </motion.div>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center"
          >
            <motion.button
              onClick={() => {
                document
                  .getElementById("footer")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-ktsa-primary/50 text-ktsa-text rounded-full font-bold text-sm sm:text-base shadow-lg transition-all duration-300 flex items-center gap-2 justify-center group relative overflow-hidden"
            >
              <span className="relative z-10">Get Involved</span>
              <ArrowRight
                className="relative z-10 group-hover:translate-x-2 transition-transform"
                size={18}
              />
              <div className="absolute inset-0 bg-ktsa-primary/60 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-sm sm:text-base hover:border-ktsa-primary/90 hover:bg-ktsa-primary/80 hover:text-white transition-all duration-300"
              >
                Explore KTSA
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Foosbal and KTSA */}
      <section className="py-8 md:py-12 px-4 bg-gradient-to-b from-ktsa-bg/95 to-ktsa-bg relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* LEFT SIDE */}
          <div>
            {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/70 uppercase mb-2 block">
              ABOUT KTSA
            </span> */}
            <h2 className="text-3xl md:text-5xl font-black text-ktsa-text mb-6 leading-tight">
              <span className=" text-ktsa-accent">Built for foosball </span>{" "}
              <br /> Built for Karnataka
            </h2>

            <p className="text-ktsa-text mb-8 text-sm md:text-base">
              KTSA was founded on a simple belief — that foosball deserves the
              same structure, recognition, and competitive opportunity as any
              mainstream sport. Established in 2018 by Sayeed Ahmed Shariff and
              a committed group of players in Bengaluru, KTSA continues to
              create opportunities for players of all ages to learn, compete,
              and progress. <br /> <br />
              KTSA is a registered non-profit affiliated with the Federation of
              Table Soccer India (FTSI), which in turn is connected to the
              International Table Soccer Federation (ITSF).
            </p>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-sm sm:text-base hover:border-ktsa-highlight hover:bg-ktsa-highlight hover:text-white transition-all duration-300"
              >
                Learn More About KTSA
              </motion.button>
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-transparent  backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex flex-col gap-3">
                {[
                  {
                    title: "Registered Non-Profit",
                    desc: "Formally registered organization dedicated to building an organized foosball platform.",
                  },
                  {
                    title: "FTSI Affiliated",
                    desc: "Connected to the national (FTSI) and international (ITSF) table soccer federations.",
                  },
                  {
                    title: "Est. 2018, Bengaluru",
                    desc: "Founded by Sayeed Ahmed Shariff and a core group of committed players",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3 p-3 rounded-xl border border-ktsa-accent/15 bg-ktsa-primary/15 hover:border-ktsa-accent/35 transition-colors"
                  >
                    <div
                      className="w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-ktsa-accent to-ktsa-highlight mt-1"
                      style={{ height: "auto", minHeight: 32 }}
                    />
                    <div>
                      <p className="text-sm font-black text-ktsa-accent mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-sm text-ktsa-text leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillar Section */}
      <section className="py-8 px-4 bg-gradient-to-b from-ktsa-bg/95 to-ktsa-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/70 uppercase mb-2 block">
                WHAT KTSA STANDS FOR
              </span> */}
              <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-3">
                The <span className="text-ktsa-accent">four pillars </span>
                of KTSA
              </h2>
              <p className="text-ktsa-text/70 text-sm">
                Every decision KTSA makes is grounded in these four commitments
                to the sport and its players.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-5 flex flex-col h-full justify-center items-center bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-ktsa-accent/30 hover:border-ktsa-accent transition-all duration-300 group cursor-pointer"
                style={{ boxShadow: "0 8px 30px rgba(0,229,255,0.12)" }}
              >
                <p className="w-9 h-9 flex items-center justify-center bg-ktsa-accent text-ktsa-text text-lg font-bold rounded-full shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                  {pillar.id}
                </p>
                <h3 className="text-xl font-black text-ktsa-accent group-hover:text-ktsa-text transition-colors text-center">
                  {pillar.title}
                </h3>
                <p className="text-ktsa-text/60 text-sm font-semibold text-center">
                  {pillar.description}
                </p>
                <p className="text-ktsa-text text-sm text-center mt-auto pt-2 border-t border-ktsa-accent/10 w-full">
                  {pillar.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Training & Development */}
      <section className="py-20 px-8 bg-gradient-to-b from-ktsa-bg to-[#070d0a] relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(0,200,130,0.07),transparent_70%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          {/* Header */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-[44px] font-black text-ktsa-text tracking-tight leading-tight mb-4">
              <span className="text-ktsa-accent">Training</span> & Development
            </h2>
            <p className="text-ktsa-text/70 text-sm font-light max-w-xl mx-auto leading-relaxed">
              KTSA is growing foosball through structured learning, player
              development, referee pathways, and institutional engagement —
              building deeper roles within the sport for players and supporters
              alike.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-0 items-start">
            {trainingAndDevelopment.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative px-3 mb-24"
              >
                {/* Floating circular icon */}
                <div className="relative left-1/2 -translate-x-1/2 w-[76px] h-[76px] rounded-full bg-ktsa-accent shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center z-10 mb-[-60px] transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:translate-x-[-50%]">
                  <div className="w-[65px] h-[65px] rounded-full bg-ktsa shadow-[6px_6px_18px_rgba(0,0,0,0.5),-3px_-3px_10px_rgba(0,200,130,0.06)] flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                {/* Card */}
                <div className="relative  bg-transparent pt-[72px] px-6 pb-7 overflow-visible transition-all duration-300">
                  {/* Curved right border accent */}
                  <div className="absolute w-[calc(100%+100px)] h-[calc(100%+24px)] top-[-12px] left-1/2 overflow-hidden rounded-[18px] pointer-events-none">
                    <div className="absolute w-full h-full top-0 left-[-50%] rounded-[600px] border-[8px] border-ktsa-accent/[0.18] group-hover:border-ktsa-accent/40 transition-colors duration-300" />
                  </div>

                  {/* Number pill + title */}
                  <div className="flex justify-center mb-3.5">
                    <div
                      className="relative flex items-center bg-ktsa-accent/30 rounded-r-[50px] pl-10 pr-4 py-2 ml-5"
                      style={{
                        boxShadow:
                          "10px 14px 24px rgba(0,0,0,0.4), 5px 0 32px rgba(0,0,0,0.2)",
                      }}
                    >
                      {/* Number badge */}
                      <span
                        className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ktsa-accent border border-ktsa-accent/20 flex items-center justify-center font-['Outfit'] text-sm font-black text-ktsa-text"
                        style={{ boxShadow: "10px 10px 22px rgba(0,0,0,0.45)" }}
                      >
                        {item.id}
                      </span>
                      <span className="font-['Outfit'] text-[15px] font-extrabold text-[#e0f7ed] whitespace-nowrap">
                        {item.title}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-ktsa-text/80 text-[13px] font-light leading-relaxed text-center px-2 mb-6">
                    {item.description}
                  </p>

                  {/* CTA */}
                  <div className="border-t border-ktsa-accent/10 group-hover:border-ktsa-accent/25 transition-colors pt-4 flex justify-center">
                    <span className="font-['Outfit'] text-[12.5px] font-bold text-ktsa-accent tracking-[0.3px]">
                      {item.ctatext}
                    </span>
                  </div>

                  {/* Bottom arrow button */}
                  <div
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0e1f17] border border-ktsa-accent/20 flex items-center justify-center z-10 transition-all duration-300 group-hover:bg-ktsa-accent group-hover:border-transparent"
                    style={{ boxShadow: "6px 6px 20px rgba(0,0,0,0.5)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-none stroke-ktsa-accent group-hover:stroke-white stroke-[2.2] stroke-linecap-round stroke-linejoin-round transition-colors"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Footer CTA */}
          <motion.div
            className="text-center -mt-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-ktsa-text/70 text-sm font-light mb-5">
              Interested in bringing foosball to your institution or
              organisation?
            </p>
            <button className="hover:border-ktsa-highlight hover:bg-ktsa-highlight hover:text-white bg-transparent border-2 border-white text-white rounded-full font-bold inline-flex items-center gap-2.5 px-8 py-3.5  text-[13.5px] tracking-[0.3px] hover:-translate-y-0.5 transition-all duration-300">
              Get in Touch with KTSA
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 stroke-ktsa-text fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Recent Achievement ──────────────────────────────────── */}
      <section className="py-8 md:py-14 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-2 block">
              Track record
            </span> */}
            <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-3">
              Recent <span className="text-ktsa-accent"> achievements</span>
            </h2>
            <p className="text-ktsa-text/70 text-sm">
              KTSA players have been making their mark at national and
              international levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                year: "2024",
                borderClass: "border-ktsa-accent/30 hover:border-ktsa-accent",
                glow: "rgba(0,229,255,0.12)",
                label: "Breakthrough Success",
                text: "KTSA players delivered exceptional success at the national tournament, bagging nearly every medal on offer and winning Gold, Silver, and Bronze across categories.",
              },
              {
                year: "2025",
                borderClass:
                  "border-ktsa-highlight/30 hover:border-ktsa-highlight",
                glow: "rgba(255,111,0,0.12)",
                label: "National & International Milestones",
                text: "KTSA players won Gold and Silver medals in two categories at nationals and were nominated to represent India at the World Cup in Zaragoza, Spain — finishing 4th in the double leg category.",
              },
            ].map(({ year: Icon, borderClass, glow, label, text }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className={`relative bg-gradient-to-br from-ktsa-primary/35 to-ktsa-secondary/25 rounded-2xl p-5 backdrop-blur-sm border-2 ${borderClass} transition-all duration-300`}
                style={{ boxShadow: `0 8px 30px ${glow}` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`px-3 py-1 text-ktsa-text rounded-2xl bg-ktsa-accent flex items-center font-bold justify-center flex-shrink-0`}
                  >
                    {Icon}
                  </div>
                  <h3 className="text-xl font-black text-ktsa-highlight hover:text-ktsa-text">
                    {label}
                  </h3>
                </div>
                <p className="text-sm text-ktsa-text leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments */}
      <section className="py-8 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative">
        <div className="absolute inset-0 opacity-5">
          <ImageWithFallback
            src="https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/11/foosball-table-techniques-jpg.webp"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-2 block">
                Competition
              </span> */}
              <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-3">
                <span className="bg-gradient-to-r text-ktsa-accent">
                  Upcoming & Past
                </span>{" "}
                Tournaments
              </h2>
              <p className="text-ktsa-text/70 text-sm">
                Stay connected to KTSA tournaments, past events, and upcoming
                competitive opportunities across Karnataka.
              </p>
            </motion.div>
          </div>
          <TournamentCarousel />
          {/* <div className="text-center mt-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-ktsa-primary/80 text-ktsa-text rounded-full font-bold text-base border-ktsa-accent/30 hover:border-ktsa-accent transition-all duration-400"
            >
              View All Tournaments
            </motion.button>
          </div> */}
        </div>
      </section>

      {/* Top Players */}
      <section
        className="py-8 px-4 relative overflow-hidden bg-gradient-to-r from-ktsa-secondary via-ktsa-primary/75 to-ktsa-secondary"
        // style={{
        //   background:
        //     "radial-gradient(circle, var(--ktsa-secondary) 7%, var(--ktsa-secondary) -15%, #000000 100%)",
        // }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            {/* ── Left — text panel ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* <p className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-3">
                Performance Tracking
              </p> */}
              <h2 className="text-3xl md:text-5xl font-black text-ktsa-text mb-4 leading-tight">
                Top Players{" "}
                <span className="text-ktsa-primary/75">Spotlight</span>
              </h2>
              <p className="text-sm md:text-base text-ktsa-text mb-4 leading-relaxed">
                Track competitive progress and see how <br /> players are
                performing across KTSA's <br /> structured ecosystem.
              </p>
              <p className="text-sm text-ktsa-text/55 mb-8 leading-relaxed">
                Rankings bring visibility, progression, <br /> and structure to
                the game — helping players <br /> measure growth and compete
                with purpose.
              </p>
              <Link to="/rankings">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-ktsa-primary/80 text-ktsa-text rounded-full font-bold text-sm shadow-lg hover:bg-ktsa-highlight transition-colors duration-300"
                >
                  View Full Rankings →
                </motion.button>
              </Link>
            </motion.div>

            {/* ── Right — card stack ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <TopPlayersStack />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-8 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/70 uppercase mb-2 block">
                Gallery
              </span> */}
              <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-3">
                A quick look at the{" "}
                <span className="text-ktsa-accent">
                  moments behind <br /> the movement
                </span>
              </h2>
              <p className="text-ktsa-text/70 text-sm">
                A short glimpse into the tournaments, podium finishes, and
                community moments that continue to shape KTSA.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {galleryImages.slice(0, isMobile ? 2 : 3).map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.04, rotate: 1 }}
                className="relative h-48 rounded-xl overflow-hidden group cursor-pointer"
              >
                <ImageWithFallback
                  src={image}
                  alt={"Gallery " + (index + 1)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 border-2 border-ktsa-accent/0 group-hover:border-ktsa-accent/60 transition-colors duration-300 rounded-xl" />
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-ktsa-primary/80 text-ktsa-text rounded-full font-bold text-base border-ktsa-accent/30 hover:border-ktsa-accent transition-all duration-400"
              >
                View Full Gallery
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 md:py-14 px-4 bg-gradient-to-r from-ktsa-secondary via-ktsa-primary/75 to-ktsa-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-ktsa-accent rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-ktsa-highlight rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-ktsa-accent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
            {[
              {
                end: 700,
                label: "Total Players",
                icon: (
                  <Users className="w-5 h-5 md:w-8 md:h-8 text-ktsa-text" />
                ),
              },

              {
                end: 50,
                label: "Tournaments",
                icon: (
                  <Trophy className="w-5 h-5 md:w-8 md:h-8 text-ktsa-text" />
                ),
              },
              {
                end: 500,
                label: "Active Players",
                icon: (
                  <Users className="w-5 h-5 md:w-8 md:h-8 text-ktsa-text" />
                ),
              },
              {
                end: 15,
                label: "Clubs",
                icon: (
                  <Medal className="w-5 h-5 md:w-8 md:h-8 text-ktsa-text" />
                ),
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2 md:mb-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-ktsa-accent/90 flex items-center justify-center backdrop-blur-sm">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl md:text-6xl font-black text-white mb-1 md:mb-2">
                  <Counter end={stat.end} />+
                </div>
                <div className="text-xs md:text-lg text-ktsa-text font-bold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-8 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative">
        <div className="absolute inset-0 opacity-5">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1733648203550-0cacea85fa35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMGZvb3RiYWxsJTIwY29tcGV0aXRpdmUlMjBtYXRjaHxlbnwxfHx8fDE3NzQ5MzkwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 mb-6">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/70 uppercase mb-2 block">
                Watch
              </span> */}
              <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-3">
                Experience<span className="text-ktsa-accent"> The Game</span>
              </h2>
              <p className="text-ktsa-text/70 text-sm">
                Watch the energy of KTSA through tournament highlights, match
                action, player performances, and community moments.
              </p>
            </motion.div>
          </div>

          {/* Scrollable video track */}
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => {
                const el = document.getElementById("video-track");
                if (el) el.scrollBy({ left: -400, behavior: "smooth" });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full flex items-center justify-center border border-ktsa-accent/40 bg-ktsa-bg/80 backdrop-blur-sm text-ktsa-accent hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right arrow */}
            <button
              onClick={() => {
                const el = document.getElementById("video-track");
                if (el) el.scrollBy({ left: 400, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full flex items-center justify-center border border-ktsa-accent/40 bg-ktsa-bg/80 backdrop-blur-sm text-ktsa-accent hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>

            {/* Scrollable container */}
            <div
              id="video-track"
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            >
              {[
                "https://www.youtube.com/embed/KAzg5Tzkhiw",
                "https://www.youtube.com/embed/KAzg5Tzkhiw",
                "https://www.youtube.com/embed/KAzg5Tzkhiw",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-shrink-0 w-[300px] md:w-[400px] rounded-2xl overflow-hidden border border-ktsa-accent/30"
                  style={{ boxShadow: "0 10px 40px rgba(0,229,255,0.15)" }}
                >
                  <div className="relative w-full pb-[56.25%]">
                    <iframe
                      src={src}
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center">
          <motion.a
            href="https://www.youtube.com/@KTSA_Official"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, borderColor: "rgba(0,229,255,1)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-ktsa-primary/80 text-ktsa-text rounded-full font-bold text-base border border-ktsa-accent/30"
            style={{ willChange: "transform" }}
          >
            Watch on Youtube
          </motion.a>
        </div>
      </section>
      {/* News */}
      <section className="py-8 px-4 bg-gradient-to-b from-ktsa-bg/95 to-ktsa-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* <span className="inline-block px-5 py-1.5 bg-ktsa-accent/10 border border-ktsa-accent/30 rounded-full text-ktsa-accent font-bold text-xs tracking-wider mb-4">
                STAY UPDATED
              </span> */}
              <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-3">
                <span className="text-ktsa-accent">Latest </span>
                News
              </h2>
              <p className="text-ktsa-text/70 text-sm">
                What's happening in the KTSA world
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-ktsa-accent/30 hover:border-ktsa-accent transition-all duration-300 group cursor-pointer"
                style={{ boxShadow: "0 8px 30px rgba(0,229,255,0.12)" }}
              >
                <div className="relative h-44 overflow-hidden">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-ktsa-accent/90 text-ktsa-text text-xs font-bold rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-ktsa-text/60 text-xs mb-2 font-semibold">
                    {article.date}
                  </p>
                  <h3 className="text-base font-black text-ktsa-text group-hover:text-ktsa-accent transition-colors leading-snug">
                    {article.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/news">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-ktsa-primary/80 text-ktsa-text rounded-full font-bold text-base  border-ktsa-accent/30 hover:border-ktsa-accent transition-all duration-300"
              >
                Read More News
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
