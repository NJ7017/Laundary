# AuraWash — Full-Stack Laundry Pickup & Delivery Platform

Built with **React**, **Vite**, **Express**, and a persistent **Local JSON Database**, styled with the **Aura Wash Design System** from Google Stitch.

---

## ⚡ Quick Start

To run the entire full-stack application (frontend + backend API + local database) with one command:

```bash
npm run dev
```

- **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📁 Architecture Overview

```text
FreeLancing/
├── data/
│   └── db.json               # Local persistent database (Users, Orders, Inquiries, Zips)
├── server/
│   ├── db.js                 # Database engine & query operations
│   └── index.js              # Express REST API routes & middleware
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
├── screenshots/              # Stitch UI screenshots
├── vite.config.mjs           # Vite config with backend API proxy
├── package.json              # Scripts & dependencies
└── design-system.md          # Aura Wash System design tokens & specs
```

---

## 🚀 Fully Functional Features

1. **Authentication & User Profiles** (`/login`, `/signup`):
   - Real registration and login persisted in [data/db.json](file:///d:/Code/FreeLancing/data/db.json).
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
   - 6-stage interactive progress bar (Placed $\rightarrow$ Picked Up $\rightarrow$ Washing $\rightarrow$ Inspection $\rightarrow$ Out for Delivery $\rightarrow$ Delivered).
   - Assigned driver card with rating, vehicle ID, live ETA countdown, and interactive call/message actions.
   - Full itemized bill and doorstep instructions.

4. **Orders Management Dashboard** (`/my-orders`):
   - Filter by All, Active Pickups, or Delivered.
   - Instant "Track Live" button for ongoing pickups.
   - Instant "Cancel Order" action with real database mutation.
   - "Repeat Order" action to quickly duplicate a past laundry schedule.

5. **Live ZIP Coverage & Inquiries** (`/about-contact`):
   - Interactive ZIP Code coverage tool (e.g., test with `97477`, `90210`, `10001`).
   - Working contact message submission connected to `/api/contact`.
   - Expandable FAQ accordions.
