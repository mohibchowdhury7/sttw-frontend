import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookingResponse } from '../../models/booking.model';

@Component({
  selector: 'app-booking-confirmation-page',
  imports: [RouterLink],
  templateUrl: './booking-confirmation.page.html',
})
export class BookingConfirmationPage implements OnInit {
  private router = inject(Router);

  booking = signal<BookingResponse | null>(null);
  listingName = signal('');
  hasData = signal(false);

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state ?? history.state;

    if (state?.['booking']) {
      this.booking.set(state['booking'] as BookingResponse);
      this.listingName.set(state['listingName'] ?? '');
      this.hasData.set(true);
    }
  }
}
