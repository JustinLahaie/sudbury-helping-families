# Sudbury and Area Helping Families in Need

Community-driven charity website - Est. 2012

**Tagline:** "Fuelled by Kindness. Powered by Community."

## Tech Stack

- React
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (scroll animations)
- Stripe (donations/payments)
- Lucide React (icons)
- NextAuth.js (admin authentication)
- Prisma + PostgreSQL (database) or Supabase
- Cloudinary (image uploads)
- Glassmorphism dark theme

## Design System

### Colors (from logo)

```
Dark Background:    #1a2e2e (dark teal)
Primary Cyan:       #38b6c4 (teal blue - hands/text)
Accent Amber:       #f5a623 (orange/amber - hands/accent)
Text Light:         #e0f7fa (light cyan for headings)
```

### Style Guidelines

- Glassmorphism effect on cards (backdrop-blur, semi-transparent backgrounds)
- Dark theme throughout
- Two-tone accent colors (cyan + amber)
- Clean, modern, welcoming feel

### Navigation

- **Mobile-first responsive design**
- **Collapsible sidebar navigation** (hamburger menu on mobile/tablet)
- Sidebar slides in from left on mobile
- Smooth open/close animations
- Overlay backdrop when sidebar is open
- Desktop: Can be persistent sidebar or top nav (user preference)
- Links: Home, About Us, Gallery, Events, Donate, Contact Us
- Logo in header/sidebar
- Social links (Facebook) in sidebar footer

## Pages

### Home Page
- **Hero Section:**
  - Full-viewport height with logo animation on load
  - Tagline with typewriter or fade-in effect
  - Subtle animated gradient or particle background
  - Scroll indicator (animated chevron/arrow)
- **Impact Stats Section:**
  - Animated counters (200+ families helped, 12+ years, etc.)
  - Numbers count up when scrolled into view
  - Icons for each stat
- **Mission statement** with fade-in animation
- **Quick action buttons:** About Us, Contact Us, Upcoming Events, Donate
- **Partner logos** section (scrolling or grid)

### About Us
- Founded 2012, grassroots charity
- 200+ families assisted
- Services: food/essentials, pizza for unsheltered, hockey team sponsorship, youth dances in Valley East
- Partners: Northern Ontario Families of Children with Cancer, YWCA Geneva House, City of Sudbury Social Services, Manitoulin Sudbury District Social Services Board
- No government funding - 100% community supported

### Timeline/Gallery
- **Vertical scrolling timeline** with scroll-triggered animations
- Each slide is a full or large section that reveals as user scrolls
- **Layout per slide:**
  - Image slides in (from left or right, alternating)
  - Date/year prominently displayed
  - Caption/description text
  - Vertical timeline line connecting slides (with dots/markers)
- **Animations:**
  - Images fade + slide in when entering viewport
  - Text fades in with slight delay after image
  - Smooth easing transitions
  - Parallax effect on images (optional)
  - Use Intersection Observer or scroll library (Framer Motion recommended)
- **Mobile:** Stack vertically, images slide up from bottom
- Optional: Community testimonials with approval system

### Events
- **Upcoming Events** - card grid with glassmorphism cards
- **Event cards include:** date badge, title, description, location
- Hover effects on cards (lift + glow)
- **Past Events** archive/accordion section
- Filter/sort by year (optional)

### Donate
- **Hero banner** with emotional call-to-action
- **Impact breakdown:** "What your donation provides"
  - $25 = meals for a family
  - $50 = essential supplies
  - etc.
- **E-transfer info** in a copy-to-clipboard card:
  - Email: sudburyhelpingfamilies@hotmail.com
  - Password: Charity
- Trust indicators (years active, families helped)
- Note: Not a registered charity, no tax receipts
- **Stripe integration** for online donations
  - Preset amounts ($25, $50, $100) + custom amount
  - Secure checkout
  - Optional recurring donations

### Contact Us
- **Contact form** (name, email, phone, message)
  - Real-time validation with helpful error messages
  - Loading spinner on submit
  - Success/error toast notifications
  - Sends to: sudburyhelpingfamilies@hotmail.com
- **Contact info card:**
  - Mike Bellerose, Founder
  - Email: sudburyhelpingfamilies@gmail.com (click to copy)
  - Phone: 705-207-4170 (click to call on mobile)
  - Location: Sudbury and surrounding communities
- **Social links:** Facebook button
- **Map embed** (optional) - Sudbury area
- Note: Support provided through referrals only, not unsolicited requests

## Admin Dashboard (/admin)

### Authentication
- Secure login page (email/password)
- Protected routes - only accessible when logged in
- Session management with NextAuth.js
- Password reset functionality

### Dashboard Home
- Quick stats overview (total donations, messages, events)
- Recent activity feed
- Quick action buttons

### Timeline Manager
- **View all timeline slides** in a sortable list/grid
- **Add new slide:**
  - Upload image (drag & drop or file picker)
  - Set date/year
  - Add title and description
  - Set display order
- **Edit existing slides** - update image, text, date
- **Delete slides** with confirmation
- **Reorder slides** via drag-and-drop
- Preview how slide will look on site

### Events Manager
- **View all events** (upcoming + past)
- **Create new event:**
  - Title, description, location
  - Date and time
  - Optional image
  - Status (draft/published)
- **Edit/delete events**
- **Toggle event visibility**
- Auto-archive past events

### Donations
- **View donation history** from Stripe
- Filter by date range
- Total amounts summary
- Export to CSV
- View donor details (if provided)

### Contact Messages
- **Inbox view** of all form submissions
- Mark as read/unread
- Mark as responded
- Delete old messages
- Reply directly (opens email client)

### Testimonials Manager
- **Pending approvals** queue
- Approve/reject submissions
- Edit testimonial text
- Manage displayed testimonials
- Set display order

### Site Settings
- **Impact stats** - update numbers (families helped, years active, etc.)
- **Contact info** - update email, phone, address
- **Partner logos** - add/remove/reorder
- **Social links** - update Facebook URL
- **About content** - edit mission statement and about text

### Media Library
- View all uploaded images
- Upload new images
- Delete unused images
- Image optimization info

## Assets

- Logo: `Files/LOGO/FB_IMG_1762658891338.jpg`
- Gallery photos: `Files/sudburyandareahelpingfamiliesinneed/` (24 images)
- Existing domain: https://www.sudburyhelpingfamilies.com/

## UI Polish & Micro-interactions

### Animations & Transitions
- **Page transitions** - smooth fade/slide between pages
- **Scroll animations** - elements reveal as user scrolls (staggered)
- **Button hover effects** - scale, glow, color shift
- **Card interactions** - lift on hover with subtle shadow
- **Loading states** - skeleton screens while content loads
- **Smooth scroll** - for anchor links and back-to-top

### Global Components
- **Floating Donate button** - fixed position, pulses subtly
- **Back to top button** - appears after scrolling down
- **Toast notifications** - for form submissions, copy actions
- **Custom scrollbar** - styled to match theme
- **Loading spinner** - branded with logo colors

### Footer
- Logo + tagline
- Quick links to all pages
- Contact info summary
- Social links (Facebook)
- "Made with love in Sudbury"
- Copyright notice

## Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators (visible outlines)
- Alt text on all images
- Color contrast meets WCAG AA
- Reduced motion option (respects prefers-reduced-motion)

## SEO & Meta

- Page titles and meta descriptions
- Open Graph tags (for Facebook sharing)
- Twitter card meta tags
- Structured data (nonprofit schema)
- Sitemap generation
- Favicon + app icons (from logo)

## Performance

- Next.js Image optimization (WebP, lazy loading)
- Font optimization (next/font)
- Code splitting (automatic with Next.js)
- Minimize bundle size
- Cache static assets

## Development

```bash
npm run dev     # Start dev server at localhost:3000
npm run build   # Production build
npm run start   # Start production server
```

## Dependencies to Install

```bash
# UI & Animations
npm install framer-motion          # Animations
npm install lucide-react           # Icons
npm install react-hot-toast        # Toast notifications

# Payments
npm install @stripe/stripe-js stripe

# Authentication & Database
npm install next-auth              # Admin authentication
npm install @prisma/client         # Database ORM
npm install prisma --save-dev      # Prisma CLI

# File Uploads
npm install cloudinary             # Image hosting
npm install react-dropzone         # Drag & drop uploads

# Forms & Validation
npm install react-hook-form        # Form handling
npm install zod                    # Schema validation
npm install @hookform/resolvers    # Zod integration

# Admin UI
npm install @dnd-kit/core @dnd-kit/sortable  # Drag & drop reordering
npm install date-fns               # Date formatting
```

## Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
}

model TimelineSlide {
  id          String   @id @default(cuid())
  imageUrl    String
  title       String
  description String?
  date        DateTime
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String
  location    String?
  date        DateTime
  imageUrl    String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  message   String
  read      Boolean  @default(false)
  responded Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  content   String
  approved  Boolean  @default(false)
  order     Int?
  createdAt DateTime @default(now())
}

model SiteSetting {
  id    String @id @default(cuid())
  key   String @unique
  value String
}
```
