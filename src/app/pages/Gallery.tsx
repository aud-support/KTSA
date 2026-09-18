import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Masonry from "react-responsive-masonry";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Camera } from "lucide-react";
import { getGalleryItems, GalleryItem } from "../../services/galleryService";

// ── Static fallback (used only when API returns nothing) ──────────────────────
import image1  from "../../assets/ktsa-image.jpg";
import image2  from "../../assets/ktsa-image11.jpg";
import image3  from "../../assets/ktsa-image3.jpg";
import image4  from "../../assets/ktsa-image4.jpg";
import image5  from "../../assets/ktsa-image5.jpg";
import image6  from "../../assets/ktsa-image6.jpg";
import image7  from "../../assets/ktsa-image7.jpg";
import image8  from "../../assets/ktsa-image8.jpg";
import image9  from "../../assets/ktsa-image9.jpg";
import image10 from "../../assets/ktsa-image10.png";
import image11 from "../../assets/ktsa-image2.jpg";
import image12 from "../../assets/ktsa-image14.jpg";
import image13 from "../../assets/ktsa-image13.jpg";

const STATIC_FALLBACK: GalleryItem[] = [
  { id: "s1",  imageUrl: image2,  year: "2026", displayOrder: 0,  caption: "More than a game — it's the vibe ⚽\nKTSA moments, memories & madness 🏆" },
  { id: "s2",  imageUrl: image1,  year: "2026", displayOrder: 1,  caption: "What an exciting Sunday at The Godown – Gaming Arena, Kalyan Nagar!" },
  { id: "s3",  imageUrl: image3,  year: "2026", displayOrder: 2,  caption: "Amazing matches, great sportsmanship, and a fantastic foosball community." },
  { id: "s4",  imageUrl: image4,  year: "2025", displayOrder: 3,  caption: "September series comes to an end with a smile." },
  { id: "s5",  imageUrl: image5,  year: "2025", displayOrder: 4,  caption: "September series comes to an end with a smile." },
  { id: "s6",  imageUrl: image6,  year: "2026", displayOrder: 5,  caption: "September series comes to an end with a smile." },
  { id: "s7",  imageUrl: image7,  year: "2025", displayOrder: 6,  caption: "It was an absolute honour to be part of the ITSF World Cup 2025 in Zaragoza, Spain!" },
  { id: "s8",  imageUrl: image8,  year: "2025", displayOrder: 7,  caption: "" },
  { id: "s9",  imageUrl: image9,  year: "2024", displayOrder: 8,  caption: "Glimpse of the May 2025 - Roller Category" },
  { id: "s10", imageUrl: image10, year: "2024", displayOrder: 9,  caption: "" },
  { id: "s11", imageUrl: image11, year: "2026", displayOrder: 10, caption: "What an exciting Sunday at The Godown - Gaming Arena, Kalyan Nagar!" },
  { id: "s12", imageUrl: image12, year: "2024", displayOrder: 11, caption: "17 teams, endless energy, and pure foosball spirit 🙌⚽" },
  { id: "s13", imageUrl: image13, year: "2025", displayOrder: 12, caption: "Glimpse of the May 2025 - Roller Category" },
];

export function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading]             = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isMobile, setIsMobile]           = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    getGalleryItems()
      .then(data => setGalleryImages(data.length > 0 ? data : STATIC_FALLBACK))
      .catch(() => setGalleryImages(STATIC_FALLBACK))
      .finally(() => setLoading(false));
  }, []);

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

      {/* ── Gallery Grid ──────────────────────────────────────── */}
      <section className="py-10 px-2 bg-gradient-to-b from-ktsa-bg to-ktsa-bg/95 relative">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1757889693437-30a0290c4dcf?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-ktsa-accent/30 border-t-ktsa-accent rounded-full animate-spin" />
            </div>
          ) : galleryImages.length > 0 ? (
            <Masonry columnsCount={3} gutter="1rem">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ scale: 1.03 }}
                  className={`relative rounded-2xl overflow-hidden group ${isMobile ? "cursor-pointer" : "cursor-default"}`}
                  onClick={() => isMobile && setSelectedImage(image)}
                  style={{ boxShadow: "0 6px 24px rgba(0,229,255,0.08)" }}
                >
                  <ImageWithFallback
                    src={image.imageUrl}
                    alt={image.caption || "Gallery image"}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Hover overlay — desktop only */}
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-ktsa-bg via-ktsa-bg/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {image.caption && (
                        <p className="text-ktsa-text font-bold text-sm line-clamp-3 mb-2">
                          {image.caption}
                        </p>
                      )}
                      {image.year && (
                        <span className="px-2 py-0.5 bg-ktsa-primary/80 text-ktsa-text text-xs font-bold rounded-full">
                          {image.year}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </Masonry>
          ) : (
            <div className="text-center py-24">
              <Camera className="w-16 h-16 text-ktsa-accent/50 mx-auto mb-4" />
              <p className="text-ktsa-text/60 text-lg">No gallery images yet.</p>
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
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-ktsa-text/30" />
            </div>

            <div className="px-4">
              <ImageWithFallback
                src={selectedImage.imageUrl}
                alt={selectedImage.caption || "Gallery image"}
                className="w-full h-100 object-cover rounded-2xl border border-ktsa-accent/30"
              />
            </div>

            {(selectedImage.caption || selectedImage.year) && (
              <div className="px-4 pt-4 pb-2 border-t border-ktsa-accent/20 mt-4">
                {selectedImage.caption && (
                  <p className="text-sm font-black text-ktsa-text mb-2">
                    {selectedImage.caption}
                  </p>
                )}
                {selectedImage.year && (
                  <span className="px-2 py-0.5 bg-ktsa-primary/80 text-ktsa-text text-xs font-bold rounded-full">
                    {selectedImage.year}
                  </span>
                )}
              </div>
            )}

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
