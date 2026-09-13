import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Users,
  Award,
  Star,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input, Textarea } from "../components/Input";
import { getAboutUsContent, saveAboutUsContent } from "../../services/aboutUsService";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

interface Achievement {
  title: string;
  description: string;
}

interface ProvidesItem {
  title: string;
  desc: string;
}

interface AboutData {
  // The Story Behind KTSA
  storyContent: string;        // full story, blank-line separated paragraphs
  // Founder
  founderName: string;
  founderRole: string;
  founderQuote: string;
  founderStory: string;
  // Rulebook download URL
  rulebookUrl: string;
  // Stats
  totalPlayers: string;
  tournaments: string;
  activePlayers: string;
  clubs: string;
  // Who We Are
  whoWeAreContent: string;     // full body, blank-line separated paragraphs
  whoWeAreImageUrl: string;
  // Vision & Mission
  visionText: string;
  missionText: string;
  // Journey Timeline
  timeline: TimelineEntry[];
  // What KTSA Provides
  provides: ProvidesItem[];
  // Achievements
  achievements: Achievement[];
}

// ── Default data (mirrors current frontend content) ──────────────────────────

const defaultData: AboutData = {
  storyContent: `The Karnataka Table Soccer Association (KTSA) was founded on a simple belief — that foosball deserves the same structure, recognition, and competitive opportunity as any mainstream sport.

Established in 2018 by Sayeed Ahmed Shariff and a committed group of players in Bengaluru, KTSA was created to build a more organized future for foosball in Karnataka. From participation and community-building in its early years to structured tournaments, rankings, and competitive pathways, KTSA has steadily worked to give the sport the foundation it needed to grow with purpose.

KTSA is a registered non-profit organization dedicated to building a credible and organized platform for foosball in Karnataka. KTSA is affiliated with the Federation of Table Soccer India (FTSI), the national federation for the sport in India. Through FTSI, KTSA is connected to the International Table Soccer Federation (ITSF).

Today, KTSA continues to create opportunities for players to learn, compete, and progress, with 500+ active players and a wider community of 700+ players across platforms.`,
  founderName: "Sayeed Ahmed Shariff",
  founderRole: "Founder & President · KTSA",
  founderQuote:
    "Our goal has always been to give Karnataka's foosball players the platform they deserve — structured, recognised, and connected to the world.",
  founderStory:
    "My journey into foosball started casually — like most players, it began as a recreational activity. But over time, it became more than just a game. As I played more and interacted with other players, I realized there was real potential in the sport — talent, competitiveness, and passion — but no system to support it. That realization stayed with me. I started taking small steps — organizing local matches, connecting players, and eventually hosting tournaments. Each step came with its own challenges. Finding venues, managing logistics, ensuring participation — everything had to be figured out from scratch. There were moments of uncertainty. But what kept things going was consistency and belief. Today, what started as a personal interest has become a larger mission — building a structured ecosystem where players can compete, improve, and be recognized.",
  rulebookUrl: "/assets/Rulebook.pdf",
  totalPlayers: "700+",
  tournaments: "50+",
  activePlayers: "500+",
  clubs: "15+",
  whoWeAreContent: `The Karnataka Table Soccer Association (KTSA) is the leading organisation dedicated to promoting and developing table soccer (foosball) in Karnataka, India.

Founded in 2018, we have grown into a vibrant community of passionate players, coaches, and enthusiasts who share a love for this dynamic sport.

We organise tournaments, training programmes, and community events to foster competitive excellence and bring together players of all skill levels.`,
  whoWeAreImageUrl: "",
  visionText:
    "To establish Karnataka as a leading hub for organized foosball, where every player has the opportunity to learn, compete, and grow.",
  missionText:
    "To bring structure, recognition, opportunity, and community to foosball in Karnataka through organized events, player development, inclusive participation, and competitive pathways for all ages.",
  timeline: [
    {
      year: "2018-19",
      title: "Foundation",
      description:
        "KTSA began in its earliest form as a small group of passionate players focused on participating in tournaments, building experience, and brainstorming what an organized foosball community in Karnataka could become.",
    },
    {
      year: "2020-22",
      title: "Disrupted Momentum",
      description:
        "The COVID period created a major slowdown for the growing foosball community. What had been building as an emerging network of players and ideas entered a difficult phase, with limited opportunities for activity, competition, and organized development.",
    },
    {
      year: "2023",
      title: "Rebuilding Through Consistency",
      description:
        "The return after COVID was gradual. KTSA rebuilt momentum step by step through consistency, renewed participation, and a steady effort to bring players back together and restart growth.",
    },
    {
      year: "2024",
      title: "Breakthrough Year",
      description:
        "With a growing community of 350+ players and 10+ tournaments hosted throughout the year, KTSA reached a major turning point. KTSA players delivered exceptional success at the national tournament, bagging nearly every medal on offer.",
    },
    {
      year: "2025",
      title: "National Success, International Representation",
      description:
        "KTSA players once again made a strong mark at the national level, winning Gold and Silver medals in two categories. In the same year, KTSA players were nominated to represent India at the World Cup in Zaragoza, Spain, where they finished 4th in the double leg category.",
    },
    {
      year: "Today",
      title: "A Growing Platform for the Sport",
      description:
        "Today, KTSA has grown into a platform with 500+ active players and a wider community of 700+ players across platforms, continuing to strengthen organized foosball through tournaments, player development, and community growth across Karnataka.",
    },
  ],
  provides: [
    { title: "Official Rankings", desc: "Points-based ranking updated after every sanctioned event." },
    { title: "Club Registration", desc: "Formal affiliation for clubs with competitive access and benefits." },
    { title: "National Exposure", desc: "Pathways to state, national, and international tournaments." },
    { title: "Tournament Calendar", desc: "Structured season with scheduled open, club, and championship events." },
    { title: "Certification & Badges", desc: "Referee and coaching certification recognised by KTSA." },
    { title: "Digital Platform Access", desc: "Live rankings, match results, and player profiles on ktsa.in." },
  ],
  achievements: [
    { title: "50+ Tournaments", description: "Organized across Karnataka" },
    { title: "500+ Players", description: "Active community members" },
    { title: "15+ Clubs", description: "Participated and competing" },
    { title: "National Recognition", description: "Recognised by the National Federation" },
  ],
};

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left border-b border-border hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="p-6 space-y-4">{children}</div>}
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export const AboutUs: React.FC = () => {
  const [data, setData] = useState<AboutData>(defaultData);
  const [saved, setSaved] = useState<AboutData>(defaultData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [rulebookFile, setRulebookFile] = useState<File | null>(null);
  const rulebookInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // ── Load existing content on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const content = await getAboutUsContent();
        if (content) {
          // Merge fetched content; fall back to defaultData for any missing fields
          const merged: AboutData = { ...defaultData, ...content };
          setData(merged);
          setSaved(merged);
        }
      } catch (error) {
        console.error("Failed to load About Us content", error);
        toast.error("Failed to load About Us content");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const set = (field: keyof AboutData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  // Timeline helpers
  const updateTimeline = (i: number, field: keyof TimelineEntry, val: string) => {
    const t = [...data.timeline];
    t[i] = { ...t[i], [field]: val };
    setData((p) => ({ ...p, timeline: t }));
  };
  const addTimeline = () =>
    setData((p) => ({
      ...p,
      timeline: [...p.timeline, { year: "", title: "", description: "" }],
    }));
  const removeTimeline = (i: number) =>
    setData((p) => ({ ...p, timeline: p.timeline.filter((_, idx) => idx !== i) }));

  // Provides helpers
  const updateProvides = (i: number, field: keyof ProvidesItem, val: string) => {
    const arr = [...data.provides];
    arr[i] = { ...arr[i], [field]: val };
    setData((p) => ({ ...p, provides: arr }));
  };
  const addProvides = () =>
    setData((p) => ({ ...p, provides: [...p.provides, { title: "", desc: "" }] }));
  const removeProvides = (i: number) =>
    setData((p) => ({ ...p, provides: p.provides.filter((_, idx) => idx !== i) }));

  // Achievements helpers
  const updateAchievement = (i: number, field: keyof Achievement, val: string) => {
    const arr = [...data.achievements];
    arr[i] = { ...arr[i], [field]: val };
    setData((p) => ({ ...p, achievements: arr }));
  };
  const addAchievement = () =>
    setData((p) => ({
      ...p,
      achievements: [...p.achievements, { title: "", description: "" }],
    }));
  const removeAchievement = (i: number) =>
    setData((p) => ({
      ...p,
      achievements: p.achievements.filter((_, idx) => idx !== i),
    }));

  const handleSave = async () => {
    try {
      setLoading(true);
      // Strip image URL from payload — backend handles both files separately
      const { whoWeAreImageUrl, ...dataWithoutImage } = data;
      await saveAboutUsContent(dataWithoutImage, imageFile, rulebookFile);
      setSaved(data);
      setImageFile(null);
      setRulebookFile(null);
      toast.success("About Us page updated successfully!");
    } catch (error) {
      console.error("Failed to save About Us content", error);
      toast.error("Failed to update About Us. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(saved);
    setImageFile(null);
    setRulebookFile(null);
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="mb-2">
        <h1 className="mb-1">About Us</h1>
        <p className="text-muted-foreground text-sm">
          Manage all content on the About Us page — story, team, vision, journey, services and achievements.
        </p>
      </div>

      {/* ── 1. The Story Behind KTSA ── */}
      <Section title="The Story Behind KTSA">
        <div>
          <Textarea
            label="Story Content"
            name="storyContent"
            value={data.storyContent}
            onChange={(e) => set("storyContent", e.target.value)}
            rows={10}
            placeholder="Write the full story here. Separate paragraphs with a blank line."
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Tip: separate paragraphs with a blank line — each block will render as its own paragraph on the frontend.
          </p>
        </div>

        {/* ── Rulebook Upload ── */}
        <div>
          <label className="block text-sm font-medium mb-2">Rulebook PDF</label>

          {rulebookFile ? (
            /* New file selected — show name + remove */
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-ktsa-primary/40 bg-ktsa-primary/5">
              <FileText size={18} className="text-ktsa-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{rulebookFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(rulebookFile.size / 1024).toFixed(0)} KB — will be uploaded on save
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRulebookFile(null);
                  if (rulebookInputRef.current) rulebookInputRef.current.value = "";
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : data.rulebookUrl ? (
            /* Existing URL saved — show link + replace button */
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-muted/20">
              <FileText size={18} className="text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Current rulebook</p>
                <a
                  href={data.rulebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ktsa-primary hover:underline truncate block"
                >
                  {data.rulebookUrl.split("/").pop() || data.rulebookUrl}
                </a>
              </div>
              <button
                type="button"
                onClick={() => rulebookInputRef.current?.click()}
                className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-ktsa-primary/50 transition-colors"
              >
                Replace
              </button>
            </div>
          ) : (
            /* No file yet — upload button */
            <button
              type="button"
              onClick={() => rulebookInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-border hover:border-ktsa-primary transition-all bg-card px-6 py-8 flex flex-col items-center justify-center text-center group"
            >
              <div className="rounded-full p-3 bg-muted mb-3 group-hover:scale-105 transition">
                <UploadCloud size={22} />
              </div>
              <p className="text-sm font-medium">Upload Rulebook PDF</p>
              <p className="text-xs text-muted-foreground mt-1">Click to select a PDF file</p>
            </button>
          )}

          {/* Hidden file input */}
          <input
            ref={rulebookInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setRulebookFile(file);
            }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["totalPlayers", "tournaments", "activePlayers", "clubs"] as const).map((f) => (
            <Input
              key={f}
              label={f === "totalPlayers" ? "Total Players" : f === "activePlayers" ? "Active Players" : f.charAt(0).toUpperCase() + f.slice(1)}
              name={f}
              value={data[f]}
              onChange={(e) => set(f, e.target.value)}
              placeholder="e.g. 500+"
            />
          ))}
        </div>
      </Section>

      {/* ── 2. Founder ── */}
      <Section title="Founder Card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Founder Name"
            name="founderName"
            value={data.founderName}
            onChange={(e) => set("founderName", e.target.value)}
          />
          <Input
            label="Role / Title"
            name="founderRole"
            value={data.founderRole}
            onChange={(e) => set("founderRole", e.target.value)}
          />
        </div>
        <Textarea
          label="Short Quote"
          name="founderQuote"
          value={data.founderQuote}
          onChange={(e) => set("founderQuote", e.target.value)}
          rows={2}
        />
        <Textarea
          label="Full Story (expanded)"
          name="founderStory"
          value={data.founderStory}
          onChange={(e) => set("founderStory", e.target.value)}
          rows={5}
        />
      </Section>

      {/* ── 3. Who We Are ── */}
      <Section title="Who We Are">
        <Input
          label="Team Image URL (current)"
          name="whoWeAreImageUrl"
          value={data.whoWeAreImageUrl}
          onChange={(e) => set("whoWeAreImageUrl", e.target.value)}
          placeholder="https://... or leave blank to use default"
        />
        <div>
          <label className="block text-sm mb-2">Upload New Team Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm"
          />
          {imageFile && (
            <p className="mt-1 text-xs text-ktsa-primary">
              Selected: {imageFile.name}
            </p>
          )}
        </div>
        <div>
          <Textarea
            label="Content"
            name="whoWeAreContent"
            value={data.whoWeAreContent}
            onChange={(e) => set("whoWeAreContent", e.target.value)}
            rows={6}
            placeholder="Write the full content here. Separate paragraphs with a blank line."
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Tip: separate paragraphs with a blank line.
          </p>
        </div>
      </Section>

      {/* ── 4. Vision & Mission ── */}
      <Section title="Vision & Mission">
        <Textarea
          label="Our Vision"
          name="visionText"
          value={data.visionText}
          onChange={(e) => set("visionText", e.target.value)}
          rows={3}
        />
        <Textarea
          label="Our Mission"
          name="missionText"
          value={data.missionText}
          onChange={(e) => set("missionText", e.target.value)}
          rows={3}
        />
      </Section>

      {/* ── 5. KTSA's Journey (Timeline) ── */}
      <Section title="KTSA's Journey (Timeline)">
        <div className="space-y-4">
          {data.timeline.map((entry, i) => (
            <div
              key={i}
              className="border border-border rounded-lg p-4 space-y-3 relative"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Entry {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeTimeline(i)}
                  className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Year / Period"
                  value={entry.year}
                  onChange={(e) => updateTimeline(i, "year", e.target.value)}
                  placeholder="e.g. 2024 or 2018-19"
                />
                <Input
                  label="Title"
                  value={entry.title}
                  onChange={(e) => updateTimeline(i, "title", e.target.value)}
                  placeholder="e.g. Breakthrough Year"
                />
              </div>
              <Textarea
                label="Description"
                value={entry.description}
                onChange={(e) => updateTimeline(i, "description", e.target.value)}
                rows={2}
              />
            </div>
          ))}
        </div>
        <Button variant="secondary" onClick={addTimeline}>
          <Plus size={15} className="mr-1" /> Add Timeline Entry
        </Button>
      </Section>

      {/* ── 6. What KTSA Provides ── */}
      <Section title="What KTSA Provides">
        <div className="space-y-3">
          {data.provides.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={i === 0 ? "Title" : undefined}
                  value={item.title}
                  onChange={(e) => updateProvides(i, "title", e.target.value)}
                  placeholder="e.g. Official Rankings"
                />
                <Input
                  label={i === 0 ? "Description" : undefined}
                  value={item.desc}
                  onChange={(e) => updateProvides(i, "desc", e.target.value)}
                  placeholder="Short description"
                />
              </div>
              <button
                type="button"
                onClick={() => removeProvides(i)}
                className={`p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 ${i === 0 ? "mt-6" : ""}`}
                title="Remove"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <Button variant="secondary" onClick={addProvides}>
          <Plus size={15} className="mr-1" /> Add Item
        </Button>
      </Section>

      {/* ── 7. Our Achievements ── */}
      <Section title="Our Achievements">
        <div className="space-y-3">
          {data.achievements.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={i === 0 ? "Title" : undefined}
                  value={item.title}
                  onChange={(e) => updateAchievement(i, "title", e.target.value)}
                  placeholder="e.g. 50+ Tournaments"
                />
                <Input
                  label={i === 0 ? "Description" : undefined}
                  value={item.description}
                  onChange={(e) => updateAchievement(i, "description", e.target.value)}
                  placeholder="e.g. Organized across Karnataka"
                />
              </div>
              <button
                type="button"
                onClick={() => removeAchievement(i)}
                className={`p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 ${i === 0 ? "mt-6" : ""}`}
                title="Remove"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <Button variant="secondary" onClick={addAchievement}>
          <Plus size={15} className="mr-1" /> Add Achievement
        </Button>
      </Section>

      {/* ── Live Preview ── */}
      <Card className="border-ktsa-primary/30">
        <h3 className="mb-4 text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
          Content Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { icon: Trophy, label: "Tournaments", value: data.tournaments },
            { icon: Users, label: "Active Players", value: data.activePlayers },
            { icon: Award, label: "Clubs", value: data.clubs },
            { icon: Star, label: "Total Players", value: data.totalPlayers },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-muted/30 rounded-xl p-3 text-center border border-border"
            >
              <Icon size={18} className="mx-auto mb-1 text-ktsa-primary" />
              <p className="text-lg font-black text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted/20 rounded-lg p-3 border border-border">
            <p className="text-xs font-bold text-ktsa-primary mb-1">Vision</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{data.visionText}</p>
          </div>
          <div className="bg-muted/20 rounded-lg p-3 border border-border">
            <p className="text-xs font-bold text-ktsa-primary mb-1">Mission</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{data.missionText}</p>
          </div>
        </div>
        <div className="mt-3 bg-muted/20 rounded-lg p-3 border border-border">
          <p className="text-xs font-bold text-ktsa-primary mb-2">
            Journey — {data.timeline.length} entries
          </p>
          <div className="flex flex-wrap gap-2">
            {data.timeline.map((t, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-ktsa-primary/10 border border-ktsa-primary/20 rounded-full text-xs text-ktsa-primary"
              >
                {t.year || `Entry ${i + 1}`}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3 bg-muted/20 rounded-lg p-3 border border-border">
          <p className="text-xs font-bold text-ktsa-primary mb-2">
            What KTSA Provides — {data.provides.length} items &nbsp;|&nbsp; Achievements — {data.achievements.length} items
          </p>
          <div className="flex flex-wrap gap-2">
            {data.provides.map((p, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground border border-border"
              >
                {p.title || `Item ${i + 1}`}
              </span>
            ))}
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
