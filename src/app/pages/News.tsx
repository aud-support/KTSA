import { motion } from "motion/react";
import { useState } from "react";
import { Calendar, Tag } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const categories = ["All", "Global", "KTSA", "Events"];

const newsArticles = [
  {
    id: 1,
    title: "KTSA Officially Launched",
    excerpt:
      "The Karnataka Table Soccer Association (KTSA) proudly announces its official launch, bringing together players, clubs, and supporters to grow the sport across Karnataka.",
    date: "April 25, 2026",
    category: "KTSA",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0cm9waHklMjBjaGFtcGlvbnNoaXAlMjBhd2FyZHxlbnwxfHx8fDE3NzQ5MzgzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Karnataka Open",
    excerpt:
      "KTSA inaugurates Karnataka's first dedicated table soccer training academy, featuring state-of-the-art equipment and coaching from international experts.",
    date: "25th April, 2026, Bangalore",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1746396887626-6bd54c6b2181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGF0aGxldGVzJTIwY2VsZWJyYXRpbmclMjB2aWN0b3J5fGVufDF8fHx8MTc3NDkzODMwMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "Women's Foosball",
    excerpt:
      "An exclusive conversation with Karnataka's top-ranked player about his journey, training regimen, and aspirations for international competition.",
    date: "25th April, 2026, Near Silkboard",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1765607081473-8b44507dfdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0ZWFtJTIwY29tbXVuaXR5JTIwcGxheWVyc3xlbnwxfHx8fDE3NzQ5MzgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    title: "Banglore Foosball Tournament",
    excerpt:
      "Thrilling matches and unexpected upsets mark the opening day of the Bangalore Open Series with over 200 participants competing.",
    date: "29th March, 2026, Kormangla",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1666193183124-3f27c7800370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRhYmxlJTIwc29jY2VyJTIwYWN0aW9uJTIwZ2FtZXxlbnwxfHx8fDE3NzQ5MzgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    title: "ITSF World Championship Qualification Announced",
    excerpt:
      "KTSA players now eligible for direct qualification to the ITSF World Championship through performance in state tournaments.",
    date: "March 10, 2026",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1751916856395-3dd0c4fe49e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRvdXJuYW1lbnQlMjBjb21wZXRpdGl2ZSUyMHNwb3J0c3xlbnwxfHx8fDE3NzQ5MzgyOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 6,
    title: "Banglore Foosball Tournament",
    excerpt:
      "The women's division of KTSA tournaments has grown by 150% this year, with new players joining from across Karnataka.",
    date: "31 January, 2026, Whitefield",
    category: "KTSA",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1770067665792-9975acdec4fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzcG9ydHMlMjBzdGFkaXVtJTIwYXJlbmElMjBsaWdodHN8ZW58MXx8fHwxNzc0OTM4MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 7,
    title: "Youth Development Program Launch",
    excerpt:
      "New initiative aims to introduce table soccer to schools and colleges across Karnataka, nurturing the next generation of champions.",
    date: "February 28, 2026",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1652318694732-fa6532505a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMHNvY2NlciUyMHBsYXllciUyMGNvbmNlbnRyYXRpb258ZW58MXx8fHwxNzc0OTM4Mjk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 8,
    title: "Mysore City League Registration Open",
    excerpt:
      "Players from Mysore and surrounding areas can now register for the upcoming city league, scheduled for May 2026.",
    date: "February 25, 2026",
    category: "KTSA",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1560880792-3c36a3f17944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMGNsb3NlJTIwdXAlMjBnYW1lfGVufDF8fHx8MTc3NDkzODMwMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 9,
    title: "International Coach Workshop Success",
    excerpt:
      "Over 50 coaches attended the first international table soccer coaching workshop organized by KTSA in partnership with ITSF.",
    date: "February 20, 2026",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1746396887626-6bd54c6b2181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGF0aGxldGVzJTIwY2VsZWJyYXRpbmclMjB2aWN0b3J5fGVufDF8fHx8MTc3NDkzODMwMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function News() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles =
    selectedCategory === "All"
      ? newsArticles
      : newsArticles.filter((article) => article.category === selectedCategory);

  const featuredArticle = newsArticles.find((article) => article.featured);
  const regularArticles = filteredArticles.filter(
    (article) => !article.featured,
  );

  return (
    <div className="min-h-screen pt-20">
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="relative h-[38vh] min-h-[220px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://png.pngtree.com/thumb_back/fh260/background/20230702/pngtree-intense-close-up-of-3d-rendered-foosball-table-game-image_3738127.jpg"
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
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3">
              <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-primary bg-clip-text text-transparent">
                News &{" "}
              </span>
              Updates
            </h1>
            <p className="text-sm md:text-base text-ktsa-text/80 font-semibold">
              Stay informed with the latest from KTSA
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-12 px-4 bg-ktsa-bg">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[350px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden group cursor-pointer"
              style={{
                boxShadow: "0 20px 60px rgba(0, 229, 255, 0.3)",
              }}
            >
              <ImageWithFallback
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ktsa-bg via-ktsa-bg/70 to-transparent" />
              <div className="absolute inset-0 p-4 sm:p-6 md:p-10 flex flex-col justify-end">
                {/* Tags */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-ktsa-accent text-ktsa-text rounded-full text-xs font-bold">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-ktsa-accent text-ktsa-text rounded-full text-xs font-bold">
                    {featuredArticle.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ktsa-accent mb-3 max-w-xl leading-tight">
                  {featuredArticle.title}
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-ktsa-text mb-3 max-w-md leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                {/* Date */}
                <div className="flex items-center gap-2 text-ktsa-text/70 text-sm">
                  <Calendar size={16} />
                  <span>{featuredArticle.date}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category Tabs 
      <section className="bg-ktsa-bg/95 py-3 sticky top-20 z-40 border-b border-ktsa-accent/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "text-ktsa-text bg-ktsa-highlight shadow-lg scale-105"
                    : "bg-ktsa-primary/40 text-ktsa-text border-2 border-ktsa-accent/30 hover:border-ktsa-accent/60"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section> */}

      {/* News Grid */}
      <section className="py-12 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative">
        {/* Background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1690073939470-bc10bde2e8f5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zm9vc2JhbGx8ZW58MHx8MHx8fDA%3D")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {regularArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="max-w-xs w-full mx-auto bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 rounded-3xl overflow-hidden backdrop-blur-sm border-2 border-ktsa-accent/30 hover:border-ktsa-accent transition-all duration-300 group cursor-pointer"
                style={{
                  boxShadow: "0 10px 40px rgba(0, 229, 255, 0.15)",
                }}
              >
                <div className="relative h-40 overflow-hidden">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-ktsa-accent text-ktsa-text rounded-full">
                      <Tag size={16} />
                      <span className="font-bold">{article.category}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-ktsa-text/60 text-sm mb-4">
                    <Calendar size={16} />
                    <span className="font-semibold">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-black text-ktsa-accent mb-4 group-hover:text-white transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-ktsa-text/70 line-clamp-3 text-sm">
                    {article.excerpt}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {regularArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-ktsa-text/60 text-2xl">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
