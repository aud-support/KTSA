import { motion } from "motion/react";
import {
  Target,
  Eye,
  Users,
  Trophy,
  Award,
  Star,
  ChevronRight,
  MapPin,
  Globe,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import team from "../../assets/ktsa.jpg";
import { useState } from "react";

const achievements = [
  {
    icon: Trophy,
    title: "50+ Tournaments",
    description: "Organized across Karnataka",
  },
  {
    icon: Users,
    title: "500+ Players",
    description: "Active community members",
  },
  {
    icon: Award,
    title: "15+ Clubs",
    description: "Participated and competing",
  },
  {
    icon: Star,
    title: "National Recognition",
    description: "Recognised by the National Federation",
  },
];

const timeline = [
  {
    year: "2018-19",
    title: "Foundation",
    description:
      "KTSA began in its earliest form as a small group of passionate players focused on participating in tournaments, building experience, and brainstorming what an organized foosball community in Karnataka could become. ",
  },
  {
    year: "2020-22",
    title: "Disrupted Momentum",
    description:
      "The COVID period created a major slowdown for the growing foosball community. What had been building as an emerging network of players and ideas entered a difficult phase, with limited opportunities for activity, competition, and organized development. ",
  },
  {
    year: "2023",
    title: "Rebuilding Through Consistency ",
    description:
      "The return after COVID was gradual. KTSA rebuilt momentum step by step through consistency, renewed participation, and a steady effort to bring players back together and restart growth. ",
  },
  {
    year: "2024",
    title: "Breakthrough Year",
    description:
      "With a growing community of 350+ players and 10+ tournaments hosted throughout the year, KTSA reached a major turning point. KTSA players delivered exceptional success at the national tournament, bagging nearly every medal on offer and winning Gold, Silver, and Bronze across categories. ",
  },
  {
    year: "2025",
    title: "National Success, International Representation ",
    description:
      "KTSA players once again made a strong mark at the national level, winning Gold and Silver medals in two categories. In the same year, KTSA players were nominated to represent India at the World Cup in Zaragoza, Spain, where they finished 4th in the double leg category.",
  },
  {
    year: "Today",
    title: "A Growing Platform for the Sport ",
    description:
      "Today, KTSA has grown into a platform with 500+ active players and a wider community of 700+ players across platforms, continuing to strengthen organized foosball through tournaments, player development, and community growth across Karnataka.",
  },
];

// const recognitions = [
//   "Karnataka Sports Council Recognition",
//   "National Sports Development Partnership",
//   "Youth Sports Excellence Award 2024",
// ];

// const governingCommittee = [
//   {
//     name: "Sayeed Ahmed Shariff",
//     role: "Founder & President · KTSA",
//     initials: "SAS",
//     color: "from-ktsa-accent/20 to-ktsa-primary/20",
//     border: "border-ktsa-accent/40",
//   },
//   {
//     name: "Arjun Deshmukh",
//     role: "Vice President",
//     initials: "AD",
//     color: "from-ktsa-accent/20 to-ktsa-primary/20",
//     border: "border-ktsa-accent/40",
//   },
//   {
//     name: "Priya Venkatesh",
//     role: "Secretary General",
//     initials: "PV",
//     color: "from-ktsa-accent/20 to-ktsa-primary/20",
//     border: "border-ktsa-accent/40",
//   },
//   {
//     name: "Rahul Shetty",
//     role: "Treasurer",
//     initials: "RS",
//     color: "from-ktsa-accent/20 to-ktsa-primary/20",
//     border: "border-ktsa-accent/40",
//   },
// ];

const whyItMatters = [
  {
    title: "A Sport Without Boundaries",
    desc: "Table soccer is played indoors and requires no large infrastructure, making it uniquely accessible to schools, colleges, community centers, and people of all ages across Karnataka.",
  },
  {
    title: "FTSI Affiliated",
    desc: "As an FTSI-affiliated body, KTSA provides Karnataka players a direct pathway to national rankings.",
  },
  {
    title: "Developing Young Athletes",
    desc: "KTSA's school and college programmes introduce structured competition to students, building discipline, reflexes, and sportsmanship from an early age.",
  },
  {
    title: "True Governing Standards",
    desc: "KTSA enforces certified rules, licensed referees, and sanctioned tournaments — bringing professionalism and integrity to every competitive event.",
  },
];

const info = [
  {
    title: "Registered non-profit",
    desc: "Formally registered organization dedicated to building a credible, organized platform for foosball in Karnataka.",
  },
  {
    title: "FTSI affiliated · ITSF connected",
    desc: "Affiliated with the Federation of Table Soccer India (FTSI), the national federation, which is connected to the International Table Soccer Federation (ITSF).",
  },
];

const ktsakProvides = [
  {
    icon: Trophy,
    title: "Official Rankings",
    desc: "Points-based ranking updated after every sanctioned event.",
  },
  {
    icon: Users,
    title: "Club Registration",
    desc: "Formal affiliation for clubs with competitive access and benefits.",
  },
  {
    icon: Globe,
    title: "National Exposure",
    desc: "Pathways to state, national, and international tournaments.",
  },
  {
    icon: MapPin,
    title: "Tournament Calendar",
    desc: "Structured season with scheduled open, club, and championship events.",
  },
  {
    icon: Award,
    title: "Certification & Badges",
    desc: "Referee and coaching certification recognised by ITSF.",
  },
  {
    icon: Star,
    title: "Digital Platform Access",
    desc: "Live rankings, match results, and player profiles on ktsa.in.",
  },
];

export function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen pt-20">
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="relative h-[38vh] min-h-[220px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://plus.unsplash.com/premium_photo-1726826641348-8a16a70263ce?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-ktsa-accent/10 via-transparent to-ktsa-highlight/10" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-ktsa-accent/20 border border-ktsa-accent/50 rounded-full text-ktsa-accent font-bold text-xs tracking-wider mb-4">
              EST. 2018
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3">
              About{" "}
              <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
                KTSA
              </span>
            </h1>
            <p className="text-sm md:text-base text-white font-semibold">
              Building Karnataka's premier table soccer community
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── The Story Behind KTSA ────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left — story text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/70 uppercase mb-2 block">
                Our Story
              </span> */}
              <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-4 leading-tight">
                The Story{" "}
                <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
                  Behind KTSA
                </span>
              </h2>

              {/* Always visible */}
              <p className="text-sm text-ktsa-text/75 mb-3 leading-relaxed">
                The Karnataka Table Soccer Association (KTSA) was founded on a
                simple belief — that foosball deserves the same structure,
                recognition, and competitive opportunity as any mainstream
                sport.
              </p>

              {/* Collapsible on mobile, always visible on md+ */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out md:!max-h-none md:!opacity-100 ${
                  expanded
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
                }`}
              >
                <p className="text-sm text-ktsa-text/75 mb-3 leading-relaxed">
                  Established in 2018 by Sayeed Ahmed Shariff and a committed
                  group of players in Bengaluru, KTSA was created to build a
                  more organized future for foosball in Karnataka. From
                  participation and community-building in its early years to
                  structured tournaments, rankings, and competitive pathways,
                  KTSA has steadily worked to give the sport the foundation it
                  needed to grow with purpose.
                </p>
                <p className="text-sm text-ktsa-text/75 mb-3 leading-relaxed">
                  KTSA is a registered non-profit organization dedicated to
                  building a credible and organized platform for foosball in
                  Karnataka. KTSA is affiliated with the Federation of Table
                  Soccer India (FTSI), the national federation for the sport in
                  India. Through FTSI, KTSA is connected to the International
                  Table Soccer Federation (ITSF).
                </p>
                <p className="text-sm text-ktsa-text/75 mb-6 leading-relaxed">
                  Today, KTSA continues to create opportunities for players to
                  learn, compete, and progress, with 500+ active players and a
                  wider community of 700+ players across platforms.
                </p>
              </div>

              {/* Read More button — only on mobile */}
              <button
                className="flex items-center gap-1 text-ktsa-accent text-xs font-bold mb-4 md:hidden"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Read Less" : "Read More"}
                <ChevronRight
                  size={13}
                  className={`transition-transform duration-300 ${expanded ? "rotate-90" : ""}`}
                />
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "src/assets/Rulebook.pdf";
                    link.download = "Rulebook.pdf";
                    link.click();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-ktsa-primary/70 text-ktsa-text rounded-full font-bold text-xs shadow-lg"
                >
                  Download Rulebook <ChevronRight size={13} />
                </button>
              </div>
            </motion.div>

            {/* Right — founder card + stats */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              {/* Founder card */}
              <div
                className="rounded-2xl p-4 border border-yellow-400/30 flex items-center gap-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.07), rgba(10,10,20,0.9))",
                }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 font-black text-sm flex-shrink-0">
                  SAS
                </div>
                <div>
                  <p className="text-sm font-black text-ktsa-accent">
                    Sayeed Ahmed Shariff
                  </p>
                  <p className="text-xs text-ktsa-text/50">
                    Founder & President · KTSA
                  </p>
                  <p className="text-xs text-white mt-1 leading-relaxed">
                    "Our goal has always been to give Karnataka's foosball
                    players the platform they deserve — structured, recognised,
                    and connected to the world."
                  </p>

                  {/* Hidden extra content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      expanded
                        ? "max-h-40 opacity-100 mt-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs text-white/80 leading-relaxed">
                      Sayeed Ahmed Shariff has been instrumental in building
                      KTSA from the ground up. His vision focuses on creating
                      structured pathways, national-level exposure, and a strong
                      grassroots ecosystem for foosball players across
                      Karnataka.
                    </p>
                  </div>

                  {/* Read More Button */}
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-ktsa-accent text-[11px] font-bold mt-1"
                  >
                    {expanded ? "Read Less" : "Read More"}
                    <ChevronRight
                      size={12}
                      className={`transition-transform ${
                        expanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {info.map((item, i) => (
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
                      <p className="text-xs text-white leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "700+",
                    label: "Total players",
                  },
                  { value: "50+", label: "Tournaments" },
                  {
                    value: "500+",
                    label: "Active Players",
                  },
                  {
                    value: "15+",
                    label: "clubs",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-3 border border-ktsa-accent/20 bg-ktsa-primary/20 text-center"
                  >
                    <p className="text-xl font-black text-ktsa-accent">
                      {s.value}
                    </p>
                    <p className="text-xs  text-ktsa-text">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Who We Are + Team photo ───────────────────────────── */}
      <section className="py-10 md:py-14 px-4 bg-ktsa-bg/95">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[240px] md:h-[320px] rounded-2xl overflow-hidden group">
                <ImageWithFallback
                  src={team}
                  alt="KTSA Team"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 border-2 border-ktsa-accent/30 group-hover:border-ktsa-accent rounded-2xl transition-colors duration-300" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: 100 }}
            >
              <h2 className="text-2xl md:text-3xl font-black text-ktsa-text mb-3">
                Who{" "}
                <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
                  We Are
                </span>
              </h2>
              <p className="text-sm text-ktsa-text/75 mb-3 leading-relaxed">
                The Karnataka Table Soccer Association (KTSA) is the leading
                organisation dedicated to promoting and developing table soccer
                (foosball) in Karnataka, India.
              </p>
              <p className="text-sm text-ktsa-text/75 mb-3 leading-relaxed">
                Founded in 2018, we have grown into a vibrant community of
                passionate players, coaches, and enthusiasts who share a love
                for this dynamic sport.
              </p>
              <p className="text-sm text-ktsa-text/75 leading-relaxed">
                We organise tournaments, training programmes, and community
                events to foster competitive excellence and bring together
                players of all skill levels.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Foosball in India — Why This Matters ─────────────── */}
      <section className="py-10 md:py-14 px-4 bg-gradient-to-b from-ktsa-bg/95 to-ktsa-bg">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* India stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-ktsa-accent/30 overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(0,229,255,0.05), rgba(10,10,30,0.95))",
              }}
            >
              <div className="p-5 border-b border-ktsa-accent/30">
                <p className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-1">
                  WHAT KTSA STANDS FOR
                </p>
                <h3 className="text-lg font-black text-ktsa-text">
                  The four pillars of KTSA
                </h3>
              </div>
              <div className="p-5">
                <div className="relative h-[140px] rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://t4.ftcdn.net/jpg/01/07/36/33/360_F_107363306_NQPpVQIPqkBfxQMoPP37WIEFduYlwFY9.jpg"
                    alt="India map"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-white opacity-80">
                      Foosball
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "Structure",
                      label: "Giving the sport a stronger foundation ",
                    },
                    {
                      value: "Opportunity ",
                      label: "Creating pathways for players ",
                    },
                    {
                      value: "Recognition ",
                      label: "Building visibility for foosball ",
                    },
                    {
                      value: "Growth ",
                      label: "Expanding the ecosystem with intent ",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3 bg-gradient-to-br from-ktsa-primary/35 to-ktsa-secondary/25 border-ktsa-accent/30 hover:border-ktsa-accent transition-all text-center"
                    >
                      <p className="text-base font-black text-ktsa-accent">
                        {s.value}
                      </p>
                      <p className="text-[11px]  text-white">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Why it matters list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="text-xl md:text-2xl font-black text-ktsa-text mb-5">
                Why{" "}
                <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
                  This Matters
                </span>
              </h3>
              <div className="flex flex-col gap-3">
                {whyItMatters.map((item, i) => (
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
                      <p className="text-xs font-black text-ktsa-accent mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-xs text-white leading-relaxed">
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

      {/* ── Vision & Mission ──────────────────────────────────── */}
      <section className="py-10 md:py-14 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-2 block">
              What We Stand For
            </span> */}
            <h2 className="text-2xl md:text-4xl font-black text-ktsa-text">
              Vision{" "}
              <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
                &amp; Mission
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: Eye,
                color: "ktsa-text",
                borderClass: "border-ktsa-accent/30 hover:border-ktsa-accent",
                glow: "rgba(0,229,255,0.12)",
                label: "Our Vision",
                text: "To establish Karnataka as a leading hub for organized foosball, where every player has the opportunity to learn, compete, and grow. ",
              },
              {
                icon: Target,
                color: "ktsa-text",
                borderClass:
                  "border-ktsa-highlight/30 hover:border-ktsa-highlight",
                glow: "rgba(255,111,0,0.12)",
                label: "Our Mission",
                text: "To bring structure, recognition, opportunity, and community to foosball in Karnataka through organized events, player development, inclusive participation, and competitive pathways for all ages. ",
              },
            ].map(({ icon: Icon, color, borderClass, glow, label, text }) => (
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
                    className={`w-10 h-10 rounded-full bg-${color}/20 flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 text-${color}`} />
                  </div>
                  <h3 className="text-base font-black text-ktsa-accent">
                    {label}
                  </h3>
                </div>
                <p className="text-sm text-white leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey Timeline ──────────────────────────────────── */}
      <section className="py-10 md:py-14 px-4 bg-gradient-to-b from-ktsa-bg/95 to-ktsa-bg relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-8">
            {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-2 block">
              Since 2018
            </span> */}
            <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-1">
              KTSA's{" "}
              <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-sm text-ktsa-text/55">
              Milestones that shaped our organisation
            </p>
          </div>

          <div className="relative">
            {/* Centre line */}
            {/* Centre line */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-0 w-[2px] bg-gradient-to-b from-ktsa-accent via-ktsa-accent to-transparent" />{" "}
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="relative flex flex-col md:flex-row items-center md:items-start justify-between mb-8 md:mb-12"
              >
                {/* Card */}
                <div
                  className={`w-full md:w-[46%] ${index % 2 === 0 ? "md:pr-8" : "md:order-2 md:pl-8"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-ktsa-primary/35 to-ktsa-secondary/25 rounded-2xl p-4 border border-ktsa-accent/25 hover:border-ktsa-accent/50 transition-all duration-300"
                    style={{ boxShadow: "0 6px 24px rgba(0,229,255,0.08)" }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-4 py-2 rounded-full bg-ktsa-highlight text-ktsa-text font-bold text-xs">
                        {item.year}
                      </span>
                      <h3 className="text-sm font-black text-ktsa-accent">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-white leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </div>

                {/* Centre dot */}
                <div className="hidden md:block absolute left-1/2 top-4 transform -translate-x-1/2 z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-ktsa-accent border-2 border-ktsa-bg shadow-[0_0_12px_rgba(0,229,255,0.7)]" />
                </div>

                <div className="hidden md:block w-[46%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What KTSA Provides ───────────────────────────────── */}
      <section className="py-10 md:py-14 px-4 bg-gradient-to-b from-ktsa-bg/95 to-ktsa-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            {/* <span className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-2 block">
              Community Benefits
            </span> */}
            <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-1">
              What KTSA{" "}
              <span className="bg-gradient-to-r text-white to-ktsa-highlight bg-clip-text">
                <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
                  Provides
                </span>
              </span>
            </h2>
            <p className="text-sm text-ktsa-text/55">
              Everything a competitive foosball ecosystem needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ktsakProvides.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-ktsa-primary/30 to-ktsa-secondary/20 rounded-2xl p-4 border border-ktsa-accent/20 hover:border-ktsa-accent/45 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-ktsa-accent/15 flex items-center justify-center mb-3">
                  <item.icon size={16} className="text-ktsa-text" />
                </div>
                <h3 className="text-sm font-black text-ktsa-accent mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-white leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Achievements ─────────────────────────────────────── */}
      <section className="py-10 md:py-14 px-4 bg-gradient-to-r from-ktsa-secondary via-ktsa-primary/75 to-ktsa-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-ktsa-accent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-ktsa-highlight rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-1">
              Our Achievements
            </h2>
            <p className="text-sm text-ktsa-text/70">
              Milestones we're proud of
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="bg-ktsa-bg/35 backdrop-blur-sm rounded-2xl p-4 border border-ktsa-accent/25 hover:border-ktsa-accent transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-ktsa-accent/30 to-ktsa-highlight/30 flex items-center justify-center">
                  <achievement.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-black text-white mb-1">
                  {achievement.title}
                </h3>
                <p className="text-xs text-ktsa-text/70">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Governing Committee ───────────────────────────────── */}
      {/* <section className="py-10 md:py-14 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-2 block">
              The People Behind KTSA
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-ktsa-text mb-1">
              Governing{" "}
              <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
                {" "}
                Committee
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {governingCommittee.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl p-4 border ${member.border} bg-gradient-to-br ${member.color} text-center transition-all duration-300`}
              >
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${member.color} border ${member.border} flex items-center justify-center text-sm font-black text-white`}
                >
                  {member.initials}
                </div>
                <p className="text-xs font-black text-ktsa-accent leading-tight mb-1">
                  {member.name}
                </p>
                <p className="text-[10px] text-ktsa-text/50">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gradient-to-b from-ktsa-bg/95 to-ktsa-bg text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* <p className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-2">
            Community Invite
          </p> */}
          <h2 className="text-2xl md:text-3xl font-black text-ktsa-text mb-2">
            Ready to Be Part of{" "}
            <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
              {" "}
              India's Foosball Story?
            </span>
          </h2>
          <p className="text-sm text-ktsa-text/60 mb-6">
            Join the association, register your club, or attend your first
            tournament.
          </p>
          {/* <div className="flex gap-3 justify-center">
            <button className="px-5 py-2.5 bg-ktsa-primary/70 text-ktsa-text rounded-full font-bold text-xs shadow-lg">
              Contact KTSA
            </button>
           
          </div> */}
        </motion.div>
      </section>
    </div>
  );
}
