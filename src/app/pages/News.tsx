import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getArticles, NewsArticle } from "../../services/articlesService";
import { newsArticles as staticArticles } from "../data/newsData";

const categories = ["All", "Global", "KTSA", "Events"];

// Map static newsData shape → NewsArticle shape so the fallback works
const toNewsArticle = (a: (typeof staticArticles)[number]): NewsArticle => ({
  id: String(a.id),
  title: a.title,
  excerpt: a.excerpt,
  content: a.content,
  author: a.author,
  publishedDate: a.date,
  imageUrl: a.image,
  category: a.category,
  featured: a.featured,
});

export function News() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getArticles()
      .then((data) => {
        // If backend returns articles use them, otherwise fall back to static data
        setArticles(data.length > 0 ? data : staticArticles.map(toNewsArticle));
      })
      .catch(() => {
        setArticles(staticArticles.map(toNewsArticle));
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const featuredArticle = articles.find((a) => a.featured);
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

      {/* Loading skeleton */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-ktsa-accent/30 border-t-ktsa-accent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <>
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
                    src={featuredArticle.imageUrl ?? ""}
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
                          {new Date(featuredArticle.publishedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-ktsa-accent text-sm font-bold group-hover:gap-3 transition-all duration-300">
                        Read More <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* Category Filter */}
          <section className="py-6 px-4 bg-ktsa-bg">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-ktsa-accent text-ktsa-bg"
                        : "bg-ktsa-primary/10 text-ktsa-text hover:bg-ktsa-primary/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Articles Grid */}
          <section className="py-8 px-4 bg-ktsa-bg">
            <div className="max-w-6xl mx-auto">
              {regularArticles.length === 0 ? (
                <p className="text-center text-ktsa-text/50 py-16 text-lg">
                  No articles in this category yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      whileHover={{ y: -6 }}
                      onClick={() => navigate(`/news/${article.id}`)}
                      className="rounded-2xl overflow-hidden border border-ktsa-accent/20 hover:border-ktsa-accent/60 transition-all bg-ktsa-primary/5 cursor-pointer group"
                    >
                      {/* Thumbnail */}
                      <div className="h-44 overflow-hidden bg-ktsa-primary/10">
                        <ImageWithFallback
                          src={article.imageUrl ?? ""}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-5">
                        {/* Category tag */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-ktsa-primary/20 text-ktsa-primary border border-ktsa-primary/30 rounded-full text-xs font-bold">
                            <Tag size={11} />
                            {article.category}
                          </span>
                        </div>

                        <h3 className="font-black text-ktsa-text text-base leading-snug mb-2 line-clamp-2 group-hover:text-ktsa-accent transition-colors duration-300">
                          {article.title}
                        </h3>

                        <p className="text-sm text-ktsa-text/60 line-clamp-2 mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-xs text-ktsa-text/50">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(article.publishedDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="flex items-center gap-1 text-ktsa-accent font-bold group-hover:gap-2 transition-all">
                            Read <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
