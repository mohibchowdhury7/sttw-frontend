export interface BookingGuest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface BookingPayment {
  mode: string;
  provider: string;
  paymentIntentId: string;
}

export interface BookingRequest {
  listingId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  guest: BookingGuest;
  payment: BookingPayment;
  notes?: string;
}

export interface BookingResponse {
  bookingId: string;
  hostawayReservationId: number;
  status: string;
  listingId: number;
  checkIn: string;
  checkOut: string;
  currency?: string;
  total?: number;
  createdAt: string;
}
