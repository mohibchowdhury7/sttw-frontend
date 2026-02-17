import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRequest, BookingResponse } from '../models/booking.model';
import { environment } from '../../environments/environment';

export interface BookingsListResponse {
  bookings: BookingResponse[];
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createBooking(request: BookingRequest, idempotencyKey: string): Observable<BookingResponse> {
    const headers = new HttpHeaders().set('Idempotency-Key', idempotencyKey);
    return this.http.post<BookingResponse>(`${this.apiUrl}/api/bookings`, request, { headers });
  }

  getBookings(): Observable<BookingsListResponse> {
    return this.http.get<BookingsListResponse>(`${this.apiUrl}/api/bookings`);
  }

  getBookingById(bookingId: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/api/bookings/${bookingId}`);
  }
}
