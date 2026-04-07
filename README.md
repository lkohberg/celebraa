# Celebra

Celebra (celebra.at) is a modern web app for creating polished, shareable celebration/event pages—basically a “one link” destination where guests can instantly see everything they need: what the event is, when/where it happens, and any key details.

This is also a **personal passion project** I started as a **student**, built **next to school**, and I’m treating it as a **real business project**—learning by shipping, iterating, and improving it over time.

> **Live site:** www.celebra.at  
> **Status:** active development

---

## What Celebra does

Celebra focuses on turning event information into something that’s easy to **publish** and easy for guests to **consume**.

### Core experience
- **Create a shareable event page** that becomes the source of truth for a celebration (title, description, date/time, location, and other relevant details).
- **Give guests a clear, mobile-friendly view** of the event—optimized for quick scanning on a phone.
- **Keep information structured, not messy**: details are organized into sections/components so the page stays readable and consistent.

### Typical use cases
- Birthdays, graduations, weddings, baby showers, engagement parties
- Any event where the host wants to reduce “what time is it / where is it / what should I bring?” back-and-forth by sharing a single link

### Product principles
- **Clarity over clutter:** focus on the essentials first.
- **Reusable building blocks:** sections are composable components so the same patterns can power many event types.
- **Fast and interactive:** a modern frontend experience that stays responsive while creating/editing pages.

---

## How it’s built (technical overview)

Celebra is implemented as a TypeScript-heavy React application with a modern UI/tooling stack. The codebase is structured around component reuse, accessible UI primitives, and a workflow that supports quick iteration.

### Frontend architecture

#### React + TypeScript
- **React 18** is used to compose the UI from components and manage local UI state.
- **TypeScript** is used across nearly the entire codebase to keep the UI, data models, and API interactions aligned as the app evolves.

Why this matters:
- UI refactors are safer because types catch mismatches between components and data.
- Adding new features is faster because you can discover how things work via types instead of guesswork.

#### Vite build toolchain
- **Vite** provides a fast dev server and a production build pipeline.
- The project is configured to support modern patterns: module-based code splitting, environment variables for client configuration, and optimized bundling for deployment.

#### Styling: Tailwind CSS
- **Tailwind CSS** is used for consistent styling via utilities rather than one-off CSS files.
- This supports a “design system” approach: spacing, typography, and colors stay consistent because they come from shared tokens/config.

#### UI system: shadcn/ui + Radix primitives
- The component layer is built using **shadcn/ui**, which composes **Radix UI** primitives.
- Radix provides accessibility-minded behaviors (focus management, keyboard navigation, ARIA patterns), while shadcn/ui provides a structured way to implement app-specific styling and variants.

Why this matters:
- You get high-quality, accessible interactions (dialogs, dropdowns, tabs, etc.) without reinventing them.
- Components remain customizable and ���in-repo” rather than opaque third-party black boxes.

#### Animation: Framer Motion
- **Framer Motion** is included for motion/transition effects and interactive UI polish.
- This is typically used for micro-interactions (enter/exit transitions, subtle motion that improves perceived quality).

---

## Data & backend services

### Supabase
Celebra uses **Supabase** via `@supabase/supabase-js` to provide backend capabilities. Depending on how features are implemented, this commonly includes:
- **Database** (Postgres) for persistent app data (events/pages, settings, content, etc.)
- **Authentication** for user accounts (if enabled in the app)
- **Storage** for user-uploaded assets (images, attachments), if used

What this enables:
- A React frontend can query/update data using a well-supported client library.
- You can move quickly without maintaining a custom backend server for common product needs.

### Server-state management: TanStack Query
- **@tanstack/react-query** is used to manage server state: fetching, caching, invalidation, and background refresh.
- This keeps UI components focused on rendering, while query hooks handle “how data gets there.”

Benefits:
- Fewer manual loading/error state bugs.
- Consistent patterns for reads/writes as the app grows.

---

## Quality, consistency, and developer ergonomics

### Linting
- **ESLint** enforces consistent code style and catches common React/TypeScript issues early.

### Testing
- **Vitest** is included for unit/integration-style testing in a Vite-friendly environment.

### Design consistency
- **class-variance-authority** and Tailwind utilities make it easier to define component variants (size, intent, tone) without duplicating CSS or creating inconsistent UI.

---

## Key dependencies (high-level)

Celebra is built around:
- **Vite + React + TypeScript** (core app)
- **Tailwind CSS + tailwind-merge + tailwindcss-animate** (styling system)
- **shadcn/ui + Radix UI** (accessible component primitives)
- **Supabase** (backend services)
- **TanStack Query** (server state)
- **Framer Motion** (animations)
- **Zod** (schema validation, where needed)
- **React Hook Form** (forms, where needed)

---

## Repository notes

- The repo is primarily **TypeScript**.
- UI components and styling are designed to be reusable, so expanding the app typically means composing new screens out of existing building blocks rather than starting from scratch.
