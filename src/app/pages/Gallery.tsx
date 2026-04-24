import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Masonry from "react-responsive-masonry";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Camera } from "lucide-react";

const years = ["2026", "2025", "2024", "2023"];
const tournaments = [
  "All Tournaments",
  "State Championship",
  "Bangalore Open",
  "Mysore League",
  "Training Sessions",
];

const galleryImages = [
  {
    id: 1,
    src: "https://instagram.fblr22-2.fna.fbcdn.net/v/t51.82787-15/656668225_17931958677212904_5687285780780719136_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=100&ig_cache_key=Mzg2MzY0NDU2NDczNzkyNDAyNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTA4MC5oZHIuQzMifQ%3D%3D&_nc_ohc=_z93E_wM2A0Q7kNvwGy36In&_nc_oc=AdoGA-uTUmR-TR148C5XAwjU9GKbTBIcxCh712JT44DuYEXuWCTcFebw_ouH0JNDvxLeDLX-87xaKO56yDXZiv8K&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=instagram.fblr22-2.fna&_nc_gid=7jczeJ8BNcxKUPfGqBRFnA&_nc_ss=7a32e&oh=00_Af1pOx6xMOPebKE9MLXH2J246I_WyzMBeZhwGABgkS8vFw&oe=69DEC52F",
    tournament: "State Championship",
    year: "2026",
    caption: "Intense competition at the State Championship finals",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1751916856395-3dd0c4fe49e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRvdXJuYW1lbnQlMjBjb21wZXRpdGl2ZSUyMHNwb3J0c3xlbnwxfHx8fDE3NzQ5MzgyOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "Bangalore Open",
    year: "2026",
    caption: "Players competing in the Bangalore Open Series",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1770067665792-9975acdec4fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzcG9ydHMlMjBzdGFkaXVtJTIwYXJlbmElMjBsaWdodHN8ZW58MXx8fHwxNzc0OTM4MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "State Championship",
    year: "2025",
    caption: "The arena packed with enthusiastic spectators",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1652318694732-fa6532505a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMHNvY2NlciUyMHBsYXllciUyMGNvbmNlbnRyYXRpb258ZW58MXx8fHwxNzc0OTM4Mjk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "Training Sessions",
    year: "2026",
    caption: "Focused training session with expert coaches",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1560880792-3c36a3f17944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMGNsb3NlJTIwdXAlMjBnYW1lfGVufDF8fHx8MTc3NDkzODMwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "Bangalore Open",
    year: "2025",
    caption: "Close-up action from the championship match",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0cm9waHklMjBjaGFtcGlvbnNoaXAlMjBhd2FyZHxlbnwxfHx8fDE3NzQ5MzgzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "State Championship",
    year: "2026",
    caption: "Champion lifting the trophy in celebration",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1746396887626-6bd54c6b2181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGF0aGxldGVzJTIwY2VsZWJyYXRpbmclMjB2aWN0b3J5fGVufDF8fHx8MTc3NDkzODMwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "Mysore League",
    year: "2025",
    caption: "Team celebrating their victory together",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1765607081473-8b44507dfdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0ZWFtJTIwY29tbXVuaXR5JTIwcGxheWVyc3xlbnwxfHx8fDE3NzQ5MzgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "Training Sessions",
    year: "2025",
    caption: "Community gathering at KTSA headquarters",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1666193183124-3f27c7800370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRhYmxlJTIwc29jY2VyJTIwYWN0aW9uJTIwZ2FtZXxlbnwxfHx8fDE3NzQ5MzgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "Bangalore Open",
    year: "2024",
    caption: "Historic moment from 2024 tournament",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1751916856395-3dd0c4fe49e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRvdXJuYW1lbnQlMjBjb21wZXRpdGl2ZSUyMHNwb3J0c3xlbnwxfHx8fDE3NzQ5MzgyOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "State Championship",
    year: "2024",
    caption: "Competitive spirit on full display",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1770067665792-9975acdec4fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzcG9ydHMlMjBzdGFkaXVtJTIwYXJlbmElMjBsaWdodHN8ZW58MXx8fHwxNzc0OTM4MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "Mysore League",
    year: "2024",
    caption: "Spectacular venue lighting",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1652318694732-fa6532505a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMHNvY2NlciUyMHBsYXllciUyMGNvbmNlbnRyYXRpb258ZW58MXx8fHwxNzc0OTM4Mjk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tournament: "Training Sessions",
    year: "2024",
    caption: "Dedication and focus in training",
  },
  {
    id: 13,
    src: "https://instagram.fblr22-2.fna.fbcdn.net/v/t51.82787-15/651809172_17929971138212904_8599779955604411425_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzg1NDE5MTQ5Mjg3Mzc1MzMwOA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=yX7LgRMIQYUQ7kNvwFLtZm_&_nc_oc=Ado0810tkh0-DRZEl_9OvHoflc1z2kgk_z8MIqfvqTwSU3ijB9OfOjcb6se9-beiw5ZhDNyGVhI9pCPM7AyBohmI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fblr22-2.fna&_nc_gid=YoZ1rQkgT1Ar7wj0nn9ziA&_nc_ss=7a32e&oh=00_Af02SybaltYtXxj3draARD50kbDMHd31ed8uwZocuXtopw&oe=69D2B6A7",
    tournament: "Training Sessions",
    year: "2024",
    caption: "March Showdown",
  },
];

export function Gallery() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedTournament, setSelectedTournament] =
    useState("All Tournaments");
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filteredImages = galleryImages.filter((image) => {
    const yearMatch = image.year === selectedYear;
    const tournamentMatch =
      selectedTournament === "All Tournaments" ||
      image.tournament === selectedTournament;
    return yearMatch && tournamentMatch;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* ── Hero Banner ───────────────────────────────────────── */}
      <section className="relative h-[38vh] min-h-[220px] flex items-center justify-center overflow-hidden border-t border-ktsa-accent/30">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://www.bonziniusa.com/cdn/shop/articles/BonziniUSA-334538-Foosball-Table-Figurines-BlogBanner1.jpg?v=1728670624"
            alt="Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ktsa-bg/95 via-ktsa-bg/80 to-ktsa-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-ktsa-accent/10 via-transparent to-ktsa-highlight/10" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3">
              Gallery
            </h1>
            <p className="text-sm md:text-base text-ktsa-text/80 font-semibold">
              Capturing the passion and intensity of table soccer
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filters ───────────────────────────────────────────── */}
      <section className="py-3 px-3 bg-ktsa-bg/95 sticky top-20 z-40 border-b border-ktsa-accent/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 md:gap-8 items-start md:items-center justify-between">
            {/* Year tabs — scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 w-full md:w-auto md:overflow-visible">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`flex-shrink-0 px-5 py-1.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    selectedYear === year
                      ? "bg-gradient-to-r from-ktsa-accent to-ktsa-primary text-ktsa-bg scale-105"
                      : "bg-ktsa-primary/40 text-ktsa-text border border-ktsa-accent/30 hover:border-ktsa-accent/60"
                  }`}
                  style={{
                    boxShadow:
                      selectedYear === year
                        ? "0 0 20px rgba(0,229,255,0.4)"
                        : "none",
                  }}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Tournament dropdown */}
            <div className="w-full md:w-auto">
              <select
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
                className="w-full md:w-64 px-4 py-1.5 bg-ktsa-primary/40 text-ktsa-text border border-ktsa-accent/30 rounded-xl focus:outline-none focus:border-ktsa-accent transition-colors font-bold text-sm"
              >
                {tournaments.map((tournament) => (
                  <option key={tournament} value={tournament}>
                    {tournament}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery Grid ──────────────────────────────────────── */}
      <section className="py-10 px-2 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1757889693437-30a0290c4dcf?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZvb3NiYWxsfGVufDB8fDB8fHww")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {filteredImages.length > 0 ? (
            <Masonry columnsCount={3} gutter="1rem">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  className={`relative rounded-2xl overflow-hidden group ${isMobile ? "cursor-pointer" : "cursor-default"}`}
                  onClick={() => isMobile && setSelectedImage(image)}
                  style={{ boxShadow: "0 6px 24px rgba(0,229,255,0.08)" }}
                >
                  <ImageWithFallback
                    src={image.src}
                    alt={image.caption}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Hover overlay — desktop only */}
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-ktsa-bg via-ktsa-bg/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-ktsa-text font-bold text-sm">
                        {image.caption}
                      </p>
                      <p className="text-ktsa-text/60 text-xs mt-0.5">
                        {image.tournament} · {image.year}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Masonry>
          ) : (
            <div className="text-center py-24">
              <Camera className="w-16 h-16 text-ktsa-accent/50 mx-auto mb-4" />
              <p className="text-ktsa-text/60 text-lg">
                No images found for the selected filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Mobile Bottom Sheet Lightbox ──────────────────────── */}
      {selectedImage && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex flex-col justify-end backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-ktsa-bg rounded-t-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-ktsa-text/30" />
            </div>

            {/* Image */}
            <div className="px-4">
              <ImageWithFallback
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="w-full h-64 object-cover rounded-2xl border border-ktsa-accent/30"
              />
            </div>

            {/* Caption */}
            <div className="px-4 pt-4 pb-2 border-t border-ktsa-accent/20 mt-4">
              <p className="text-sm font-black text-ktsa-text mb-1">
                {selectedImage.caption}
              </p>
              <p className="text-xs text-ktsa-text/50">
                {selectedImage.tournament} · {selectedImage.year}
              </p>
            </div>

            {/* Close button */}
            <div className="px-4 pb-8 pt-3">
              <button
                onClick={() => setSelectedImage(null)}
                className="w-full py-3 rounded-2xl border border-ktsa-accent/30 text-ktsa-accent font-bold text-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
