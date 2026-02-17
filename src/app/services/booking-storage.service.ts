import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BookingResponse } from '../models/booking.model';

export interface StoredBooking extends BookingResponse {
  listingName?: string;
}

const STORAGE_KEY = 'sttw_bookings';

@Injectable({ providedIn: 'root' })
export class BookingStorageService {
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  save(booking: BookingResponse, listingName?: string): void {
    if (!this.isBrowser) return;

    const bookings = this.getAll();
    const stored: StoredBooking = { ...booking, listingName };
    // Avoid duplicates
    const existing = bookings.findIndex((b) => b.bookingId === booking.bookingId);
    if (existing >= 0) {
      bookings[existing] = stored;
    } else {
      bookings.unshift(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  getAll(): StoredBooking[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getById(bookingId: string): StoredBooking | null {
    return this.getAll().find((b) => b.bookingId === bookingId) ?? null;
  }
}
