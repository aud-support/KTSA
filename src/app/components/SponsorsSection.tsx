import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getSponsors, type Sponsor } from "../../services/sponsorService";

export function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    getSponsors()
      .then((data) => { if (data.length > 0) setSponsors(data); })
      .catch(console.error);
  }, []);

  // Always render — show CTA card even with no sponsors
  return (
    <section className="py-14 md:py-20 px-4 bg-gradient-to-b from-[#050d08] to-ktsa-bg">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-bold tracking-[0.2em] text-ktsa-accent/50 uppercase mb-2">
            Partners & Sponsors
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ktsa-text leading-tight">
            Supported by those who{" "}
            <span className="bg-gradient-to-r from-ktsa-accent to-ktsa-highlight bg-clip-text text-transparent">
              believe in the game
            </span>
          </h2>
        </motion.div>

        {/* ── Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="
                relative flex items-center justify-center
                aspect-[3/2]
                rounded-2xl
                border border-ktsa-accent/15
                bg-white/[0.03]
                overflow-hidden
                p-4
              "
            >
              {sponsor.imageUrl ? (
                <img
                  src={sponsor.imageUrl}
                  alt={sponsor.name}
                  className="
                    max-w-full max-h-full object-contain
                    select-none pointer-events-none
                  "
                  draggable={false}
                />
              ) : (
                <span className="text-white text-xs font-bold text-center leading-tight">
                  {sponsor.name}
                </span>
              )}
            </motion.div>
          ))}

          {/* ── Become a Sponsor CTA card — always last ── */}
          <motion.a
            href="mailto:info@ktsa.in"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: sponsors.length * 0.05 }}
            className="
              group flex flex-col items-center justify-center
              aspect-[3/2]
              rounded-2xl
              border-2 border-dashed border-ktsa-accent/30
              bg-ktsa-accent/5
              hover:bg-ktsa-accent/10
              hover:border-ktsa-accent/60
              hover:shadow-[0_0_30px_rgba(0,229,255,0.12)]
              transition-all duration-300
              p-4 text-center
              cursor-pointer
            "
          >
            <span className="text-ktsa-accent font-black text-sm sm:text-base leading-tight group-hover:scale-105 transition-transform duration-300">
              Become
              <br />a Sponsor
            </span>
            <span className="text-ktsa-accent/50 text-[11px] mt-1 font-medium">
              info@ktsa.in
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
