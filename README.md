# Showscenes

A Netflix/Marvel-inspired movie and TV browser built with **React + TypeScript + Vite + Tailwind CSS v4** and powered by **The Movie Database (TMDB)** API.

This app lets you:

- Discover popular, top-rated, trending, and currently playing **movies & TV shows**
- Toggle **Movies / TV** mode on the home page
- Use **infinite scroll** to browse large lists smoothly
- View rich **detail pages** for movies, TV shows, seasons, episodes, and people
- See **cast, trailers, reviews, recommendations, providers** and more
- Browse a person's **acting timeline** with clickable credits
- Toggle between **Dark / Light themes** with a macOS-style pill switch
- Maintain a personal **favorites list** with **user ratings**

> **Note:** This project uses the TMDB API but is **not endorsed or certified** by TMDB.

---

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4 (with `@theme`)
- **Animations:** Framer Motion
- **Routing:** React Router
- **State / Context:**
  - `MovieContext` – favorites & ratings
  - `ThemeContext` – dark/light theme (via `data-theme`)
- **API:** [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api)

---

## Project Structure

```bash
src/
│   App.tsx
│   main.tsx
│
├── assets/
│     └── no-image.png
│
├── components/
│   ├── ui/
│   │     Badge.tsx
│   │     Button.tsx
│   │     IconButton.tsx
│   │     Surface.tsx
│   │     SectionHeader.tsx
│   │     ModeToggleTabs.tsx
│   │     CarouselRow.tsx
│   │
│   ├── media/
│   │     MovieCard.tsx
│   │     MovieGrid.tsx
│   │     MovieSkeleton.tsx
│   │     CastCarousel.tsx
│   │     TrailerCarousel.tsx
│   │     RecommendationsRow.tsx
│   │     SeasonCarousel.tsx
│   │     EpisodeCard.tsx
│   │     PersonActingTimeline.tsx
│   │
│   └── layout/
│         NavBar.tsx
│         ThemeToggle.tsx
│         ThemeSwitcher.tsx
│
├── contexts/
│     MovieContext.tsx
│     ThemeContext.tsx
│
├── hooks/
│     useDebounce.ts
│     useInfiniteScroll.ts
│     useMovieCache.ts
│
├── pages/
│   ├── movie/
│   │     MovieDetails.tsx
│   │
│   ├── tv/
│   │     TvDetails.tsx
│   │     SeasonDetails.tsx
│   │     EpisodeDetails.tsx
│   │
│   └── person/
│         PersonDetails.tsx
│
├── services/
│     api.ts
│
├── styles/
│     main.css
│
└── types/
      Movie.ts
      Tv.ts
      Person.ts
      Shared.ts
```

---

## Environment Setup

This app uses a **TMDB v3 API (Bearer token)** for all requests.

1. Create a `.env` file in the project root:

   ```bash
   VITE_TMDB_KEY=YOUR_TMDB_V4_READ_ACCESS_TOKEN
   ```

   - This should be the **Read Access Token (v4 auth)** from your TMDB account.
   - It is used in `src/services/api.ts` as:

     ```ts
     Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`;
     ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Preview the production build:

   ```bash
   npm run preview
   ```

---

## Theming & Design System

This project uses **Tailwind CSS v4** with the `@theme` feature and a `data-theme` attribute on `<html>` to control dark/light mode.

- Themes are defined in `src/styles/main.css` using `@theme`:
  - `--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, etc.
  - Separate values for **light** and **dark** using `@dark`.
- `ThemeContext` manages:
  - Current theme: `"dark"` | `"light"`
  - Persists to `localStorage`
  - Syncs `document.documentElement.dataset.theme`

**Key helpers (CSS):**

- `.bg-surface` – main card/background surfaces
- `.bg-surface-alt` – elevated or alternate surfaces
- `.text-muted`, `.text-soft` – secondary text
- `.border-token`, `.border-token-strong` – semantic borders
- `.shadow-card` – cinematic card shadow

The **NavBar** includes a **macOS-style pill switch** (ThemeToggle) on the right side to flip themes.

---

## ⭐ Core Features

### Home Page (`/`)

- Toggle **Movies / TV Shows** with a pill switch
- **Search** with debounced input
  - Search persists when navigating away and back
  - Clear (`×`) button to reset search text
- Category tabs (mapped to TMDB endpoints):
  - **Popular**
  - **Top Rated**
  - **Trending**
  - **Now Playing** / **On the Air**
- **Infinite scroll** via `useInfiniteScroll`
  - Smooth, non-jittery scrolling
  - Uses an intersection observer on a sentinel element
- Cinematic **MovieGrid** with:
  - Netflix-style card layout
  - Framer Motion **fade-in** and **hover scale** animations
  - Poster images with subtle gradients

### ⭐ Favorites Page (`/favorites`)

- Uses `MovieContext` to read favorite IDs and ratings
- Fetches full movie details for each favorite
- Sorts favorites by **personal rating** (highest first)
- Uses the same `MovieCard` + `MovieGrid` layout for consistency

### Movie Details (`/movie/:id`)

Includes:

- **Parallax-style hero** with backdrop, poster, title, year, runtime, genres, rating
- Tagline & overview
- **Watch providers** (where to stream/rent/buy, by region)
- **Top cast** via `CastCarousel`
  - Actor cards clickable → `/person/:id`
- **Trailers & teasers** via `TrailerCarousel`
  - YouTube embeds where available
- **User & critic reviews**
- **Recommendations row** (`RecommendationsRow`)
  - “You may also like…” horizontally scrollable carousel

### TV Show Details (`/tv/:id`)

Includes:

- Hero layout similar to movie details
- Show metadata:
  - Seasons, episodes, status, genres, networks
- **Top cast** carousel (clickable)
- **Trailers / videos**
- **Reviews**
- **Recommendations**
- **Seasons carousel** (`SeasonCarousel`):
  - Each season card is clickable → `/tv/:id/season/:seasonNumber`

### Season Details (`/tv/:id/season/:seasonNumber`)

- Season poster, name, air date, episode count, overview
- Ability to jump between **seasons** for the same show
- **Episode cards** for each episode (`EpisodeCard`):
  - Still image, number, title, air date, short overview
  - Click → `/tv/:id/season/:seasonNumber/episode/:episodeNumber`

### Episode Details (`/tv/:id/season/:seasonNumber/episode/:episodeNumber`)

- Episode hero section with still image and metadata
- Overview, air date, runtime, rating
- Guest stars + main cast
- Episode-specific videos (trailers, promos) if available

### Person Details (`/person/:id`)

- Cinematic header with:
  - Profile image on the left
  - Name, department, gender, birth/death dates, place of birth, homepage
- **Biography** section styled for readability
- Personal info grid similar to TMDB:
  - Known for, also known as, popularity, etc.
- **Acting timeline** (`PersonActingTimeline`):
  - Sorted by year
  - Groups TV & movie acting credits
  - Each credit is clickable:
    - Movie → `/movie/:id`
    - TV show → `/tv/:id`

---

## State & Context

### `MovieContext`

Handles:

- `favorites: number[]` – list of favorite IDs
- `ratings: Record<number, number>` – user rating per movie/show
- `toggleFavorite(id: number)`
- `setRating(id: number, rating: number)`

Data is persisted to `localStorage`.

### `ThemeContext`

Handles:

- `theme: "light" | "dark"`
- `setTheme(theme)`
- `toggleTheme()`

Side effects:

- Writes `data-theme="dark" | "light"` to `<html>`
- Persists selected theme to `localStorage`
- Respects system preference on first load

---

## API Layer

All API calls are defined in `src/services/api.ts` and wrap TMDB endpoints with a typed helper:

```ts
const get = async <T = any>(url: string): Promise<T> => {
	const res = await fetch(BASE + url, options);
	if (!res.ok) throw new Error(`API error ${res.status}`);
	return res.json() as Promise<T>;
};
```

**Movies:**

- `getPopular`, `getTopRated`, `getTrending`, `getNowPlaying`
- `searchMovies`
- `getMovie`
- `getMovieCredits`
- `getMovieVideos`
- `getMovieReviews`
- `getMovieRecommendations`
- `getMovieWatchProviders`

**TV Shows:**

- `getPopularTv`, `getTopRatedTv`, `getTrendingTv`, `getOnTheAirTv`
- `searchTv`
- `getTv`
- `getTvCredits`
- `getTvVideos`
- `getTvReviews`
- `getTvRecommendations`
- `getTvWatchProviders`
- `getTvSeason`
- `getTvEpisode`
- `getTvEpisodeVideos`

**People:**

- `getPerson`
- `getPersonCombinedCredits`

All functions are **typed** via the `Movie.ts`, `Tv.ts`, `Person.ts`, and `Shared.ts` models.

---

## Scripts

```bash
# Start dev server
npm run dev

# Type-check
npm run typecheck

# Lint (if configured)
npm run lint

# Build
npm run build

# Preview production build
npm run preview
```

---

## Potential Improvements

- Add user authentication and allow saving favorites to a backend
- Add filters (genre, year, language, runtime)
- Add pagination controls as an alternative to infinite scroll
- Offline caching and smarter prefetching
- Better accessibility pass (ARIA landmarks, focus rings, reduced motion mode)
- Snapshot tests for critical components

---

## Attribution

This product uses the TMDB API but is **not endorsed or certified** by TMDB.

- TMDB: <https://www.themoviedb.org/>
- API Docs: <https://developer.themoviedb.org/docs>

---

## License

You can adapt this project freely for learning, interviews, and portfolio demos.  
If you publish it publicly, please:

- Keep TMDB attribution intact
- Do not expose your **real** TMDB API key in public repos

## Deployment repair (October 2026)

Restored Linux-safe imports after the directory reorganization, React 19 type imports, carousel and hero contracts, the home screen data flow, provider display, per-resource caching and SPA route rewrites. `npm run build` retains strict TypeScript checks. Configure `VITE_TMDB_KEY` as a TMDB read token for live data. The home screen displays a visible API-configuration error if data cannot load. Vercel builds to `dist` with the Vite preset.
