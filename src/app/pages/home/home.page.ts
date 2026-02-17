import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListingSummary } from '../../models/listing.model';
import { ListingsService } from '../../services/listings.service';
import { ListingCard } from '../../shared/components/listing-card/listing-card.component';
import { SkeletonCard } from '../../shared/components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ListingCard, SkeletonCard],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  private listingsService = inject(ListingsService);

  featuredListings = signal<ListingSummary[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.listingsService.getListings(undefined, 6).subscribe({
      next: (response) => {
        this.featuredListings.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
