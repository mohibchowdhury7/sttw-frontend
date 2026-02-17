import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailabilityResponse } from '../models/availability.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAvailability(
    listingId: number,
    start: string,
    end: string,
  ): Observable<AvailabilityResponse> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<AvailabilityResponse>(`${this.apiUrl}/api/listings/${listingId}/availability`, {
      params,
    });
  }
}
