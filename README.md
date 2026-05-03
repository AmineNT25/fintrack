# FINTRACK — Personal Finance Dashboard

A full-stack personal finance dashboard for tracking income, expenses, savings goals, and importing bank transactions via CSV.

Original Figma design: [Personal Finance Dashboard UI](https://www.figma.com/design/65og8yfNTP1BvqyX8AEkee/Personal-Finance-Dashboard-UI)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) |
| Charts | [Recharts](https://recharts.org) |
| Authentication | [NextAuth.js v4](https://next-auth.js.org) — Credentials (email + password) |
| Password hashing | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| ORM | [Prisma 6](https://www.prisma.io) |
| Database | PostgreSQL ([Railway](https://railway.app)) |
| CSV parsing | [PapaParse](https://www.papaparse.com) |
| Toast notifications | [Sonner](https://sonner.emilkowal.ski) |

---

## Features

- **Dashboard** — monthly income/expense summary, balance trend chart, expense breakdown by category
- **Transactions** — create, edit, delete, search, and filter by month/category/type
- **Savings Goals** — track progress with circular indicators, add funds incrementally
- **CSV Import** — 3-step wizard: upload → map columns → preview & confirm
- **Authentication** — email/password sign-up and sign-in, protected routes via middleware
- **Dark mode** — full light/dark theme support

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
DATABASE_URL="postgresql://..."   # Railway PostgreSQL connection string
NEXTAUTH_SECRET="..."             # Random 32-char string: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

**Database:** Provision a PostgreSQL instance on [Railway](https://railway.app), copy the public TCP proxy URL into your environment variables.

**Frontend:** Deploy to [Vercel](https://vercel.com) by connecting this repository. Set the three environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) in the Vercel project settings.

The `postinstall` script runs `prisma generate` automatically on each deploy.
