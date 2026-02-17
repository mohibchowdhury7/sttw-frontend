import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingResponse } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-detail-page',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './booking-detail.page.html',
})
export class BookingDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  booking = signal<BookingResponse | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (!bookingId) {
      this.loading.set(false);
      return;
    }

    this.bookingService.getBookingById(bookingId).subscribe({
      next: (response) => {
        this.booking.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Booking not found.');
        this.loading.set(false);
      },
    });
  }
}
