# AuraWash — Full-Stack Laundry Pickup & Delivery Platform

Built with **React**, **Vite**, **Express** (local dev) / **Cloudflare Workers + D1 Database** (production), styled with the **Aura Wash Design System** from Google Stitch.

---

## ⚡ Quick Start (Local Development)

To run the full-stack application locally with Express and JSON database:

```bash
npm run dev
```

- **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## ☁️ Deploying to Cloudflare (Workers + D1 + Static Assets)

AuraWash is pre-configured to deploy seamlessly to Cloudflare Workers with Static Assets (`dist/`) and Cloudflare D1 SQL Database.

### 1. Authenticate with Cloudflare
If you haven't logged in yet:
```bash
npx wrangler login
```

### 2. Verify / Create your D1 Database
The [wrangler.toml](file:///d:/Code/Laundary/wrangler.toml) file is pre-configured with:
- Database Name: `laundary-db`
- Database ID: `992977bc-82f9-47be-a645-2e0d860d4b0f`

If you need to create a new database or link an existing one:
```bash
npx wrangler d1 create laundary-db
```
*(Copy the generated `database_id` into `wrangler.toml` if creating a new one).*

### 3. Initialize the D1 Schema & Seed Data
Execute [schema.sql](file:///d:/Code/Laundary/schema.sql) on your remote D1 database:
```bash
npm run d1:init
# Or:
npx wrangler d1 execute laundary-db --file=schema.sql --remote
```

### 4. Build & Deploy
Build your React frontend and deploy the Cloudflare Worker:
```bash
npm run deploy
# Or:
npm run build && npx wrangler deploy
```

Once deployment completes, Wrangler will output your live URL (e.g. `https://aurawash.<your-subdomain>.workers.dev`).

---

## 📁 Architecture Overview

```text
Laundary/
├── schema.sql                # Cloudflare D1 SQL Schema & Initial Seed Data
├── wrangler.toml             # Cloudflare Worker, Assets & D1 Binding config
├── server/
│   ├── worker.js             # Cloudflare Worker API & D1 Router
│   ├── db.js                 # Local dev DB engine (file-based)
│   └── index.js              # Local Express REST API dev server
├── data/
│   └── db.json               # Local persistent database for offline dev
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation with active states & auth dropdown
│   │   ├── Footer.jsx        # Branded footer & direct links
│   │   └── Toast.jsx         # Dynamic notification banners
│   ├── context/
│   │   └── AuthContext.jsx   # Global authentication, session & alerts state
│   ├── pages/
│   │   ├── Home.jsx          # Hero, interactive price estimator & workflow
│   │   ├── BookPickup.jsx    # Multi-step booking flow with live price calculation
│   │   ├── TrackOrder.jsx    # Real-time GPS & 6-stage telemetry order tracking
│   │   ├── MyOrders.jsx      # Orders dashboard with cancellation & reorder actions
│   │   ├── Login.jsx         # User login with 1-click demo button
│   │   ├── Signup.jsx        # User registration & address onboarding
│   │   └── AboutContact.jsx  # Live ZIP coverage tool, contact form & FAQ accordions
│   ├── App.jsx               # React Router routes setup
│   └── main.jsx              # Application DOM mounting
├── public/ & assets/         # Vector logos, avatars, and assets
├── dist/                     # Production build artifacts (served via Cloudflare Assets)
├── vite.config.mjs           # Vite config with backend API proxy
├── package.json              # Scripts & dependencies
└── design-system.md          # Aura Wash System design tokens & specs
```

---

## 🚀 Fully Functional Features

1. **Authentication & User Profiles** (`/login`, `/signup`):
   - Real registration and login persisted in D1 database (`users` table).
   - Instant **1-Click Demo Login** (`demo@aurawash.com` / `password123` for Sarah Jenkins).
   - Persistent user sessions in `localStorage`.
   - Dynamic user avatar and menu in the navigation bar.

2. **Interactive Price Estimator & Booking Flow** (`/book-pickup`):
   - Dynamic sliders and counters for Wash & Fold poundage, Dry Cleaning pieces, and Bulky Bedding.
   - Eco-Sanitizer and stain-treatment add-ons.
   - Live price math (subtotal + free delivery over $35 - promo codes like `WELCOME10`).
   - Pickup and delivery scheduling with time slot pickers.
   - Generates persistent orders with unique tracking codes (`AW-XXXX`) and redirects directly to live tracking.

3. **Live Telemetry & Order Tracker** (`/track-order`):
   - Search by order ID (e.g. `AW-9482`, `AW-8201`, `AW-7110`).
   - 6-stage interactive progress bar (Placed → Picked Up → Washing → Inspection → Out for Delivery → Delivered).
   - Assigned driver card with rating, vehicle ID, live ETA countdown, and interactive call/message actions.
   - Full itemized bill and doorstep instructions.

4. **Orders Management Dashboard** (`/my-orders`):
   - Filter by All, Active Pickups, or Delivered.
   - Instant "Track Live" button for ongoing pickups.
   - Instant "Cancel Order" action with real database mutation.
   - "Repeat Order" action to quickly duplicate a past laundry schedule.

5. **Live ZIP Coverage & Inquiries** (`/about-contact`):
   - Interactive ZIP Code coverage tool (e.g., test with PIN `411057`, `560001`, `110001`).
   - Working contact message submission connected to `/api/contact`.
   - Expandable FAQ accordions.
