import { Service } from "../../services/servicesService";

export const defaultServices: Service[] = [
  {
    id: "1",
    name: "Table Soccer Rental Services",
    description:
      "Professional-grade foosball tables available for rent for your events, tournaments, or recreational spaces.",
    icon: "Trophy",
    features: [
      "Professional Bonzini and Tornado tables",
      "Flexible rental periods (hourly, daily, weekly)",
      "Setup and maintenance included",
      "Insurance coverage available",
      "Delivery and pickup service",
    ],
    pricing: "₹500/hour • ₹3,000/day",
    imageUrl:
      "https://images.unsplash.com/photo-1667872798838-3e6a16dd4370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRhYmxlJTIwcmVudGFsfGVufDB8fHx8MTc3NDkzODUwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    displayOrder: 0,
  },
  {
    id: "2",
    name: "Event Organization Services",
    description:
      "Complete tournament and event management from planning to execution with professional coordination.",
    icon: "Zap",
    features: [
      "Full tournament organization and management",
      "Venue coordination and setup",
      "Player registration and bracket management",
      "Live scoring and updates",
      "Award ceremonies and photography",
    ],
    pricing: "₹10,000 onwards",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMG9yZ2FuaXphdGlvbiUyMHNlcnZpY2VzfGVufDB8fHx8MTc3NDkzODUwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    displayOrder: 1,
  },
  {
    id: "3",
    name: "Coaching & Training Services",
    description:
      "Professional coaching from certified trainers to improve your foosball skills at all levels.",
    icon: "Users",
    features: [
      "One-on-one personalized coaching",
      "Group training sessions",
      "Technique and strategy development",
      "Tournament preparation programs",
      "Youth development programs",
    ],
    pricing: "₹1,000/session • Packages available",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FjaGluZyUyMHNlcnZpY2VzfGVufDB8fHx8MTc3NDkzODUwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    displayOrder: 2,
  },
];
