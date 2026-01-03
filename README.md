# Gültekin Ataseven - Exclusive Bridal Catalogue

A full-stack bridal catalogue application built with modern web tech.

## Tech Stack

| Layer        | Technology                                                                 |
|--------------|----------------------------------------------------------------------------|
| **Framework**| [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/)                              |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL)                             |
| **Auth**     | [Supabase Auth](https://supabase.com/docs/guides/auth) (JWT-based sessions)|
| **Storage**  | [Supabase Storage](https://supabase.com/docs/guides/storage)               |
| **UI**       | [React 19](https://react.dev/)                                             |
| **Styling**  | CSS Modules + Custom CSS Variables                                         |

---

## Key Features

### Performance & Optimization

-   **Client-Side Image Compression**: A custom utility compresses images in the browser (using the Canvas API) *before* uploading. Images are resized to a max of 1920px and compressed to 85% JPEG quality, drastically reducing bandwidth and storage costs.
-   **Asset Caching Layer**: Next.js `rewrites` are configured to proxy Supabase Storage assets through a custom `/api/images/` endpoint. This allows applying aggressive, long-lived `Cache-Control` headers (`max-age=31536000` or `stale-while-revalidate`), improving load times for returning visitors.
-   **Next.js Font Optimization**: Google Fonts (Lato, Jost, Montserrat) are loaded via `next/font/google` with `display: swap` for optimal rendering performance and zero layout shift.

### Secure Admin Dashboard

-   **JWT-Based Authentication**: User sessions are managed via `@supabase/ssr`, which stores JWT tokens in secure, HTTP-only cookies. The middleware automatically refreshes sessions on each request.
-   **Route Protection**: The `/admin` layout is a Server Component that performs an auth check on every request. Unauthenticated users are instantly redirected to the login page.
-   **Row Level Security (RLS)**: All database tables (`dresses`, `collections`, etc.) and the storage bucket have RLS policies. Public users can only `SELECT`, while `INSERT`, `UPDATE`, and `DELETE` require an authenticated role.

### Next.js App Router Patterns

-   **Server Actions**: All data mutations (create, update, delete) are handled by Server Actions in `/src/actions/`. These functions run securely on the server, interact with the database, and call `revalidatePath` to purge and regenerate cached pages.
-   **Automatic Storage Cleanup**: When a dress is deleted, the server action also cleans up associated images from Supabase Storage, preventing orphaned files.
-   **Automatic Slug Generation**: When creating a new item, the slug is auto-generated from the name field on blur, using a custom `generateSlug` utility.

### SEO & Discoverability

-   **Dynamic Sitemap (`/sitemap.xml`)**: A programmatic sitemap fetches all dress slugs from the database at build/request time, ensuring search engines always have an up-to-date list of pages with proper `priority` and `changeFrequency` values.
-   **Robots.txt (`/robots.txt`)**: Programmatically generated to allow public routes while explicitly blocking `/admin`, `/api/`, and `/login` from crawlers.
-   **OpenGraph Metadata**: The root layout includes comprehensive OG tags and a custom `og-image.jpg` for rich social media previews.

---

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/gultekin-ataseven-web.git
    cd gultekin-ataseven-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    # Optional: for sitemap generation
    NEXT_PUBLIC_SITE_URL=https://your-domain.com
    ```

4.  **Set up Supabase:**
    Run the `supabase_schema.sql` file in your Supabase SQL Editor to create the necessary tables, storage bucket, and RLS policies.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## Project Structure

```
src/
├── actions/          # Server Actions for data mutations (createDress, deleteDress, etc.)
├── app/
│   ├── (public)/     # Public-facing routes (collections, dresses, contact)
│   ├── admin/        # Protected admin dashboard routes
│   ├── login/        # Login page
│   ├── layout.tsx    # Root layout with fonts, metadata
│   ├── sitemap.ts    # Dynamic sitemap generation
│   └── robots.ts     # Programmatic robots.txt
├── components/
│   ├── admin/        # Admin-specific components (forms, uploaders, toast)
│   └── ...           # Public components (Navbar, Footer, DressCard)
├── lib/              # Supabase client (browser)
└── utils/
    ├── imageCompression.ts  # Client-side image compression utility
    ├── slugify.ts           # Slug generation utility
    └── supabase/            # Supabase client helpers (server, middleware)
```
