import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ListingSummary } from '../../models/listing.model';
import { ListingsService } from '../../services/listings.service';
import { ListingCard } from '../../shared/components/listing-card/listing-card.component';
import { SkeletonCard } from '../../shared/components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-listings-catalog-page',
  imports: [ListingCard, SkeletonCard],
  templateUrl: './listings-catalog.page.html',
})
export class ListingsCatalogPage implements OnInit {
  private listingsService = inject(ListingsService);

  listings = signal<ListingSummary[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  nextCursor = signal<string | null>(null);
  error = signal<string | null>(null);

  hasMore = computed(() => this.nextCursor() !== null);
  isEmpty = computed(() => !this.loading() && this.listings().length === 0);

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.loading.set(true);
    this.error.set(null);

    this.listingsService.getListings(undefined, 20).subscribe({
      next: (response) => {
        this.listings.set(response.data);
        this.nextCursor.set(response.nextCursor || null);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load listings. Please try again.');
        this.loading.set(false);
      },
    });
  }

  loadMore(): void {
    const cursor = this.nextCursor();
    if (!cursor || this.loadingMore()) return;

    this.loadingMore.set(true);

    this.listingsService.getListings(cursor, 20).subscribe({
      next: (response) => {
        this.listings.update((current) => [...current, ...response.data]);
        this.nextCursor.set(response.nextCursor || null);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
      },
    });
  }
}
