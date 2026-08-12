import trophy from "../../assets/trophy.JPG";

export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  featured: boolean;
  image: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "KTSA Officially Launched",
    excerpt:
      "The Karnataka Table Soccer Association (KTSA) proudly announces its official launch, bringing together players, clubs, and supporters to grow the sport across Karnataka.",
    content: `The Karnataka Table Soccer Association (KTSA) was officially launched on April 25, 2026, marking a historic milestone for the foosball community in Karnataka.

The association was founded with a clear mission: to provide a structured, competitive environment for foosball players of all skill levels across the state.

KTSA aims to:
- Organise regular tournaments at city, state, and national levels
- Establish standardised rules and regulations for competitive play
- Build a network of affiliated clubs and training centres
- Represent Karnataka players at national competitions

The launch event was attended by over 100 players, coaches, and enthusiasts from across Bangalore, Mysore, and Mangalore. Founding members outlined an ambitious calendar of events for 2026, starting with the Bangalore Open in May.

We welcome all foosball enthusiasts to join the association and be part of this exciting new chapter for the sport in Karnataka.`,
    date: "2026-04-25",
    author: "KTSA Admin",
    category: "KTSA",
    featured: true,
    image: trophy,
  },
  {
    id: 2,
    title: "Bangalore Open 2026",
    excerpt:
      "The much-anticipated Bangalore Open is scheduled for May, bringing together top foosball talent from across the region.",
    content: `The Bangalore Open 2026 is set to be one of the most exciting foosball tournaments in the city's history.

Scheduled for May 2026, the tournament will feature categories including Open Singles, Open Doubles, Mixed Doubles, and Women's Singles.

Key details:
- Date: May 2026
- Venue: Koramangala Indoor Stadium, Bangalore
- Prize Pool: ₹50,000+
- Categories: Open Singles, Open Doubles, Mixed Doubles, Women's Singles

Registration is open to players of all skill levels. Entry fees vary by category. Players must be registered with KTSA to participate.

The tournament will follow ITSF-standard rules. All matches will be played on professional-grade Bonzini and Tornado tables.

Stay tuned for the full draw and schedule, which will be announced two weeks before the event.`,
    date: "2026-05-01",
    author: "KTSA Admin",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1751916856395-3dd0c4fe49e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRvdXJuYW1lbnQlMjBjb21wZXRpdGl2ZSUyMHNwb3J0c3xlbnwxfHx8fDE3NzQ5MzgyOTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "Karnataka Open 2026",
    excerpt:
      "The much-anticipated Karnataka Open is scheduled for April 25, bringing together top foosball talent from across the region.",
    content: `The Karnataka Open 2026 brought together the best foosball players from across the state for a weekend of intense competition.

Held on April 25, 2026, at a venue near Koramangala, Bangalore, the event attracted over 120 registered participants across all categories.

Highlights from the tournament:
- 120+ participants across 4 categories
- Players from 8 cities represented
- New state records set in the Open Singles category
- Under-18 exhibition matches showcasing the next generation

The final standings will be published on the KTSA website within 48 hours of the event. All results will count towards the KTSA State Rankings.

Congratulations to all participants and especially to the winners who represented Karnataka with distinction.`,
    date: "2026-04-25",
    author: "KTSA Admin",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1746396887626-6bd54c6b2181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGF0aGxldGVzJTIwY2VsZWJyYXRpbmclMjB2aWN0b3J5fGVufDF8fHx8MTc3NDkzODMwMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    title: "Women's Foosball Championship",
    excerpt:
      "Taking place near Silkboard on April 25, this event celebrates women in foosball, showcasing skill, strategy, and growing participation in the sport.",
    content: `The Women's Foosball Championship 2026 was a landmark event for gender inclusion in competitive foosball in Karnataka.

Organised by KTSA in partnership with local clubs, the event took place near Silkboard on April 25, 2026.

The tournament saw participation from 32 women players, with age groups ranging from 16 to 38 years. The atmosphere was electric, with passionate supporters cheering on every match.

Event summary:
- 32 participants across Singles and Doubles categories
- Age range: 16–38 years
- Venue: Near Silkboard, Bangalore
- Format: Single Elimination

KTSA is committed to growing women's participation in the sport and plans to run quarterly women-only events throughout 2026–27.

We thank all the players, coaches, and sponsors who made this event possible.`,
    date: "2026-04-25",
    author: "KTSA Admin",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1765607081473-8b44507dfdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0ZWFtJTIwY29tbXVuaXR5JTIwcGxheWVyc3xlbnwxfHx8fDE3NzQ5MzgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    title: "Bangalore Foosball Tournament — Koramangala",
    excerpt:
      "Held in Koramangala on March 29, the tournament concluded with exciting matches and strong performances.",
    content: `The March 29 Bangalore Foosball Tournament, held in Koramangala, was a resounding success.

This was the second major event organised under the KTSA banner in 2026, following the successful February event in Whitefield.

Match highlights:
- 64 players competed across 3 categories
- Quarter-finals saw multiple upsets from rising talent
- The Men's Open final went to a dramatic golden goal in the 5th game
- Youth exhibition matches drew enthusiastic crowds

All results have been recorded and will contribute to KTSA's official state rankings. Players are encouraged to check the rankings page for updated standings.

The next KTSA-sanctioned event is the Bangalore Open in May. Registration opens soon.`,
    date: "2026-03-29",
    author: "KTSA Admin",
    category: "Events",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1666193183124-3f27c7800370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29zYmFsbCUyMHRhYmxlJTIwc29jY2VyJTIwYWN0aW9uJTIwZ2FtZXxlbnwxfHx8fDE3NzQ5MzgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 6,
    title: "Bangalore Foosball Tournament — Whitefield",
    excerpt:
      "Held in Whitefield on January 31, the tournament marked a great start to the year for foosball enthusiasts.",
    content: `The first major foosball event of 2026, held on January 31 in Whitefield, set the tone for what promises to be an exciting year for Karnataka foosball.

The tournament attracted 48 participants from across Bangalore, with players competing in Singles and Doubles formats across a full day of matches.

Notable moments:
- Largest attendance for a KTSA event to date
- First appearance of several new junior players in senior competition
- Introduction of live score updates on the KTSA website

The event was hosted at a purpose-built indoor sports venue in Whitefield, providing excellent playing conditions for all participants.

KTSA extends its gratitude to the venue sponsors and all volunteers who helped run the event smoothly.`,
    date: "2026-01-31",
    author: "KTSA Admin",
    category: "KTSA",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1770067665792-9975acdec4fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBzcG9ydHMlMjBzdGFkaXVtJTIwYXJlbmElMjBsaWdodHN8ZW58MXx8fHwxNzc0OTM4MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];
