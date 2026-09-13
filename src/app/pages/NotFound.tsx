import { motion } from "motion/react";
import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-ktsa-bg">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, var(--ktsa-accent) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1
            className="text-[10rem] sm:text-[14rem] font-black leading-none select-none"
            style={{
              background:
                "linear-gradient(135deg, var(--ktsa-accent) 0%, var(--ktsa-primary) 50%, var(--ktsa-highlight) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: "drop-shadow(0 0 40px rgba(0,229,255,0.25))",
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-ktsa-text mb-3">
            Page Not Found
          </h2>
          <p className="text-ktsa-text/60 text-sm sm:text-base leading-relaxed">
            Looks like this page went out of bounds. The page you're looking for
            doesn't exist or may have been moved.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-ktsa-primary/70 text-ktsa-text font-bold rounded-full hover:bg-ktsa-accent transition-all duration-300 w-full sm:w-auto"
            >
              <Home size={18} />
              Back to Home
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent border-2 border-ktsa-accent/40 text-ktsa-text/80 font-bold rounded-full hover:border-ktsa-accent hover:text-ktsa-accent transition-all duration-300 w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
