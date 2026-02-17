# CLAUDE.md - SlideToTheWorld Frontend

## Project Overview

**SlideToTheWorld** is a public vacation rental website built with Angular 21.1 SSR + TailwindCSS 4.1. It consumes a Go REST API backend (Gin framework, port 8080) that manages property listings synced across Hostaway, Airbnb, and Booking.com.

## Architecture

```
[Angular Frontend :4200] --proxy /api/--> [Go API Server :8080] ---> [Hostaway/PostgreSQL]
```

- **Frontend**: Angular 21.1 SSR with Express, TailwindCSS 4.1, Vitest
- **Backend**: Go (Gin) REST API at `../SlidetotheWorld/`
- **Dev Proxy**: `proxy.conf.json` routes `/api/*` to `http://localhost:8080`
- **No auth required**: All public endpoints are unauthenticated

## Tech Stack

- Angular 21.1 (standalone components, signals, new control flow)
- TailwindCSS 4.1 (with custom coral/teal/sunshine theme in `src/styles.css`)
- Angular SSR (Express) with `RenderMode.Server`
- Vitest for testing
- TypeScript 5.9

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (proxied to Go API)
npm run build      # Production build
npm test           # Run tests with Vitest
```

## Project Structure

```
src/app/
  app.ts / app.html / app.routes.ts    # Root component and route config
  app.config.ts                         # Providers (HttpClient, Router, Hydration)
  app.routes.server.ts                  # SSR render modes
  layout/                               # Shell: navbar + router-outlet + footer
    layout.component.ts
    navbar/navbar.component.*
    footer/footer.component.*
  pages/                                # Route-level page components
    home/                               # Landing page (/)
    listings-catalog/                   # All listings (/listings)
    listing-detail/                     # Single listing (/listings/:listingId)
    booking/                            # Booking form (/listings/:listingId/book)
    booking-confirmation/               # Success page (/booking-confirmation)
    not-found/                          # 404 page
  shared/components/                    # Reusable UI components
    listing-card/                       # Property card for grids
    image-gallery/                      # Photo carousel
    availability-calendar/              # Interactive month-view calendar
    guest-selector/                     # Guest count +/- control
    booking-sidebar/                    # Price summary + Book Now CTA
    skeleton-card/                      # Loading placeholder
    price-tag/                          # Price display
  shared/pipes/                         # Custom pipes
    currency.pipe.ts                    # Format price with currency
    date-range.pipe.ts                  # Format date ranges
  services/                             # API services
    listings.service.ts                 # GET /api/listings, /api/listings/:id
    availability.service.ts             # GET /api/listings/:id/availability
    booking.service.ts                  # POST /api/bookings
  models/                               # TypeScript interfaces
    listing.model.ts
    availability.model.ts
    booking.model.ts
```

## API Endpoints (Public - No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/listings?cursor=&limit=` | Browse listings (cursor pagination) |
| GET | `/api/listings/:listingId` | Listing details |
| GET | `/api/listings/:listingId/availability?start=&end=` | Availability calendar |
| POST | `/api/bookings` | Create booking (requires `Idempotency-Key` header) |

## Key Patterns

### Angular 21 Conventions
- **Standalone components** - no NgModule, use `imports` array in `@Component`
- **Signals** - use `signal()`, `computed()`, `effect()` for reactive state
- **inject()** - functional DI instead of constructor injection
- **New control flow** - `@if`, `@for`, `@switch` (not *ngIf/*ngFor)
- **input()/output()** - function-based inputs and outputs
- **Lazy loading** - all pages lazy-loaded via `loadComponent` in routes

### Styling
- **TailwindCSS 4.1** utility classes only
- Custom colors defined in `src/styles.css` via `@theme`: coral, teal, sunshine
- Colorful & playful design: rounded-2xl, shadow-lg, hover animations, gradients
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints

### SSR
- `RenderMode.Server` for most pages (SEO-friendly)
- `RenderMode.Client` for booking page (form-heavy, no SEO need)
- Use `afterNextRender` or `isPlatformBrowser` for browser-only code (canvas, etc.)

## Data Flow

1. **Listings catalog** fetches from `GET /api/listings` with cursor pagination
2. **Listing detail** fetches from `GET /api/listings/:id` for info and `GET /api/listings/:id/availability?start=&end=` for calendar
3. **Booking** sends `POST /api/bookings` with `Idempotency-Key` header (generated via `crypto.randomUUID()`)
4. State passes between pages via Angular Router state (`router.navigate` with `state`)

## Page Structure

### Public Pages (No Auth Required)

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Home | `/` | Done | Landing page with hero, featured listings, how it works |
| Listings Catalog | `/listings` | Done | Browse all listings with pagination |
| Listing Details | `/listings/:listingId` | Done | Gallery, info, calendar, booking sidebar |
| Checkout | `/listings/:listingId/book` | Done | Guest info form, booking submission |
| Confirmation | `/booking-confirmation` | Done | Booking success with details |
| My Bookings | `/my-bookings` | Done | List of user's bookings (public for now, auth-protected later) |
| Booking Details | `/my-bookings/:bookingId` | Done | Single booking details (public for now, auth-protected later) |
| Error / 404 | `**` | Done | Playful 404 page |

### After User API (Auth Required - Future)

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | User login form |
| Register | `/register` | User registration form |
| My Bookings | `/my-bookings` | Will become auth-protected with auth guard |
| Booking Details | `/my-bookings/:bookingId` | Will become auth-protected with auth guard |

**Auth Flow Plan**: When Login/Register are implemented, add an `AuthGuard` to protect My Bookings and Booking Details routes. Unauthenticated users will be redirected to `/login`. The navbar should show Login/Register links when logged out, and user menu with My Bookings link when logged in.

## Checklist: Current Implementation

- [x] Proxy configuration (proxy.conf.json)
- [x] Angular config (HttpClient, Router, SSR)
- [x] TypeScript models (listing, availability, booking)
- [x] API services (listings, availability, booking)
- [x] Layout shell (navbar, footer)
- [x] Shared components (listing-card, calendar, gallery, guest-selector, booking-sidebar, skeleton, price-tag)
- [x] Pipes (currency, date-range)
- [x] Home page (hero, featured listings, how it works)
- [x] Listings catalog page (grid, pagination)
- [x] Listing detail page (gallery, info, calendar, booking sidebar)
- [x] Booking page (guest form, submit)
- [x] Booking confirmation page
- [x] My Bookings page (localStorage-based, swap to API later)
- [x] Booking Details page (localStorage-based, swap to API later)
- [x] 404 page
- [x] Custom Tailwind theme (coral, teal, sunshine)
- [x] Responsive design

## Checklist: Future Features (Backend API not yet built)

- [ ] **Login / Signup** - Auth pages + backend JWT/session API
- [ ] **Auth Guard** - Protect My Bookings and Booking Details routes after login is implemented
- [ ] **Search** - Dedicated search page + backend search API (destination, dates, guests, price range filters)
- [ ] **Payment Integration** - Stripe/PayPal in booking flow (currently defaults to "pay_at_property")
- [ ] **User Profile** - Account settings, preferences
- [ ] **Reviews / Ratings** - Guest reviews for listings
- [ ] **Map View** - Interactive map showing listing locations
- [ ] **Wishlist / Favorites** - Save listings for later

## Backend Reference

The Go backend source is at `../SlidetotheWorld/`. Key files:
- `cmd/api-server/main.go` - API server entry point and route definitions
- `internal/api/handlers/public.go` - Public endpoint handlers
- `internal/models/api_response.go` - Response model definitions
- `internal/api/middleware/cors.go` - CORS configuration

## Running Locally

1. Start PostgreSQL: `docker-compose up -d` from `../SlidetotheWorld/`
2. Start Go backend: `./bin/api-server.exe` from `../SlidetotheWorld/`
3. Start frontend: `npm start` from this directory
4. Open `http://localhost:4200`
