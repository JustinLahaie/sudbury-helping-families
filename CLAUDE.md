# Sudbury and Area Helping Families in Need

Community-driven charity website - Est. 2012

**Tagline:** "Fuelled by Kindness. Powered by Community."

## Tech Stack

- React
- Next.js (App Router)
- TypeScript
- Tailwind CSS
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
- Hero with tagline and logo
- Mission statement
- Navigation buttons: About Us, Contact Us, Upcoming Events, Donate

### About Us
- Founded 2012, grassroots charity
- 200+ families assisted
- Services: food/essentials, pizza for unsheltered, hockey team sponsorship, youth dances in Valley East
- Partners: Northern Ontario Families of Children with Cancer, YWCA Geneva House, City of Sudbury Social Services, Manitoulin Sudbury District Social Services Board
- No government funding - 100% community supported

### Timeline/Gallery
- Photo gallery showcasing community impact over the years
- Optional: Community testimonials with approval system

### Events
- Upcoming community events
- Youth dances
- Fundraisers

### Donate
- E-transfer to: sudburyhelpingfamilies@hotmail.com (Password: Charity)
- Note: Not a registered charity, no tax receipts
- Future consideration: Stripe integration

### Contact Us
- Contact form (name, email, phone) -> sends to sudburyhelpingfamilies@hotmail.com
- Mike Bellerose, Founder
- Email: sudburyhelpingfamilies@gmail.com
- Phone: 705-207-4170
- Location: Sudbury and surrounding communities
- Facebook: https://www.facebook.com/share/14R9XcKSaaW/
- Note: Support provided through referrals only, not unsolicited requests

## Assets

- Logo: `Files/LOGO/FB_IMG_1762658891338.jpg`
- Gallery photos: `Files/sudburyandareahelpingfamiliesinneed/` (24 images)
- Existing domain: https://www.sudburyhelpingfamilies.com/

## Development

```bash
npm run dev     # Start dev server at localhost:3000
npm run build   # Production build
npm run start   # Start production server
```
