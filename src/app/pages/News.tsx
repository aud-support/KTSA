import { motion } from "motion/react";
import { useState } from "react";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { newsArticles } from "../data/newsData";

const categories = ["All", "Global", "KTSA", "Events"];

export function News() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const filteredArticles =
    selectedCategory === "All"
      ? newsArticles
      : newsArticles.filter((a) => a.category === selectedCategory);

  const featuredArticle = newsArticles.find((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen pt-20">
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="relative h-[38vh] min-h-[220px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://png.pngtree.com/thumb_back/fh260/background/20230702/pngtree-intense-close-up-of-3d-rendered-foosball-table-game-image_3738127.jpg"
            alt="News hero"
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
              onClick={() => navigate(`/news/${featuredArticle.id}`)}
              className="relative h-[350px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden group cursor-pointer"
              style={{ boxShadow: "0 20px 60px rgba(0, 229, 255, 0.3)" }}
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
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-ktsa-accent mb-3 max-w-xl leading-tight group-hover:text-white transition-colors duration-300">
                  {featuredArticle.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm sm:text-base md:text-lg text-ktsa-text mb-4 max-w-md leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                {/* Date + Read more */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-ktsa-text/70 text-sm">
                    <Calendar size={16} />
                    <span>
                      {new Date(featuredArticle.date).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-ktsa-accent font-bold text-sm group-hover:gap-3 transition-all duration-300">
                    Read More <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Category Tabs ─────────────────────────────────────── */}
      <section className="bg-ktsa-bg/95 py-3 sticky top-20 z-40 border-b border-ktsa-accent/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-3">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-7 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
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
      </section>

      {/* ── News Grid ─────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative">
        {/* Faint background texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1690073939470-bc10bde2e8f5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {regularArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -15, scale: 1.02 }}
                onClick={() => navigate(`/news/${article.id}`)}
                className="max-w-xs w-full mx-auto bg-gradient-to-br from-ktsa-primary/40 to-ktsa-secondary/30 rounded-3xl overflow-hidden backdrop-blur-sm border-2 border-ktsa-accent/30 hover:border-ktsa-accent transition-all duration-300 group cursor-pointer"
                style={{ boxShadow: "0 10px 40px rgba(0, 229, 255, 0.15)" }}
              >
                {/* Image */}
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

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-ktsa-text/60 text-sm mb-4">
                    <Calendar size={16} />
                    <span className="font-semibold">
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-ktsa-accent mb-4 group-hover:text-white transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-ktsa-text/70 line-clamp-3 text-sm mb-4">
                    {article.excerpt}
                  </p>
                  <span className="flex items-center gap-1.5 text-ktsa-primary font-bold text-sm group-hover:text-ktsa-accent group-hover:gap-3 transition-all duration-300">
                    Read More <ArrowRight size={15} />
                  </span>
                </div>
              </motion.article>
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
