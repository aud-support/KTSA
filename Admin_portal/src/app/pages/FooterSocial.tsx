import React, { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Trophy,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { getFooterContent, saveFooterContent } from "../../services/footerSocialService";

// ── Local state shape (not tied to CMS context since footer is hardcoded) ──
interface FooterData {
  description: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  email: string;
  phone: string;
  address: string;
  quickLinks: { label: string; path: string }[];
  copyright: string;
}

const defaultData: FooterData = {
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
  copyright: "© 2026 Karnataka Table Soccer Association. All rights reserved.",
};

export const FooterSocial: React.FC = () => {
  const [data, setData] = useState<FooterData>(defaultData);
  const [saved, setSaved] = useState<FooterData>(defaultData);
  const [loading, setLoading] = useState(false);

  // ── Load existing content on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const content = await getFooterContent();
        if (content) {
          const merged: FooterData = { ...defaultData, ...content };
          setData(merged);
          setSaved(merged);
        }
      } catch (error) {
        console.error("Failed to load footer content", error);
        toast.error("Failed to load footer content");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const set = (field: keyof FooterData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const updateQuickLink = (
    index: number,
    field: "label" | "path",
    value: string,
  ) => {
    const links = [...data.quickLinks];
    links[index] = { ...links[index], [field]: value };
    setData((prev) => ({ ...prev, quickLinks: links }));
  };

  const addQuickLink = () =>
    setData((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { label: "", path: "/" }],
    }));

  const removeQuickLink = (index: number) =>
    setData((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, i) => i !== index),
    }));

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveFooterContent(data);
      setSaved(data);
      toast.success("Footer & Social updated successfully!");
    } catch (error) {
      console.error("Failed to save footer content", error);
      toast.error("Failed to update footer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => setData(saved);

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="mb-1">Footer & Social</h1>
        <p className="text-muted-foreground text-sm">
          Manage all footer content — description, social links, contact info,
          quick links and copyright.
        </p>
      </div>

      {/* ── Organisation Description ── */}
      <Card>
        <h3 className="mb-4 text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Organisation Description
        </h3>
        <textarea
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Short description shown in the footer..."
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ktsa-primary"
        />
      </Card>

      {/* ── Social Media Links ── */}
      <Card>
        <h3 className="mb-4 text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Social Media Links
        </h3>
        <div className="space-y-3">
          {[
            {
              key: "facebook" as const,
              icon: <Facebook size={18} />,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
              placeholder: "https://www.facebook.com/...",
            },
            {
              key: "linkedin" as const,
              icon: <Linkedin size={18} />,
              color: "text-sky-500",
              bg: "bg-sky-500/10",
              placeholder: "https://www.linkedin.com/company/...",
            },
            {
              key: "instagram" as const,
              icon: <Instagram size={18} />,
              color: "text-pink-500",
              bg: "bg-pink-500/10",
              placeholder: "https://www.instagram.com/...",
            },
            {
              key: "youtube" as const,
              icon: <Youtube size={18} />,
              color: "text-red-500",
              bg: "bg-red-500/10",
              placeholder: "https://www.youtube.com/@...",
            },
          ].map(({ key, icon, color, bg, placeholder }) => (
            <div key={key} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
              >
                {icon}
              </div>
              <Input
                name={key}
                value={data[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Contact Information ── */}
      <Card>
        <h3 className="mb-4 text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ktsa-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-ktsa-primary" />
            </div>
            <Input
              name="email"
              type="email"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="contact@example.com"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ktsa-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-ktsa-primary" />
            </div>
            <Input
              name="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91-XXXXXXXXXX"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ktsa-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-ktsa-primary" />
            </div>
            <Input
              name="address"
              value={data.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="City, State, Country"
            />
          </div>
        </div>
      </Card>

      {/* ── Quick Links ── */}
      <Card>
        <h3 className="mb-4 text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Quick Links
        </h3>
        <div className="space-y-2">
          {data.quickLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={link.label}
                onChange={(e) => updateQuickLink(i, "label", e.target.value)}
                placeholder="Label (e.g. Home)"
              />
              <Input
                value={link.path}
                onChange={(e) => updateQuickLink(i, "path", e.target.value)}
                placeholder="Path (e.g. /about)"
              />
              <button
                type="button"
                onClick={() => removeQuickLink(i)}
                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                title="Remove link"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          className="mt-3"
          onClick={addQuickLink}
        >
          <Plus size={15} className="mr-1" /> Add Link
        </Button>
      </Card>

      {/* ── Copyright ── */}
      <Card>
        <h3 className="mb-4 text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Copyright Text
        </h3>
        <Input
          name="copyright"
          value={data.copyright}
          onChange={(e) => set("copyright", e.target.value)}
          placeholder="© 2026 KTSA. All rights reserved."
        />
      </Card>

      {/* ── Live Preview ── */}
      <Card className="border-ktsa-primary/30">
        <h3 className="mb-4 text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Live Preview
        </h3>
        <div className="bg-gradient-to-b from-zinc-900 to-black rounded-xl p-6 border border-white/10 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Logo + desc + socials */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-7 h-7 text-cyan-400" />
                <div>
                  <p className="font-bold text-white text-base">KTSA</p>
                  <p className="text-cyan-400 text-[10px]">
                    KARNATAKA TABLE SOCCER ASSOCIATION
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                {data.description}
              </p>
              <div className="flex gap-2">
                {[
                  { href: data.facebook, icon: <Facebook size={14} /> },
                  { href: data.linkedin, icon: <Linkedin size={14} /> },
                  { href: data.instagram, icon: <Instagram size={14} /> },
                  { href: data.youtube, icon: <Youtube size={14} /> },
                ].map(({ href, icon }, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-white/5 border border-cyan-400/30 flex items-center justify-center text-white/70"
                    title={href}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Quick Links
              </p>
              <ul className="space-y-1">
                {data.quickLinks.map((l, i) => (
                  <li key={i} className="text-white/50 text-xs">
                    {l.label || "(no label)"}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Contact
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-1.5 text-white/50 text-xs">
                  <Mail size={11} className="text-cyan-400 flex-shrink-0" />
                  {data.email}
                </li>
                <li className="flex items-center gap-1.5 text-white/50 text-xs">
                  <Phone size={11} className="text-cyan-400 flex-shrink-0" />
                  {data.phone}
                </li>
                <li className="flex items-center gap-1.5 text-white/50 text-xs">
                  <MapPin size={11} className="text-cyan-400 flex-shrink-0" />
                  {data.address}
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center text-white/40 text-[11px]">
            {data.copyright}
          </div>
        </div>
      </Card>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Button variant="ghost" onClick={handleReset} disabled={loading}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
