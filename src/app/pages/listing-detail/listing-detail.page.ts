import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HostawayListing } from '../../models/listing.model';
import { AvailabilityDay } from '../../models/availability.model';
import { ListingsService } from '../../services/listings.service';
import { AvailabilityService } from '../../services/availability.service';
import { ImageGallery } from '../../shared/components/image-gallery/image-gallery.component';
import { AvailabilityCalendar } from '../../shared/components/availability-calendar/availability-calendar.component';
import { BookingSidebar } from '../../shared/components/booking-sidebar/booking-sidebar.component';
import { GuestSelector } from '../../shared/components/guest-selector/guest-selector.component';

@Component({
  selector: 'app-listing-detail-page',
  imports: [
    RouterLink,
    ImageGallery,
    AvailabilityCalendar,
    BookingSidebar,
    GuestSelector,
  ],
  templateUrl: './listing-detail.page.html',
})
export class ListingDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private listingsService = inject(ListingsService);
  private availabilityService = inject(AvailabilityService);

  listing = signal<HostawayListing | null>(null);
  availability = signal<AvailabilityDay[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  selectedCheckIn = signal<string | null>(null);
  selectedCheckOut = signal<string | null>(null);
  guestCount = signal(1);

  imageUrls = computed(() =>
    this.listing()?.listingImages?.map((img) => img.url) ?? [],
  );

  checkInTimeFormatted = computed(() => {
    const l = this.listing();
    if (!l) return null;
    const start = this.formatHour(l.checkInTimeStart);
    const end = this.formatHour(l.checkInTimeEnd);
    return `${start} - ${end}`;
  });

  checkOutTimeFormatted = computed(() => {
    const l = this.listing();
    if (!l) return null;
    return this.formatHour(l.checkOutTime);
  });

  descriptionParagraphs = computed(() => {
    const desc = this.listing()?.description;
    if (!desc) return [];
    return desc.split('\n').filter((line) => line.trim().length > 0);
  });

  avgPrice = computed(() => {
    const days = this.availability().filter((d) => d.isAvailable && d.price);
    if (days.length === 0) return 0;
    const total = days.reduce((sum, d) => sum + (d.price ?? 0), 0);
    return Math.round(total / days.length);
  });

  ngOnInit(): void {
    const listingId = Number(this.route.snapshot.paramMap.get('listingId'));
    if (!listingId) {
      this.error.set('Invalid listing ID.');
      this.loading.set(false);
      return;
    }

    this.loadListing(listingId);
    this.loadAvailability(listingId);
  }

  onDateSelected(date: string): void {
    const checkIn = this.selectedCheckIn();
    const checkOut = this.selectedCheckOut();

    if (!checkIn || (checkIn && checkOut)) {
      this.selectedCheckIn.set(date);
      this.selectedCheckOut.set(null);
    } else {
      if (date > checkIn) {
        this.selectedCheckOut.set(date);
      } else {
        this.selectedCheckIn.set(date);
        this.selectedCheckOut.set(null);
      }
    }
  }

  private loadListing(listingId: number): void {
    this.listingsService.getHostawayListing(listingId).subscribe({
      next: (response) => {
        this.listing.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load listing details.');
        this.loading.set(false);
      },
    });
  }

  private loadAvailability(listingId: number): void {
    const today = new Date();
    const start = this.formatDate(today);

    const end = new Date(today);
    end.setMonth(end.getMonth() + 3);
    const endStr = this.formatDate(end);

    this.availabilityService
      .getAvailability(listingId, start, endStr)
      .subscribe({
        next: (response) => {
          this.availability.set(response.days);
        },
        error: () => {
          // Availability load failure is non-blocking
        },
      });
  }

  private formatHour(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:00 ${period}`;
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
