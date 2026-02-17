import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListingSummary } from '../../../models/listing.model';

@Component({
  selector: 'app-listing-card',
  imports: [RouterLink],
  templateUrl: './listing-card.component.html',
})
export class ListingCard {
  listing = input.required<ListingSummary>();
}
