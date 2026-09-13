# KTSA Admin Portal - CMS

A comprehensive Content Management System (CMS) admin portal for the Karnataka Table Soccer Association (KTSA) built with React, TypeScript, and Tailwind CSS.

## Features

### ✨ Complete CRUD Operations
- **Tournaments**: Create, read, update, and delete tournament entries with full details (dates, format, venue, prize pool, etc.)
- **Rules**: Manage tournament rules and regulations with drag-and-drop ordering
- **Articles**: Publish and manage news articles and announcements
- **Sponsors**: Add and categorize sponsors by tier (Platinum, Gold, Silver, Bronze)
- **Homepage**: Edit hero section content
- **About Us**: Manage organization information, mission, and vision
- **Contact**: Update contact information (email, phone, address)
- **Footer & Social**: Manage social media links and footer content

### 🎨 Design Features
- **Dark Theme**: Modern dark UI with cyan/teal accent colors (#00ffea, #14b8a6)
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile devices
- **Collapsible Sidebar**: Desktop sidebar can be collapsed for more workspace
- **Mobile Navigation**: Slide-out sidebar navigation on mobile devices
- **Toast Notifications**: User feedback for all CRUD operations using Sonner

### 🛠️ Technical Stack
- **React 18** with TypeScript
- **React Router** for navigation (Data mode pattern)
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **Context API** for state management
- **Sonner** for toast notifications

## Project Structure

```
/src
├── /app
│   ├── /components       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   ├── /context          # State management
│   │   └── CMSContext.tsx
│   ├── /lib              # Utilities
│   │   └── utils.ts
│   ├── /pages            # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── Tournaments.tsx
│   │   ├── TournamentForm.tsx
│   │   ├── Rules.tsx
│   │   ├── Homepage.tsx
│   │   ├── AboutUs.tsx
│   │   ├── Contact.tsx
│   │   ├── Articles.tsx
│   │   ├── Sponsors.tsx
│   │   └── FooterSocial.tsx
│   ├── App.tsx           # Main app component
│   └── routes.tsx        # Route configuration
└── /styles
    └── theme.css         # KTSA custom color palette

## Color Palette

Custom KTSA colors defined in theme.css:
- Primary: #00ffea (Cyan)
- Secondary: #08867c (Teal)
- Accent: #14b8a6 (Teal)
- Highlight: #2dd4bf (Light Teal)
- Background: #000000 (Black)
- Text: #ffffff (White)

## Routes

- `/` - Dashboard with overview and quick actions
- `/tournaments` - List all tournaments
- `/tournaments/new` - Create new tournament
- `/tournaments/:id/edit` - Edit existing tournament
- `/rules` - Manage rules
- `/homepage` - Edit homepage content
- `/about` - Manage About Us page
- `/contact` - Update contact information
- `/articles` - Manage news/articles
- `/sponsors` - Manage sponsors
- `/footer-social` - Edit footer and social links

## State Management

The application uses React Context API (`CMSContext`) to manage all CMS data. This provides:
- Centralized state for all content types
- CRUD operations for each content type
- In-memory data storage (ready to connect to a backend API)

## Future Enhancements

### Backend Integration
The current implementation uses in-memory state management. To persist data:

1. Replace Context API calls with API calls to your backend
2. Add authentication/authorization
3. Implement file upload for images (sponsors, articles, tournaments)
4. Add role-based access control

### Suggested Backend Endpoints
```
GET    /api/tournaments
POST   /api/tournaments
PUT    /api/tournaments/:id
DELETE /api/tournaments/:id

GET    /api/articles
POST   /api/articles
PUT    /api/articles/:id
DELETE /api/articles/:id

... (similar patterns for other resources)
```

## Running the Application

The application is built with Vite and runs in the Figma Make environment. All dependencies are already installed via package.json.

## Mobile Responsive Breakpoints

- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md/lg)
- Desktop: > 1024px (lg+)

## Notes

- All data is currently stored in memory and will reset on page refresh
- Toast notifications provide user feedback for all CRUD operations
- The collapsible sidebar state is local to the session
- Forms include basic validation (required fields)
