# Project Management App – Frontend

A modern project management dashboard built with Next.js, React, and Tailwind CSS. This frontend interfaces with a NestJS backend, providing JWT-based authentication and robust role-based access control (RBAC) for users, managers, and admins.

---

## 🚀 Project Overview

This app allows users to:

- Sign up, log in, and manage their session securely with JWT.
- Create, view, edit, and search projects.
- Access features based on their assigned role (user, manager, admin).
- Admins can manage users and projects, including sharing and transferring ownership.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI:** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **HTTP Requests:** [Axios](https://axios-http.com/)
- **Auth:** JWT (handled via backend API)
- **State/Context:** React Context API

---

## 📁 Project Structure

```
frontend/
  app/
    components/         # Reusable UI components (Navbar, ProtectedRoute, etc.)
    context/            # AuthContext for JWT/session management
    admin/              # Admin dashboard & user/project management
    manager/            # Manager dashboard
    user/               # User dashboard, project CRUD
    page.tsx            # Home page
    layout.tsx          # App layout, providers, global styles
    globals.css         # Tailwind/global styles
  public/               # Static assets
  package.json
  next.config.ts
  postcss.config.mjs
  tailwind.config.js
  tsconfig.json
```

---

## 🔐 JWT Auth & Role-Based Access

- **Auth Flow:**
  - On login/signup, the backend returns a JWT.
  - The JWT is stored in `localStorage` and parsed using [`jwt-decode`](https://github.com/auth0/jwt-decode).
  - The [`AuthContext`](app/context/AuthContext.tsx) provides `login`, `logout`, and exposes the current user and token.
- **Role-Based Routing:**
  - [`ProtectedRoute`](app/components/ProtectedRoute.tsx): Ensures only authenticated users can access children.
  - [`RoleProtectedRoute`](app/components/RoleProtectedRoute.tsx): Restricts access to users with specific roles (admin, manager, user).
  - The Navbar and page routes adapt based on the user’s role.

---

## 🌐 API Communication

- **Requests:**
  - All API calls use Axios or fetch, targeting the backend at `http://localhost:5005`.
  - The JWT token is sent in the `Authorization: Bearer <token>` header for protected endpoints.
- **Token Handling:**
  - On login/signup, the token is saved to `localStorage` and loaded into context on app start.
  - Logout clears the token and context, redirecting to `/login`.
- **Error Handling:**
  - API errors are caught and displayed in forms or as alerts.

---

## ▶️ Running Locally

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment (optional)

No `.env` is strictly required for the frontend by default, but you can create one for custom variables (e.g., API base URL):

```env
# .env.example
NEXT_PUBLIC_API_URL=http://localhost:5005
```

Update API URLs in the code to use this variable if needed.

### 3. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## ⚠️ Known Issues & Improvements

- **API URL:**
  - API endpoints are currently hardcoded to `http://localhost:5005`. Consider using an environment variable for flexibility.
- **UI/UX:**
  - Minimal styling; could be improved with more feedback, loading states, and error boundaries.
- **Token Expiry:**
  - No automatic token refresh; users must log in again after expiry.
- **Testing:**
  - No automated frontend tests yet.
- **Accessibility:**
  - Needs review for any best practices.
- **Manager Role:**
  - Manager features are minimal; expand as needed.

---

## 📚 Further Reading

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
