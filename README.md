# 🍕 Asombro Pizza - Hospitality & Entertainment Ecosystem

Asombro Pizza is a modern, high-performance web platform built with Next.js for managing a pizza delivery service combined with event management and smart interactive features.

## 🚀 Features

- **Store & Menu**: Interactive pizza menu with real-time cart functionality.
- **Admin Dashboard**: Comprehensive sales charts, order management, and driver tracking.
- **Driver Module**: Dedicated interface for drivers to manage deliveries and earnings.
- **Hospitality & Events**: Ticketing system for parties, music, and stand-up events.
- **AsombroBot (AI)**: Smart chatbot assistant for menu inquiries and event booking.
- **Fintech Ready**: Integration-ready structures for addresses, payment methods, and user identities.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma with PostgreSQL (Production ready)
- **Styling**: Tailwind CSS & Framer Motion
- **State Management**: Zustand
- **Charts**: Recharts

## ⚙️ Environment Setup

Create a `.env` file based on `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/asombro_pizza"
JWT_SECRET="your_jwt_secret"
```

## 📦 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run Database Migrations:
   ```bash
   npx prisma migrate dev
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## 🚢 Deployment

The project is optimized for deployment on **Vercel** with a hosted **PostgreSQL** (Supabase/Neon) database.
