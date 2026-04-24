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

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-gradient-to-b from-ktsa-bg to-black border-t border-ktsa-accent/20"
      style={{
        scrollMarginTop: "80px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
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
              Karnataka Table Soccer Association is the premier organization
              promoting competitive table soccer in Karnataka. Join us in
              celebrating the sport and building a thriving community.
            </p>
            <div className="flex gap-4">
              <a
                target="_blank"
                href="https://www.facebook.com/Ktsa.Bangalore"
                className="w-8 h-8 rounded-full bg-ktsa-primary/20 border border-ktsa-accent/30 flex items-center justify-center text-ktsa-text hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300 hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/company/ktsa-official"
                className="w-8 h-8 rounded-full bg-ktsa-primary/20 border border-ktsa-accent/30 flex items-center justify-center text-ktsa-text hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={18} />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/ktsa_official"
                className="w-8 h-8 rounded-full bg-ktsa-primary/20 border border-ktsa-accent/30 flex items-center justify-center text-ktsa-text hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300 hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a
                target="_blank"
                href="https://www.youtube.com/@KTSA_Official"
                className="w-8 h-8 rounded-full bg-ktsa-primary/20 border border-ktsa-accent/30 flex items-center justify-center text-ktsa-text hover:bg-ktsa-accent hover:text-ktsa-bg transition-all duration-300 hover:scale-110"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-ktsa-text font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-ktsa-text/70 hover:text-ktsa-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/rankings"
                  className="text-ktsa-text/70 hover:text-ktsa-accent transition-colors"
                >
                  Rankings
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-ktsa-text/70 hover:text-ktsa-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-ktsa-text/70 hover:text-ktsa-accent transition-colors"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-ktsa-text/70 hover:text-ktsa-accent transition-colors"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-ktsa-text font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-ktsa-text/70">
                <Mail size={16} className="text-ktsa-accent" />
                info@ktsa.in
              </li>
              <li className="flex items-center gap-2 text-ktsa-text/70">
                {" "}
                <Phone className="text-ktsa-accent" size={16} />
                +91-9901147147
              </li>
              <li className="flex items-center gap-2 text-ktsa-text/70">
                <MapPin className="text-ktsa-accent" size={16} />
                Bangalore, Karnataka, India
              </li>
              {/* <li className="flex items-center gap-2 text-ktsa-text/70"> */}

              {/* </li> */}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-7 border-t border-ktsa-accent/20 text-center">
          <p className="text-ktsa-text/60 text-xs">
            © 2026 Karnataka Table Soccer Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
