import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'listings/:listingId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'listings/:listingId/book',
    renderMode: RenderMode.Client,
  },
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'signup',
    renderMode: RenderMode.Client,
  },
  {
    path: 'my-bookings',
    renderMode: RenderMode.Client,
  },
  {
    path: 'my-bookings/:bookingId',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
