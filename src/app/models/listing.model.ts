export interface ListingSummary {
  listingId: number;
  name: string;
  city?: string;
  country?: string;
  maxGuests?: number;
  baseCurrency?: string;
  thumbnailUrl?: string;
}

export interface ListingDetails extends ListingSummary {
  description?: string;
  address?: string;
  amenities?: string[];
  images?: string[];
  checkInTime?: string;
  checkOutTime?: string;
}

export interface ListingsResponse {
  data: ListingSummary[];
  nextCursor: string;
}

export interface HostawayListingImage {
  url: string;
}

export interface HostawayListing {
  id: number;
  name: string;
  city: string;
  country: string;
  description: string;
  address: string;
  personCapacity: number;
  currencyCode: string;
  checkInTimeStart: number;
  checkInTimeEnd: number;
  checkOutTime: number;
  listingImages: HostawayListingImage[];
  isBookingEngineActive: number;
  airbnbListingUrl: string;
  vrboListingUrl: string;
  googleVrListingUrl: string;
  expediaListingUrl: string;
}

export interface HostawayListingResponse {
  success: boolean;
  data: HostawayListing;
}
