import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'listings',
        loadComponent: () =>
          import('./pages/listings-catalog/listings-catalog.page').then(
            (m) => m.ListingsCatalogPage,
          ),
      },
      {
        path: 'listings/:listingId',
        loadComponent: () =>
          import('./pages/listing-detail/listing-detail.page').then((m) => m.ListingDetailPage),
      },
      {
        path: 'listings/:listingId/book',
        loadComponent: () => import('./pages/booking/booking.page').then((m) => m.BookingPage),
      },
      {
        path: 'booking-confirmation',
        loadComponent: () =>
          import('./pages/booking-confirmation/booking-confirmation.page').then(
            (m) => m.BookingConfirmationPage,
          ),
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.page').then((m) => m.SignupPage),
      },
      {
        path: 'my-bookings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/my-bookings/my-bookings.page').then((m) => m.MyBookingsPage),
      },
      {
        path: 'my-bookings/:bookingId',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/booking-detail/booking-detail.page').then((m) => m.BookingDetailPage),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
      },
    ],
  },
];
