import { Component, computed, input } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from '../../pipes/currency.pipe';

@Component({
  selector: 'app-booking-sidebar',
  imports: [CurrencyFormatPipe],
  templateUrl: './booking-sidebar.component.html',
})
export class BookingSidebar {
  listingId = input.required<number>();
  checkIn = input<string | null>(null);
  checkOut = input<string | null>(null);
  guests = input<number>(1);
  pricePerNight = input<number>(0);
  currency = input<string>('USD');
  minStay = input<number>(1);

  constructor(private router: Router) {}

  numberOfNights = computed(() => {
    const ci = this.checkIn();
    const co = this.checkOut();
    if (!ci || !co) return 0;
    const start = new Date(ci);
    const end = new Date(co);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  });

  subtotal = computed(() => this.numberOfNights() * this.pricePerNight());

  canBook = computed(() => {
    return (
      this.checkIn() !== null &&
      this.checkOut() !== null &&
      this.numberOfNights() >= this.minStay()
    );
  });

  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Select date';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  bookNow(): void {
    if (!this.canBook()) return;
    this.router.navigate(['/listings', this.listingId(), 'book'], {
      queryParams: {
        checkIn: this.checkIn(),
        checkOut: this.checkOut(),
        guests: this.guests(),
      },
    });
  }
}
