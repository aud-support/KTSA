import { Link } from "react-router";
import {
  Trophy,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Linkedin,
  Phone,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getFooterContent } from "../../services/footerSocialService";

// ── Default values (shown before API responds or if API fails) ────────────────
const DEFAULTS = {
  description:
    "Karnataka Table Soccer Association is the premier organization promoting competitive table soccer in Karnataka. Join us in celebrating the sport and building a thriving community.",
  facebook: "https://www.facebook.com/Ktsa.Bangalore",
  linkedin: "https://www.linkedin.com/company/ktsa-official",
  instagram: "https://www.instagram.com/ktsa_official",
  youtube: "https://www.youtube.com/@KTSA_Official",
  email: "info@ktsa.in",
  phone: "+91-9901147147",
  address: "Bangalore, Karnataka, India",
  quickLinks: [
    { label: "Home", path: "/" },
    { label: "Rankings", path: "/rankings" },
    { label: "About Us", path: "/about" },
    { label: "News", path: "/news" },
    { label: "Gallery", path: "/gallery" },
  ],
  copyright:
    "© 2026 Karnataka Table Soccer Association. All rights reserved.",
};

export function Footer() {
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    getFooterContent()
      .then((data) => { if (data) setCms(data); })
      .catch((err) => console.error("Failed to load footer content", err));
  }, []);

  // Resolve a scalar field: use CMS value if present, else default
  const v = (key: keyof typeof DEFAULTS) =>
    (cms?.[key] as string) ?? (DEFAULTS[key] as string);

  // Quick links: use CMS array if available, else defaults
  const quickLinks: { label: string; path: string }[] =
    cms?.quickLinks ?? DEFAULTS.quickLinks;

  return (
    <footer
      id="footer"
      className="bg-gradient-to-b from-ktsa-bg to-black border-t border-ktsa-accent/20"
      style={{ scrollMarginTop: "80px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* ── Logo, Description & Socials ── */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-10 h-10 text-ktsa-accent" />
              <div>
                <div className="text-ktsa-text font-bold text-xl">KTSA</div>
                <div className="text-ktsa-primary text-xs">
                  KARNATAKA TABLE SOCCER ASSOCIATION
                </div>
              </div>
            </div>
            <p className="text-ktsa-text/70 mb-6 text-sm max-w-md">
              {v("description")}
            </p>
            <div className="flex gap-4">
              {v("facebook") && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={v("facebook")}
                  className="w-8 h-8 rounded-full bg-ktsa-primary/20 border border-ktsa-accent/30 flex items-center justify-center text-ktsa-text hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300 hover:scale-110"
                >
                  <Facebook size={18} />
                </a>
              )}
              {v("linkedin") && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={v("linkedin")}
                  className="w-8 h-8 rounded-full bg-ktsa-primary/20 border border-ktsa-accent/30 flex items-center justify-center text-ktsa-text hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300 hover:scale-110"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {v("instagram") && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={v("instagram")}
                  className="w-8 h-8 rounded-full bg-ktsa-primary/20 border border-ktsa-accent/30 flex items-center justify-center text-ktsa-text hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300 hover:scale-110"
                >
                  <Instagram size={18} />
                </a>
              )}
              {v("youtube") && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={v("youtube")}
                  className="w-8 h-8 rounded-full bg-ktsa-primary/20 border border-ktsa-accent/30 flex items-center justify-center text-ktsa-text hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300 hover:scale-110"
                >
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="text-ktsa-text font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-ktsa-text/70 hover:text-ktsa-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-ktsa-text font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              {v("email") && (
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-ktsa-accent flex-shrink-0" />
                  <a
                    href={`mailto:${v("email")}`}
                    className="text-ktsa-text/70 hover:text-ktsa-accent transition-colors cursor-pointer"
                  >
                    {v("email")}
                  </a>
                </li>
              )}
              {v("phone") && (
                <li className="flex items-center gap-2">
                  <Phone
                    className="text-ktsa-accent flex-shrink-0"
                    size={16}
                  />
                  <a
                    href={`tel:${v("phone").replace(/[^+\d]/g, "")}`}
                    className="text-ktsa-text/70 hover:text-ktsa-accent transition-colors cursor-pointer"
                  >
                    {v("phone")}
                  </a>
                </li>
              )}
              {v("address") && (
                <li className="flex items-center gap-2 text-ktsa-text/70">
                  <MapPin className="text-ktsa-accent flex-shrink-0" size={16} />
                  {v("address")}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div className="mt-10 pt-7 border-t border-ktsa-accent/20 text-center">
          <p className="text-ktsa-text/60 text-xs">{v("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
