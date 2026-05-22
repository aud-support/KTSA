// ─── Tournaments ──────────────────────────────────────────────

export type TournamentStatus = "upcoming" | "ongoing" | "completed";
export const mockTournaments = [
  {
    id: 1,
    name: "KTSA Open 2025",
    date: "2025-03-15",
    status: "completed" as const,
    challongeLink: "https://challonge.com/ktsa_open_2025",
    winner: "Rahul Sharma",
    runnerUp: "Priya Nair",
    secondRunnerUp: "Arun Kumar",
    description: "Annual open tournament for all registered players.",
    points: [
      { player: "Rahul Sharma", points: 100 },
      { player: "Priya Nair", points: 75 },
      { player: "Arun Kumar", points: 60 },
      { player: "Divya Menon", points: 45 },
    ],
  },
  {
    id: 2,
    name: "KTSA Summer Cup",
    date: "2025-06-10",
    status: "upcoming" as const,
    challongeLink: "",
    winner: "",
    runnerUp: "",
    secondRunnerUp: "",
    description: "Summer edition of the KTSA tournament series.",
    points: [],
  },
  {
    id: 3,
    name: "KTSA Club League S1",
    date: "2025-01-20",
    status: "completed" as const,
    challongeLink: "https://challonge.com/ktsa_league_s1",
    winner: "Kiran Bhat",
    runnerUp: "Sneha Rao",
    secondRunnerUp: "Manoj Patel",
    description: "First season of the KTSA Club League.",
    points: [
      { player: "Kiran Bhat", points: 120 },
      { player: "Sneha Rao", points: 90 },
      { player: "Manoj Patel", points: 70 },
    ],
  },
];

// ─── News ─────────────────────────────────────────────────────
export const mockNews = [
  {
    id: 1,
    title: "KTSA Open 2025 Registration Now Open",
    content:
      "We are excited to announce that registrations for KTSA Open 2025 are now open. All players registered with KTSA are eligible to participate.",
    author: "KTSA Admin",
    status: "published" as const,
    publishedAt: "2025-02-01",
  },
  {
    id: 2,
    title: "New Training Sessions Every Weekend",
    content:
      "KTSA will be hosting open training sessions every Saturday from 10am to 1pm at the Bangalore Table Soccer Club. All skill levels welcome.",
    author: "KTSA Admin",
    status: "published" as const,
    publishedAt: "2025-01-15",
  },
  {
    id: 3,
    title: "Rule Changes for 2025 Season",
    content:
      "Draft article about updated tournament rules for the 2025 season.",
    author: "KTSA Admin",
    status: "draft" as const,
    publishedAt: "",
  },
];

// ─── Sponsors ─────────────────────────────────────────────────
export const mockSponsors = [
  {
    id: 1,
    name: "TechCorp India",
    logoUrl: "",
    websiteUrl: "https://example.com",
    tier: "title" as const,
    active: true,
  },
  {
    id: 2,
    name: "Bangalore Sports Hub",
    logoUrl: "",
    websiteUrl: "https://example.com",
    tier: "gold" as const,
    active: true,
  },
  {
    id: 3,
    name: "FoosballPro",
    logoUrl: "",
    websiteUrl: "https://example.com",
    tier: "silver" as const,
    active: true,
  },
  {
    id: 4,
    name: "KA Sports Authority",
    logoUrl: "",
    websiteUrl: "",
    tier: "partner" as const,
    active: false,
  },
];

// ─── CMS Sections ─────────────────────────────────────────────
export const mockCMS: Record<string, Record<string, string>> = {
  homepage: {
    heroTitle: "Karnataka Table Soccer Association",
    heroSubtitle:
      "The official governing body for table soccer (foosball) in Karnataka. Join us to compete, learn, and connect.",
    heroCtaText: "View Tournaments",
    aboutTeaser:
      "KTSA was founded to promote and develop the sport of table soccer across Karnataka.",
    statsPlayers: "200+",
    statsTournaments: "50+",
  },
  about: {
    heading: "About KTSA",
    intro:
      "The Karnataka Table Soccer Association (KTSA) is the official governing body for the sport of table soccer in Karnataka, India.",
    mission:
      "To promote, develop, and regulate the sport of table soccer across Karnataka.",
    vision:
      "To make Karnataka the leading state for competitive table soccer in India.",
    foundedYear: "2018",
    teamDescription:
      "KTSA is managed by a dedicated committee of passionate players and administrators.",
  },
  contact: {
    email: "contact@ktsaofficial.in",
    phone: "+91 98765 43210",
    address: "Bangalore, Karnataka, India",
    mapEmbedUrl: "",
    formHeading: "Get in touch",
    formSubtext:
      "Have a question or want to join? Fill out the form and we will get back to you.",
  },
  rules: {
    generalRules:
      "1. All players must be registered KTSA members.\n2. Players must arrive 15 minutes before their scheduled match.\n3. Match decisions by the referee are final.",
    scoringRules:
      "Points are awarded based on placement: 1st = 100pts, 2nd = 75pts, 3rd = 60pts.",
    codeOfConduct:
      "All players are expected to maintain sportsmanship at all times. Unsporting behavior may result in disqualification.",
    disqualificationRules:
      "A player may be disqualified for: repeated unsporting behavior, no-show after 10 minutes, or violation of equipment rules.",
    lastUpdated: "January 2025",
  },
  footer: {
    footerTagline: "Promoting table soccer across Karnataka",
    instagram: "https://instagram.com/ktsaofficial",
    facebook: "",
    twitter: "",
    youtube: "",
    whatsapp: "",
    copyrightText: "© 2025 KTSA. All rights reserved.",
  },
};
