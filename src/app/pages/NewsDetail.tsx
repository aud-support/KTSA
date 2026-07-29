import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { Calendar, Tag, ArrowLeft, User } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { newsArticles } from "../data/newsData";

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const article = newsArticles.find((a) => String(a.id) === id);

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

  const related = newsArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-20 bg-ktsa-bg">
      {/* Hero image */}
      {article.image && (
        <div className="relative w-full h-[40vh] min-h-[260px] overflow-hidden">
          <ImageWithFallback
            src={article.image}
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

        {/* Meta */}
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
            {new Date(article.date).toLocaleDateString("en-US", {
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
                {rel.image && (
                  <div className="h-32 overflow-hidden">
                    <ImageWithFallback
                      src={rel.image}
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
                    {new Date(rel.date).toLocaleDateString("en-US", {
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
