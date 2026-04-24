import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { WinnerCard } from "../components/ui/WinnerCard";
import { CubePodium } from "../components/ui/CubePodium";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import malePlayer from "../../assets/male_avatar.jfif";
import femalePlayer from "../../assets/female_avatar.jfif";
import doublePlayer from "../../assets/doubles_avatar.jfif";

import Podium from "../components/ui/Podium";

const categories = ["Men", "Women", "Doubles"];
const rankingsData = {
  Men: [
    {
      rank: 1,
      name: "Nadeem",
      image: malePlayer,
      points: 140,
      matches: 4,
      wins: 2,
      trend: "up",
    },
    {
      rank: 2,
      name: "Saravanan",
      image: malePlayer,
      points: 140,
      matches: 4,
      wins: 2,
      trend: "same",
    },
    {
      rank: 3,
      name: "Manoj",
      image: malePlayer,
      points: 120,
      matches: 4,
      wins: 1,
      trend: "up",
    },
    { rank: 4, name: "Rejoy", points: 90, matches: 4, wins: 0, trend: "up" },
    { rank: 5, name: "Roshan", points: 80, matches: 4, wins: 0, trend: "same" },
    { rank: 6, name: "Rajan", points: 70, matches: 4, wins: 1, trend: "up" },
    { rank: 7, name: "Rishav", points: 70, matches: 4, wins: 1, trend: "same" },
    { rank: 8, name: "Kiran", points: 60, matches: 4, wins: 1, trend: "up" },
    { rank: 9, name: "Vinay", points: 60, matches: 4, wins: 1, trend: "same" },
    {
      rank: 10,
      name: "Harish",
      points: 50,
      matches: 4,
      wins: 0,
      trend: "down",
    },
    {
      rank: 11,
      name: "Praveen",
      points: 50,
      matches: 4,
      wins: 0,
      trend: "same",
    },
    { rank: 12, name: "Dinesh", points: 40, matches: 4, wins: 0, trend: "up" },
    {
      rank: 13,
      name: "Abhilash",
      points: 40,
      matches: 4,
      wins: 0,
      trend: "same",
    },
    {
      rank: 14,
      name: "Sandeep",
      points: 30,
      matches: 4,
      wins: 0,
      trend: "down",
    },
    { rank: 15, name: "Sunil", points: 30, matches: 4, wins: 0, trend: "same" },
    { rank: 16, name: "Arvind", points: 20, matches: 4, wins: 0, trend: "up" },
    { rank: 17, name: "Gokul", points: 20, matches: 4, wins: 0, trend: "same" },
    {
      rank: 18,
      name: "Lokesh",
      points: 10,
      matches: 4,
      wins: 0,
      trend: "down",
    },
    {
      rank: 19,
      name: "Mahesh",
      points: 10,
      matches: 4,
      wins: 0,
      trend: "same",
    },
    { rank: 20, name: "Nitin", points: 5, matches: 4, wins: 0, trend: "up" },
    { rank: 21, name: "Pavan", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 22, name: "Rohit", points: 5, matches: 4, wins: 0, trend: "down" },
    {
      rank: 23,
      name: "Shankar",
      points: 5,
      matches: 4,
      wins: 0,
      trend: "same",
    },
    { rank: 24, name: "Tarun", points: 5, matches: 4, wins: 0, trend: "up" },
    { rank: 25, name: "Uday", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 26, name: "Vimal", points: 5, matches: 4, wins: 0, trend: "down" },
    { rank: 27, name: "Yogesh", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 28, name: "Zakir", points: 5, matches: 4, wins: 0, trend: "up" },
    { rank: 29, name: "Aarav", points: 80, matches: 4, wins: 2, trend: "up" },
    {
      rank: 30,
      name: "Vihaan",
      points: 70,
      matches: 4,
      wins: 2,
      trend: "same",
    },
    { rank: 31, name: "Ishaan", points: 60, matches: 4, wins: 1, trend: "up" },
    {
      rank: 32,
      name: "Tanmay",
      points: 50,
      matches: 4,
      wins: 1,
      trend: "same",
    },
    { rank: 33, name: "Rohan", points: 40, matches: 4, wins: 0, trend: "down" },
    { rank: 34, name: "Advik", points: 30, matches: 4, wins: 0, trend: "same" },
    { rank: 35, name: "Yuvan", points: 20, matches: 4, wins: 0, trend: "up" },
    { rank: 36, name: "Krish", points: 10, matches: 4, wins: 0, trend: "same" },
    { rank: 37, name: "Nikhil", points: 10, matches: 4, wins: 0, trend: "up" },
    { rank: 38, name: "Tejas", points: 10, matches: 4, wins: 0, trend: "same" },
    {
      rank: 39,
      name: "Ruturaj",
      points: 10,
      matches: 4,
      wins: 0,
      trend: "down",
    },
    { rank: 40, name: "Soham", points: 10, matches: 4, wins: 0, trend: "same" },
    { rank: 41, name: "Dev", points: 5, matches: 4, wins: 0, trend: "up" },
    { rank: 42, name: "Aryan", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 43, name: "Mithun", points: 5, matches: 4, wins: 0, trend: "down" },
    {
      rank: 44,
      name: "Prajwal",
      points: 5,
      matches: 4,
      wins: 0,
      trend: "same",
    },
    { rank: 45, name: "Kushal", points: 5, matches: 4, wins: 0, trend: "up" },
  ],

  Women: [
    {
      rank: 1,
      name: "Akshatha",
      points: 40,
      matches: 4,
      wins: 0,
      trend: "up",
      image: femalePlayer,
    },
    {
      rank: 2,
      name: "Prashanthi",
      points: 40,
      matches: 4,
      wins: 0,
      trend: "same",
      image: femalePlayer,
    },
    {
      rank: 3,
      name: "Akila",
      points: 20,
      matches: 4,
      wins: 0,
      trend: "up",
      image: femalePlayer,
    },
    {
      rank: 4,
      name: "Amrithaa",
      points: 20,
      matches: 4,
      wins: 0,
      trend: "same",
    },
    { rank: 5, name: "Anusha", points: 20, matches: 4, wins: 0, trend: "same" },
    { rank: 6, name: "Bhavya", points: 15, matches: 4, wins: 0, trend: "up" },
    {
      rank: 7,
      name: "Chaitra",
      points: 15,
      matches: 4,
      wins: 0,
      trend: "same",
    },
    { rank: 8, name: "Deepa", points: 10, matches: 4, wins: 0, trend: "down" },
    { rank: 9, name: "Esha", points: 10, matches: 4, wins: 0, trend: "same" },
    { rank: 10, name: "Fathima", points: 5, matches: 4, wins: 0, trend: "up" },
    {
      rank: 11,
      name: "Gayathri",
      points: 5,
      matches: 4,
      wins: 0,
      trend: "same",
    },
    { rank: 12, name: "Harini", points: 5, matches: 4, wins: 0, trend: "down" },
    { rank: 13, name: "Ishita", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 14, name: "Janani", points: 5, matches: 4, wins: 0, trend: "up" },
    { rank: 15, name: "Kavya", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 16, name: "Aditi", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 17, name: "Sneha", points: 5, matches: 4, wins: 0, trend: "down" },
    { rank: 18, name: "Megha", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 19, name: "Neha", points: 5, matches: 4, wins: 0, trend: "up" },
    { rank: 20, name: "Pooja", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 21, name: "Ritika", points: 5, matches: 4, wins: 0, trend: "down" },
    { rank: 22, name: "Shreya", points: 5, matches: 4, wins: 0, trend: "same" },
    { rank: 23, name: "Tanisha", points: 5, matches: 4, wins: 0, trend: "up" },
    { rank: 24, name: "Varsha", points: 5, matches: 4, wins: 0, trend: "same" },
  ],
  U18: [
    {
      rank: 1,
      name: "Rohan Patil",
      points: 2450,
      matches: 35,
      wins: 29,
      trend: "up",
    },
    {
      rank: 2,
      name: "Aarav Sharma",
      points: 2380,
      matches: 33,
      wins: 27,
      trend: "up",
    },
    {
      rank: 3,
      name: "Ishaan Kumar",
      points: 2310,
      matches: 31,
      wins: 25,
      trend: "same",
    },
    {
      rank: 4,
      name: "Tanvi Rao",
      points: 2240,
      matches: 29,
      wins: 23,
      trend: "up",
    },
    {
      rank: 5,
      name: "Ananya Singh",
      points: 2170,
      matches: 27,
      wins: 21,
      trend: "down",
    },
  ],
  "18+": [
    {
      rank: 1,
      name: "Arjun Sharma",
      points: 2850,
      matches: 45,
      wins: 38,
      trend: "up",
    },
    {
      rank: 2,
      name: "Priya Menon",
      points: 2720,
      matches: 40,
      wins: 34,
      trend: "up",
    },
    {
      rank: 3,
      name: "Rahul Patel",
      points: 2680,
      matches: 42,
      wins: 35,
      trend: "same",
    },
    {
      rank: 4,
      name: "Anjali Desai",
      points: 2650,
      matches: 38,
      wins: 32,
      trend: "down",
    },
    {
      rank: 5,
      name: "Karthik Reddy",
      points: 2620,
      matches: 40,
      wins: 33,
      trend: "up",
    },
  ],

  Doubles: [
    {
      rank: 1,
      names: ["Manoj", "Saravanan"],

      points: 120,
      matches: 0,
      wins: 0,
      trend: "up",
      image: doublePlayer,
    },
    {
      rank: 2,
      names: ["Nadeem", "Rishav"],

      points: 70,
      matches: 0,
      wins: 0,
      trend: "same",
      image: doublePlayer,
    },
    {
      rank: 3,
      names: ["Nadeem", "Owais"],

      points: 50,
      matches: 0,
      wins: 0,
      trend: "up",
      image: doublePlayer,
    },
    {
      rank: 4,
      names: ["Dhinesh", "Rejoy"],
      points: 50,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 5,
      names: ["Rajan", "Sandeep"],
      points: 50,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 6,
      names: ["Felix", "Pravin"],
      points: 40,
      matches: 0,
      wins: 0,
      trend: "up",
    },
    {
      rank: 7,
      names: ["Bhargav", "Roshan"],
      points: 40,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 8,
      names: ["Akash", "Harshan"],
      points: 40,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 9,
      names: ["Manas", "Rajdeep"],
      points: 40,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 10,
      names: ["Parth", "Vinay"],
      points: 30,
      matches: 0,
      wins: 0,
      trend: "down",
    },
    {
      rank: 11,
      names: ["Jabus", "Santhosh"],
      points: 30,
      matches: 0,
      wins: 0,
      trend: "same",
    },

    {
      rank: 12,
      names: ["Akila", "Aman"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 13,
      names: ["Akshatha", "Jyoti"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 14,
      names: ["Akshatha", "Roshan"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 15,
      names: ["Akshay", "Anil"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 16,
      names: ["Akshay", "Sharanya"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 17,
      names: ["Alwin", "Arun"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 18,
      names: ["Amrithaa", "Vijay"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 19,
      names: ["Anil", "Bhargav"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 20,
      names: ["Anil", "Roshan"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 21,
      names: ["Anusha", "Vishwa"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 22,
      names: ["Aravind", "Sam"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 23,
      names: ["Abhishek", "Arush"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 24,
      names: ["Abhishek", "Biswajith"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 25,
      names: ["Abhishek", "Param"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 26,
      names: ["Azeez", "Solomon"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 27,
      names: ["Damodar", "Nitish"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 28,
      names: ["Dileep", "Venu"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 29,
      names: ["Dinesh", "Mainu"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 30,
      names: ["Dinesh", "Solomon"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 31,
      names: ["Gireesh", "Rejoy"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 32,
      names: ["Harshan", "Rejoy"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 33,
      names: ["Harshad", "Pravin"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 34,
      names: ["Huzaifa", "Owaiz"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 35,
      names: ["Avi Biswas", "Jitendra"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 36,
      names: ["Juned", "Shakif"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 37,
      names: ["Param", "Pranay"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 38,
      names: ["Pranay", "Prashanthi"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 39,
      names: ["Harshad", "Pravin"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 40,
      names: ["Rajan", "Ratheesh"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 41,
      names: ["Rakshit", "Saravana"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 42,
      names: ["Ratheesh", "Vishwa"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 43,
      names: ["Prashanthi", "Sandeep"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 44,
      names: ["Riyansh", "Shivakanth"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 45,
      names: ["Rohit", "Sunil"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 46,
      names: ["Aravind", "Sam"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 47,
      names: ["Saravana", "Rakshit"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 48,
      names: ["partner", "Saravanan"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
    {
      rank: 49,
      names: ["Nadeem", "partner"],
      points: 20,
      matches: 0,
      wins: 0,
      trend: "same",
    },
  ],
};

// Bar heights for podium animation: 2nd is medium, 1st is tallest, 3rd is shortest
const podiumHeights: Record<number, number> = { 1: 160, 2: 120, 3: 90 };

const rankMeta = {
  1: {
    icon: Trophy,
    gradient: "from-yellow-400 to-yellow-700",
    border: "border-yellow-400",
    badge: "from-yellow-400 to-yellow-600 text-yellow-900",
    glow: "rgba(255,215,0,0.45)",
    label: "Gold",
  },
  2: {
    icon: Medal,
    gradient: "from-gray-400 to-gray-600",
    border: "border-gray-400",
    badge: "from-gray-300 to-gray-500 text-gray-900",
    glow: "rgba(192,192,192,0.35)",
    label: "Silver",
  },
  3: {
    icon: Award,
    gradient: "from-orange-500 to-orange-700",
    border: "border-orange-700",
    badge: "from-orange-400 to-orange-600 text-orange-900",
    glow: "rgba(255,140,0,0.35)",
    label: "Bronze",
  },
};

// Podium order: 2nd left, 1st center, 3rd right
const podiumOrder = [1, 0, 2]; // indices into topThree array

export function Rankings() {
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("Men");

  const rankings = rankingsData[selectedCategory as keyof typeof rankingsData];
  const topThree = rankings.slice(0, 3);
  const restOfRankings = rankings;

  const totalPages = Math.ceil(restOfRankings.length / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  const paginatedRankings = restOfRankings.slice(startIndex, endIndex);

  // Replace your old getVisiblePages() with this smarter version
  // Use this final pagination logic
  const getVisiblePages = () => {
    const pages = [];

    // If page 1 or 2 => show 1 2 3
    if (currentPage <= 2) {
      for (let i = 1; i <= Math.min(3, totalPages); i++) {
        pages.push(i);
      }
    }

    // If page is last page => show last 3 pages
    else if (currentPage >= totalPages) {
      for (let i = totalPages - 2; i <= totalPages; i++) {
        if (i > 0) pages.push(i);
      }
    }

    // Middle pages => previous, current, next
    else {
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i <= totalPages) pages.push(i);
      }
    }

    // Show dots + last page (except when already included)
    if (pages[pages.length - 1] < totalPages) {
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedTournament, setSelectedTournament] = useState("All");
  const [yearOpen, setYearOpen] = useState(false);
  const [tournamentOpen, setTournamentOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  const tournamentRef = useRef<HTMLDivElement>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setYearOpen(false);
      }

      if (
        tournamentRef.current &&
        !tournamentRef.current.contains(event.target as Node)
      ) {
        setTournamentOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="relative h-[38vh] min-h-[220px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://www.bonziniusa.com/cdn/shop/articles/BonziniUSA-334538-Foosball-Table-Figurines-BlogBanner1.jpg?v=1728670624"
            alt="Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-ktsa-accent/20 via-transparent to-ktsa-highlight/20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-ktsa-accent mb-3">
              Ran<span className="text-ktsa-text">kings</span>
            </h1>

            <p className="text-sm md:text-base text-ktsa-text/80 font-semibold">
              Top performers in Karnataka table soccer
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Category Tabs & Filters ───────────────────────────── */}
      <section className="py-3 sticky top-20 z-40 border-b border-ktsa-accent/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex flex-row  justify-around items-center gap-3">
            {/* ── MOBILE: category dropdown ── */}
            <div
              className="relative md:hidden w-full max-w-[200px]"
              ref={categoryRef}
            >
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-2 text-sm px-4 py-1.5 w-full bg-ktsa-primary/75 text-ktsa-text border border-ktsa-accent/30 rounded-lg font-bold hover:border-ktsa-accent transition-colors justify-between"
              >
                {selectedCategory}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                />
              </button>
              {categoryOpen && (
                <div
                  className="absolute top-full mt-1 left-0 z-50 bg-ktsa-bg border border-ktsa-accent/30 rounded-lg overflow-hidden w-full"
                  style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                        setCategoryOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                        selectedCategory === category
                          ? "bg-ktsa-accent/20 text-ktsa-accent"
                          : "text-ktsa-text hover:bg-ktsa-primary/40"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden md:flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-1.5 rounded-full font-bold text-xs transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-ktsa-highlight text-ktsa-text shadow-lg scale-105"
                      : "bg-ktsa-accent/20 text-ktsa-text border border-ktsa-accent/80 hover:border-ktsa-accent"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Year Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative" ref={yearRef}>
                <button
                  onClick={() => {
                    setYearOpen(!yearOpen);
                    setTournamentOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm px-4 py-1.5 bg-ktsa-primary/75 text-ktsa-text border border-ktsa-accent/30 rounded-lg font-bold hover:border-ktsa-accent transition-colors min-w-[80px] justify-between"
                >
                  {selectedYear}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${yearOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {yearOpen && (
                  <div
                    className="absolute top-full mt-1 left-0 z-50 bg-ktsa-bg border border-ktsa-accent/30 rounded-lg overflow-hidden min-w-[80px]"
                    style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                  >
                    {["2026", "2025", "2024"].map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setYearOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                          selectedYear === year
                            ? "bg-ktsa-accent/20 text-ktsa-accent"
                            : "text-ktsa-text hover:bg-ktsa-primary/40"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tournament Dropdown */}
              <div className="relative" ref={tournamentRef}>
                <button
                  onClick={() => {
                    setTournamentOpen(!tournamentOpen);
                    setYearOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm px-4 py-1.5 bg-ktsa-primary/75 text-ktsa-text border border-ktsa-accent/30 rounded-lg font-bold hover:border-ktsa-accent transition-colors sm:min-w-[190px] min-w-[100px] justify-between"
                >
                  {selectedTournament}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${tournamentOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {tournamentOpen && (
                  <div
                    className="absolute top-full mt-1 left-0 z-50 bg-ktsa-bg border border-ktsa-accent/30 rounded-lg overflow-hidden min-w-[60px]"
                    style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                  >
                    {["All", "State", "City"].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setSelectedTournament(t);
                          setTournamentOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                          selectedTournament === t
                            ? "bg-ktsa-accent/20 text-ktsa-accent"
                            : "text-ktsa-text hover:bg-ktsa-primary/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="  bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1749410347670-542874c7da41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRhYmxlJTIwcGxheWVycyUyMGludGVuc2V8ZW58MXx8fHwxNzc0OTM5MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* ── podium───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4  max-w-7xl mx-auto py-8">
          {/* MOBILE — cube view */}
          <div className="sm:hidden flex flex-col items-center py-8">
            <CubePodium players={topThree} />
          </div>
          {/* DESKTOP */}
          <div className="hidden sm:flex items-end justify-center gap-3 sm:gap-6 h-[420px] w-full -mr-0.5">
            {/* ── Top 3 Podium ──────────────────────────────────────── */}
            <div className="max-w-full mx-auto relative z-10 sm:max-w-full">
              {/* Podium — all cards share the same baseline */}
              <div className="flex items-end justify-center gap-3 sm:gap-6 h-[420px] w-full -mr-0.5">
                {podiumOrder.map((playerIdx) => {
                  const player = topThree[playerIdx];
                  if (!player) return null;

                  const meta = rankMeta[player.rank as 1 | 2 | 3];
                  const Icon = meta.icon;

                  const cardHeight =
                    player.rank === 1
                      ? "320px"
                      : player.rank === 2
                        ? "280px"
                        : "250px";

                  return (
                    <motion.div
                      key={player.rank}
                      className="flex flex-col items-center"
                      style={{
                        width:
                          player.rank === 1
                            ? "clamp(110px, 30vw, 220px)"
                            : "clamp(95px, 26vw, 180px)",
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: 0.15 * playerIdx,
                      }}
                    >
                      {/* Player image card */}
                      <motion.div
                        className={`relative w-full rounded-2xl overflow-hidden border-2 ${meta.border} shadow-xl bg-black`}
                        initial={{ height: 0 }}
                        whileInView={{ height: cardHeight }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        whileHover={{
                          scale: 1.04,
                          y: -8,
                          boxShadow: "0 20px 40px rgba(255,255,255,0.5)",
                          transition: { duration: 0.25, ease: "easeOut" },
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {/* Background image */}
                        <img
                          src={player.image}
                          alt={
                            "name" in player
                              ? player.name
                              : player.names.join(" & ")
                          }
                          className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        {/* Bottom details */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                          <p className="text-white font-black text-sm sm:text-base leading-tight">
                            {"name" in player
                              ? player.name
                              : player.names.join(" & ")}
                          </p>

                          <p className="text-ktsa-accent font-black text-lg">
                            {player.points}
                          </p>
                          <p className="text-white/70 text-[11px] mb-2">PTS</p>

                          <div className="grid grid-cols-2 gap-2 text-white">
                            <div>
                              <p className="font-black text-sm">
                                {player.matches}
                              </p>
                              <p className="text-[10px] text-white/70">
                                Played
                              </p>
                            </div>
                            <div>
                              <p className="font-black text-sm">
                                {player.wins}
                              </p>
                              <p className="text-[10px] text-white/70">Wins</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Rank label */}
                      <div
                        className={`mt-2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${meta.gradient} text-white shadow-md`}
                      >
                        #{player.rank}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Winner Card */}
          <div className="relative lg:top-20 top-0 py-3 px-2">
            <WinnerCard player={rankings[0]} category={selectedCategory} />
          </div>
        </div>
      </section>

      {/* Rankings Table */}
      <section className="bg-ktsa-bg">
        <div
          className=" border border-ktsa-accent/30 backdrop-blur-sm overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(0,229,255,0.15)" }}
        >
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-2 px-5 py-3 bg-ktsa-primary/75 border-b border-ktsa-accent/30 font-black text-ktsa-text text-sm">
            <div>Rank</div>
            <div className="col-span-2">Player</div>
            <div className="text-right">Points</div>
            <div className="text-right">Matches</div>
            <div className="text-right">Wins</div>
          </div>

          {paginatedRankings.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-6 gap-2 px-5 py-2.5 border-b border-ktsa-accent/10 hover:bg-ktsa-primary/50 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-ktsa-text group-hover:text-ktsa-highlight transition-colors">
                  {player.rank}
                </span>
                {/* {player.trend === "up" && (
                  <TrendingUp size={14} className="text-green-500" />
                )}
                {player.trend === "down" && (
                  <TrendingUp size={14} className="text-red-500 rotate-180" />
                )} */}
              </div>
              <div className="col-span-2 text-ktsa-text  text-sm flex items-center">
                {"name" in player ? player.name : player.names.join(" & ")}
              </div>
              <div className="text-right text-ktsa-text font-semibold text-sm flex items-center justify-end">
                {player.points}
              </div>
              <div className="text-right text-ktsa-text font-semibold text-sm flex items-center justify-end">
                {player.matches}
              </div>
              <div className="text-right text-ktsa-text font-semibold text-sm flex items-center justify-end">
                {player.wins}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-ktsa-accent/20 bg-ktsa-primary/75">
        {/* Records Info */}
        <div className="text-sm text-ktsa-text font-semibold">
          Showing {startIndex + 1} - {Math.min(endIndex, restOfRankings.length)}{" "}
          of {restOfRankings.length}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1">
          {/* Prev */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="w-9 h-9 flex items-center justify-center text-ktsa-text font-extrabold rounded border border-ktsa-accent/20 disabled:opacity-40 hover:bg-ktsa-primary"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Numbers */}
          {getVisiblePages().map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-2 text-ktsa-text">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(Number(page))}
                className={`w-6 h-6 rounded font-bold text-sm transition ${
                  currentPage === page
                    ? "bg-ktsa-primary text-ktsa-text"
                    : "border border-ktsa-accent/20 text-ktsa-text hover:bg-ktsa-primary"
                }`}
              >
                {page}
              </button>
            ),
          )}

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="w-9 h-9 flex items-center justify-center text-ktsa-text font-extrabold rounded border border-ktsa-accent/20 disabled:opacity-40 hover:bg-ktsa-primary"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
