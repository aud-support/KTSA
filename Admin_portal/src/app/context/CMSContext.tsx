import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  format: string;
  status: "upcoming" | "ongoing" | "completed";
  venue: string;
  maxParticipants: number;
  prizePool: string;
  challengeBracketUrl: string;
  description: string;
  categories: {
    openSingle: {
      enabled: boolean;
      fee: string;
    };
    openDouble: {
      enabled: boolean;
      fee: string;
    };
    mixedDouble: {
      enabled: boolean;
      fee: string;
    };
    womenSingle: {
      enabled: boolean;
      fee: string;
    };
  };
}

export interface Rule {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ArticleLink {
  label: string;
  url: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  author: string;
  imageUrl?: string;
  category?: string;
  featured?: boolean;
  links?: ArticleLink[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  pricing: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface HomePage {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl: File | null;
  featuredTournaments: string[];
  videoUrls: string[];
}

export interface AboutUs {
  title: string;
  content: string;
  mission: string;
  vision: string;
}

export interface Footer {
  copyrightText: string;
  quickLinks: { label: string; url: string }[];
}

interface CMSContextType {
  tournaments: Tournament[];
  rules: Rule[];
  articles: Article[];
  services: Service[];
  sponsors: Sponsor[];
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
  homePage: HomePage;
  aboutUs: AboutUs;
  footer: Footer;
  addTournament: (tournament: Omit<Tournament, "id">) => void;
  updateTournament: (id: string, tournament: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  addRule: (rule: Omit<Rule, "id">) => void;
  updateRule: (id: string, rule: Partial<Rule>) => void;
  deleteRule: (id: string) => void;
  addArticle: (article: Omit<Article, "id"> & { id?: string }) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  setAllArticles: (articles: Article[]) => void;
  addService: (service: Omit<Service, "id"> & { id?: string }) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  setAllServices: (services: Service[]) => void;
  addSponsor: (sponsor: Omit<Sponsor, "id">) => void;
  updateSponsor: (id: string, sponsor: Partial<Sponsor>) => void;
  deleteSponsor: (id: string) => void;
  updateContactInfo: (info: ContactInfo) => void;
  updateSocialLinks: (links: SocialLinks) => void;
  updateHomePage: (page: HomePage) => void;
  updateAboutUs: (about: AboutUs) => void;
  updateFooter: (footer: Footer) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const defaultCategories = {
  openSingle: {
    enabled: false,
    fee: "",
  },
  openDouble: {
    enabled: false,
    fee: "",
  },
  mixedDouble: {
    enabled: false,
    fee: "",
  },
  womenSingle: {
    enabled: false,
    fee: "",
  },
};

const initialTournaments: Tournament[] = [
  {
    id: "1",
    name: "KTSA Open 2025",
    startDate: "2025-03-15",
    endDate: "2025-03-15",
    format: "Single Elimination",
    status: "completed",
    venue: "Koramangala Indoor Stadium",
    maxParticipants: 16,
    prizePool: "50000",
    challengeBracketUrl: "https://challonge.com/ktsa-open-2025",
    description: "Annual open tournament for all skill levels.",
    categories: structuredClone(defaultCategories),
  },
  {
    id: "2",
    name: "KTSA Summer Cup 2026",
    startDate: "2026-06-10",
    endDate: "2026-06-12",
    format: "Round Robin",
    status: "upcoming",
    venue: "Koramangala Indoor Stadium",
    maxParticipants: 16,
    prizePool: "75000",
    challengeBracketUrl: "https://challonge.com/ktsa-summer-cup",
    description: "Summer championship with round-robin format.",
    categories: structuredClone(defaultCategories),
  },
  {
    id: "3",
    name: "KTSA Club League S1",
    startDate: "2025-01-20",
    endDate: "2025-03-20",
    format: "League",
    status: "completed",
    venue: "Various Locations",
    maxParticipants: 20,
    prizePool: "100000",
    challengeBracketUrl: "https://challonge.com/ktsa-club-league-s1",
    description: "First season of our club league.",
    categories: structuredClone(defaultCategories),
  },
  {
    id: "4",
    name: "Bangalore Masters 2026",
    startDate: "2026-07-22",
    endDate: "2026-07-24",
    format: "Single Elimination",
    status: "upcoming",
    venue: "Indiranagar Sports Complex",
    maxParticipants: 32,
    prizePool: "150000",
    challengeBracketUrl: "https://challonge.com/blr-masters-2026",
    description: "Premier tournament featuring top players from across India.",
    categories: structuredClone(defaultCategories),
  },
  {
    id: "5",
    name: "KTSA Winter Championship",
    startDate: "2025-12-15",
    endDate: "2025-12-17",
    format: "Swiss System",
    status: "completed",
    venue: "HSR Layout Sports Arena",
    maxParticipants: 24,
    prizePool: "80000",
    challengeBracketUrl: "https://challonge.com/ktsa-winter-2025",
    description: "Year-end championship using Swiss system format.",
    categories: structuredClone(defaultCategories),
  },
  {
    id: "6",
    name: "KTSA Youth Cup 2026",
    startDate: "2026-08-05",
    endDate: "2026-08-06",
    format: "Single Elimination",
    status: "upcoming",
    venue: "Jayanagar Community Hall",
    maxParticipants: 16,
    prizePool: "40000",
    challengeBracketUrl: "https://challonge.com/ktsa-youth-2026",
    description: "Tournament for players under 18 years old.",
    categories: structuredClone(defaultCategories),
  },
  {
    id: "7",
    name: "KTSA Doubles Championship",
    startDate: "2026-05-20",
    endDate: "2026-05-21",
    format: "Round Robin",
    status: "ongoing",
    venue: "Koramangala Indoor Stadium",
    maxParticipants: 16,
    prizePool: "60000",
    challengeBracketUrl: "https://challonge.com/ktsa-doubles-2026",
    description: "Doubles format tournament with teams of two players.",
    categories: structuredClone(defaultCategories),
  },
];

const initialRules: Rule[] = [
  {
    id: "1",
    title: "Player Registration",
    content:
      "All players must register at least 48 hours before the tournament starts. Registration includes submitting valid ID proof and payment of entry fees.",
    order: 1,
  },
  {
    id: "2",
    title: "Equipment Standards",
    content:
      "Players must use ITTF-approved equipment. Rackets will be checked before matches. Custom rackets must meet regulation standards.",
    order: 2,
  },
  {
    id: "3",
    title: "Match Format",
    content:
      "All matches are best of 5 games (11 points each). Service alternates every 2 points. Deuce rules apply at 10-10.",
    order: 3,
  },
];

// Articles are loaded from the backend; start with an empty list.
const initialArticles: Article[] = [];

// Services are loaded from the backend; start with an empty list.
const initialServices: Service[] = [];

const initialSponsors: Sponsor[] = [
  {
    id: "1",
    name: "Butterfly",
    logoUrl: "",
    websiteUrl: "https://www.butterfly-global.com",
    tier: "platinum",
  },
  {
    id: "2",
    name: "Stiga",
    logoUrl: "",
    websiteUrl: "https://www.stiga.com",
    tier: "gold",
  },
];

export const CMSProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tournaments, setTournaments] =
    useState<Tournament[]>(initialTournaments);
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "admin@ktsaofficial.in",
    phone: "+91 98765 43210",
    address: "Koramangala, Bangalore, India",
  });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: "https://facebook.com/ktsa",
    twitter: "https://twitter.com/ktsa",
    instagram: "https://instagram.com/ktsa",
    youtube: "https://youtube.com/ktsa",
  });
  const [homePage, setHomePage] = useState<HomePage>({
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    heroImageUrl: null,
    featuredTournaments: ["1", "2"],
    videoUrls: [""],
  });
  const [aboutUs, setAboutUs] = useState<AboutUs>({
    title: "About KTSA",
    content:
      "The Karnataka Table Soccer Association (KTSA) is the premier organization dedicated to promoting and developing table tennis in Karnataka.",
    mission:
      "To foster excellence in table tennis and provide opportunities for players of all skill levels.",
    vision: "To make Karnataka a leading hub for table tennis in India.",
  });
  const [footer, setFooter] = useState<Footer>({
    copyrightText: "© 2025 KTSA. All rights reserved.",
    quickLinks: [
      { label: "Privacy Policy", url: "/privacy" },
      { label: "Terms of Service", url: "/terms" },
    ],
  });

  const addTournament = (tournament: Omit<Tournament, "id">) => {
    const newTournament = { ...tournament, id: Date.now().toString() };
    setTournaments([...tournaments, newTournament]);
  };

  const updateTournament = (id: string, tournament: Partial<Tournament>) => {
    setTournaments(
      tournaments.map((t) => (t.id === id ? { ...t, ...tournament } : t)),
    );
  };

  const deleteTournament = (id: string) => {
    setTournaments(tournaments.filter((t) => t.id !== id));
  };

  const addRule = (rule: Omit<Rule, "id">) => {
    const newRule = { ...rule, id: Date.now().toString() };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, rule: Partial<Rule>) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, ...rule } : r)));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const addArticle = (article: Omit<Article, "id"> & { id?: string }) => {
    // Use the id from the backend if present; otherwise generate a local one
    const newArticle = { ...article, id: article.id ?? Date.now().toString() } as Article;
    setArticles((prev) => [...prev, newArticle]);
  };

  const updateArticle = (id: string, article: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...article } : a)),
    );
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const setAllArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
  };

  const addService = (service: Omit<Service, "id"> & { id?: string }) => {
    // Use the id from the backend if present; otherwise generate a local one
    const newService = { ...service, id: service.id ?? Date.now().toString() } as Service;
    setServices((prev) => [...prev, newService]);
  };

  const updateService = (id: string, service: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...service } : s)),
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const setAllServices = (newServices: Service[]) => {
    setServices(newServices);
  };

  const addSponsor = (sponsor: Omit<Sponsor, "id">) => {
    const newSponsor = { ...sponsor, id: Date.now().toString() };
    setSponsors([...sponsors, newSponsor]);
  };

  const updateSponsor = (id: string, sponsor: Partial<Sponsor>) => {
    setSponsors(sponsors.map((s) => (s.id === id ? { ...s, ...sponsor } : s)));
  };

  const deleteSponsor = (id: string) => {
    setSponsors(sponsors.filter((s) => s.id !== id));
  };

  const updateContactInfo = (info: ContactInfo) => setContactInfo(info);
  const updateSocialLinks = (links: SocialLinks) => setSocialLinks(links);
  const updateHomePage = (page: HomePage) => setHomePage(page);
  const updateAboutUs = (about: AboutUs) => setAboutUs(about);
  const updateFooter = (footerData: Footer) => setFooter(footerData);

  return (
    <CMSContext.Provider
      value={{
        tournaments,
        rules,
        articles,
        services,
        sponsors,
        contactInfo,
        socialLinks,
        homePage,
        aboutUs,
        footer,
        addTournament,
        updateTournament,
        deleteTournament,
        addRule,
        updateRule,
        deleteRule,
        addArticle,
        updateArticle,
        deleteArticle,
        setAllArticles,
        addService,
        updateService,
        deleteService,
        setAllServices,
        addSponsor,
        updateSponsor,
        deleteSponsor,
        updateContactInfo,
        updateSocialLinks,
        updateHomePage,
        updateAboutUs,
        updateFooter,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};
