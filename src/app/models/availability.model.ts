export interface AvailabilityDay {
  date: string;
  isAvailable: boolean;
  price?: number;
  minimumStay?: number;
  reason?: string;
}

export interface AvailabilityResponse {
  listingId: number;
  start: string;
  end: string;
  currency?: string;
  days: AvailabilityDay[];
}
