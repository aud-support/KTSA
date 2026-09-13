import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { Calendar, Tag, ArrowLeft, User, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { getArticles, NewsArticle } from "../../services/articlesService";
import { newsArticles as staticArticles } from "../data/newsData";

// Map static newsData shape → NewsArticle shape so the fallback works
const staticMapped: NewsArticle[] = staticArticles.map((a) => ({
  id: String(a.id),
  title: a.title,
  excerpt: a.excerpt,
  content: a.content,
  author: a.author,
  publishedDate: a.date,
  imageUrl: a.image,
  category: a.category,
  featured: a.featured,
  links: [],
}));

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles()
      .then((data) => setAllArticles(data.length > 0 ? data : staticMapped))
      .catch(() => setAllArticles(staticMapped))
      .finally(() => setLoading(false));
  }, []);

  const article = allArticles.find((a) => a.id === id);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-ktsa-bg">
        <div className="w-8 h-8 border-4 border-ktsa-accent/30 border-t-ktsa-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6 bg-ktsa-bg px-4">
        <h2 className="text-2xl font-black text-ktsa-text">Article not found</h2>
        <button
          onClick={() => navigate("/news")}
          className="flex items-center gap-2 px-6 py-3 bg-ktsa-primary/70 text-ktsa-text font-bold rounded-full hover:bg-ktsa-accent transition-all"
        >
          <ArrowLeft size={18} />
          Back to News
        </button>
      </div>
    );
  }

  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const hasLinks = article.links && article.links.length > 0;

  return (
    <div className="min-h-screen pt-20 bg-ktsa-bg">
      {/* Hero image */}
      {article.imageUrl && (
        <div className="relative w-full h-[40vh] min-h-[260px] overflow-hidden">
          <ImageWithFallback
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ktsa-bg via-ktsa-bg/50 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/news")}
          className="flex items-center gap-2 text-ktsa-text/60 hover:text-ktsa-accent transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={18} />
          Back to News
        </motion.button>

        {/* Meta badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-4"
        >
          {article.featured && (
            <span className="px-3 py-1 bg-ktsa-accent text-ktsa-bg rounded-full text-xs font-bold">
              Featured
            </span>
          )}
          <span className="flex items-center gap-1.5 px-3 py-1 bg-ktsa-primary/20 text-ktsa-primary border border-ktsa-primary/30 rounded-full text-xs font-bold">
            <Tag size={12} />
            {article.category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-ktsa-text leading-tight mb-5"
        >
          {article.title}
        </motion.h1>

        {/* Author + Date */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-5 text-sm text-ktsa-text/60 mb-8 border-b border-ktsa-accent/20 pb-6"
        >
          <span className="flex items-center gap-1.5">
            <User size={15} />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={15} />
            {new Date(article.publishedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </motion.div>

        {/* Excerpt / lead */}
        {article.excerpt && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-ktsa-text/80 font-semibold mb-6 leading-relaxed"
          >
            {article.excerpt}
          </motion.p>
        )}

        {/* Full content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert max-w-none text-ktsa-text/80 leading-relaxed space-y-4"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {article.content}
        </motion.div>

        {/* ── Hyperlinks section ───────────────────────────────── */}
        {hasLinks && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-10 pt-8 border-t border-ktsa-accent/20"
          >
            <p className="text-xs font-bold tracking-widest text-ktsa-accent/60 uppercase mb-4">
              Related Links
            </p>
            <div className="flex flex-wrap gap-3">
              {article.links!.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ktsa-accent/40 text-ktsa-accent font-bold text-sm hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300 group"
                >
                  <ExternalLink
                    size={14}
                    className="group-hover:scale-110 transition-transform"
                  />
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h3 className="text-lg font-black text-ktsa-text mb-6 border-t border-ktsa-accent/20 pt-10">
            More from{" "}
            <span className="text-ktsa-accent">{article.category}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => (
              <motion.div
                key={rel.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/news/${rel.id}`)}
                className="cursor-pointer rounded-2xl overflow-hidden border border-ktsa-accent/20 hover:border-ktsa-accent/60 transition-all bg-ktsa-primary/10"
              >
                {rel.imageUrl && (
                  <div className="h-32 overflow-hidden">
                    <ImageWithFallback
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="font-bold text-ktsa-text text-sm line-clamp-2 mb-2">
                    {rel.title}
                  </p>
                  <p className="text-xs text-ktsa-text/50 flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(rel.publishedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
