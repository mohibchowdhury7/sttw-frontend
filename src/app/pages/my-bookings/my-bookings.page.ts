import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingResponse } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings-page',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './my-bookings.page.html',
})
export class MyBookingsPage implements OnInit {
  private bookingService = inject(BookingService);

  bookings = signal<BookingResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe({
      next: (response) => {
        this.bookings.set(response.bookings ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load bookings.');
        this.loading.set(false);
      },
    });
  }
}
