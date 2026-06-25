# 💎 Mazopotfolio CMS Platform

A premium, production-ready Portfolio CMS platform designed and built for **Moaz Mohamed**. It features a stunning, dark-luxury glassmorphic public-facing site and a full-featured Admin Dashboard with credentials authentication.

## 🚀 Technologies Used

- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion (via `motion/react`)
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js v5 (Auth.js)
- **CMS Editor**: TipTap Rich Text Editor
- **Storage**: UploadThing (File Uploads)
- **Components**: Shadcn UI (Radix-based)

---

## 🎨 Public Features
- **Luxury Aesthetic**: Glassmorphism, animated mesh gradients, floating neon orbs, and smooth parallax effects.
- **Hero & Intro**: Animated name display with interactive scroll indicators and dynamic headlines.
- **About & Stats**: Animated counter statistics and structured timeline display.
- **Services Grid**: Bento-grid capabilities showcase with glowing hover effects.
- **Skills Matrix**: Category tabs with interactive animated proficiency meters.
- **Portfolio Case Studies**: Filterable project display with animated filtering (`AnimatePresence`).
- **Testimonial Carousel**: Multi-row infinite marquee scrolling in opposite directions.
- **Experience Timeline**: Vertical chronological history with path-drawn connecting animations.
- **Contact Inbox**: Contact form hooked up with secure server actions.
- **Blog Platform**: Full blog list and post view with HTML styling and category segregation.

## 🔒 Administrative Dashboard
- **Admin Authentication**: Safe credentials login with NextAuth protection.
- **Management Center**:
  - **Projects CRUD**: Create and edit projects, toggle visibility, and mark featured items.
  - **Blog Editor**: Full blog publishing setup with TipTap rich text, excerpt, tags, and custom SEO configurations.
  - **Services, Testimonials, Skills & Experience**: Manage all portfolio sections via modals and lists.
  - **Media Library**: View and manage asset URLs and alt texts.
  - **Messages**: Contact form inbox with mark-as-read/unread and delete features.
  - **Site Settings**: Core configuration panel to update headlines, bios, stats, contact info, and social links instantly.

---

## ⚙️ Project Setup

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and a **PostgreSQL** database instance running.

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure the values:
```bash
cp .env.example .env
```
Key configuration items:
- `DATABASE_URL`: PostgreSQL connection string.
- `AUTH_SECRET`: Secret key for NextAuth. Generate one using:
  ```bash
  npx auth secret
  ```
- `UPLOADTHING_TOKEN`: UploadThing API token for handling images.
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Default login details for the admin dashboard.

### 3. Install Dependencies
Run the installation command:
```bash
npm install
```

### 4. Database Setup & Seeding
Deploy database schemas and seed default configuration & sample data:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Running the Application
To start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site, and [http://localhost:3000/admin](http://localhost:3000/admin) to manage the CMS.

Default admin credentials (from seeding):
- **Email**: `admin@moazmohamed.com`
- **Password**: `changeme123`

---

## 🏗️ Project Structure
```text
├── prisma/                 # Database schema and seed scripts
├── src/
│   ├── actions/            # Server actions (CRUD, mail, auth mutations)
│   ├── app/                # App router pages (public & admin groups)
│   │   ├── (public)/       # Public pages route group
│   │   └── admin/          # Admin CMS route group
│   ├── components/         # React Components
│   │   ├── admin/          # Dashboard components (sidebar, editor, shell)
│   │   ├── public/         # Interactive website sections (hero, portfolio)
│   │   ├── shared/         # Shared assets (brand icons, section headers)
│   │   └── ui/             # Shadcn UI primitives
│   ├── lib/                # Shared utilities (prisma client, validations, auth)
│   └── styles/             # Global styles (Tailwind config, custom classes)
```

## 🛠️ Verification & Building
To build the project for production and test static page compilation:
```bash
npm run build
npm run start
```
# mazopotfolio
# mazopotfolio
