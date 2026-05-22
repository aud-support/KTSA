import CMSEditor from "../../components/ui/CMSEditor";

export function HomepagePage() {
  return (
    <CMSEditor
      section="homepage"
      title="Homepage"
      subtitle="Manage the public homepage sections"
      fields={[
        {
          key: "heroTitle",
          label: "Hero Title",
          type: "text",
          placeholder: "e.g. Karnataka Table Soccer Association",
        },
        {
          key: "heroSubtitle",
          label: "Hero Subtitle",
          type: "textarea",
          placeholder: "Hero description...",
        },
        {
          key: "heroCtaText",
          label: "CTA Button Text",
          type: "text",
          placeholder: "e.g. View Tournaments",
        },
        {
          key: "aboutTeaser",
          label: "About Section Teaser",
          type: "textarea",
          placeholder: "Short intro about KTSA...",
        },
        {
          key: "statsPlayers",
          label: "Stat: Total Players",
          type: "text",
          placeholder: "e.g. 200+",
        },
        {
          key: "statsTournaments",
          label: "Stat: Tournaments Held",
          type: "text",
          placeholder: "e.g. 50+",
        },
      ]}
    />
  );
}

export function AboutPage() {
  return (
    <CMSEditor
      section="about"
      title="About Us"
      subtitle="Manage the About page content"
      fields={[
        {
          key: "heading",
          label: "Page Heading",
          type: "text",
          placeholder: "About KTSA",
        },
        {
          key: "intro",
          label: "Introduction",
          type: "richtext",
          placeholder: "About us intro...",
        },
        {
          key: "mission",
          label: "Mission Statement",
          type: "textarea",
          placeholder: "Our mission is...",
        },
        {
          key: "vision",
          label: "Vision",
          type: "textarea",
          placeholder: "Our vision...",
        },
        {
          key: "foundedYear",
          label: "Founded Year",
          type: "text",
          placeholder: "e.g. 2018",
        },
        {
          key: "teamDescription",
          label: "Team / Committee Description",
          type: "richtext",
          placeholder: "About the team...",
        },
      ]}
    />
  );
}

export function ContactPage() {
  return (
    <CMSEditor
      section="contact"
      title="Contact Page"
      subtitle="Manage contact details shown on the site"
      fields={[
        {
          key: "email",
          label: "Contact Email",
          type: "email",
          placeholder: "contact@ktsaofficial.in",
        },
        {
          key: "phone",
          label: "Phone Number",
          type: "text",
          placeholder: "+91 ...",
        },
        {
          key: "address",
          label: "Address",
          type: "textarea",
          placeholder: "Bangalore, Karnataka, India",
        },
        {
          key: "mapEmbedUrl",
          label: "Google Maps Embed URL",
          type: "url",
          placeholder: "https://maps.google.com/...",
        },
        {
          key: "formHeading",
          label: "Contact Form Heading",
          type: "text",
          placeholder: "Get in touch",
        },
        {
          key: "formSubtext",
          label: "Contact Form Subtext",
          type: "textarea",
          placeholder: "Fill out the form below...",
        },
      ]}
    />
  );
}

export function TournamentRulesPage() {
  return (
    <CMSEditor
      section="rules"
      title="Tournament Rules"
      subtitle="Manage the official tournament rules"
      fields={[
        {
          key: "generalRules",
          label: "General Rules",
          type: "richtext",
          placeholder: "1. Players must...",
        },
        {
          key: "scoringRules",
          label: "Scoring Rules",
          type: "richtext",
          placeholder: "Points are awarded by...",
        },
        {
          key: "codeOfConduct",
          label: "Code of Conduct",
          type: "richtext",
          placeholder: "All players are expected to...",
        },
        {
          key: "disqualificationRules",
          label: "Disqualification Rules",
          type: "textarea",
          placeholder: "A player may be disqualified if...",
        },
        {
          key: "lastUpdated",
          label: "Last Updated Note",
          type: "text",
          placeholder: "e.g. January 2025",
        },
      ]}
    />
  );
}

export function FooterPage() {
  return (
    <CMSEditor
      section="footer"
      title="Footer & Social Links"
      subtitle="Manage footer content and social media links"
      fields={[
        {
          key: "footerTagline",
          label: "Footer Tagline",
          type: "text",
          placeholder: "Promoting table soccer across Karnataka",
        },
        {
          key: "instagram",
          label: "Instagram URL",
          type: "url",
          placeholder: "https://instagram.com/ktsa...",
        },
        {
          key: "facebook",
          label: "Facebook URL",
          type: "url",
          placeholder: "https://facebook.com/ktsa...",
        },
        {
          key: "twitter",
          label: "Twitter / X URL",
          type: "url",
          placeholder: "https://x.com/ktsa...",
        },
        {
          key: "youtube",
          label: "YouTube URL",
          type: "url",
          placeholder: "https://youtube.com/@ktsa...",
        },
        {
          key: "whatsapp",
          label: "WhatsApp Group Link",
          type: "url",
          placeholder: "https://chat.whatsapp.com/...",
        },
        {
          key: "copyrightText",
          label: "Copyright Text",
          type: "text",
          placeholder: "© 2025 KTSA. All rights reserved.",
        },
      ]}
    />
  );
}
