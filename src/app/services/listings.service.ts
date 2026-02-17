import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListingSummary, ListingDetails, ListingsResponse, HostawayListingResponse } from '../models/listing.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ListingsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getListings(cursor?: string, limit = 20): Observable<ListingsResponse> {
    let params = new HttpParams().set('limit', limit);
    if (cursor) {
      params = params.set('cursor', cursor);
    }
    return this.http.get<ListingsResponse>(`${this.apiUrl}/api/listings`, { params });
  }

  getListingById(listingId: number): Observable<ListingDetails> {
    return this.http.get<ListingDetails>(`${this.apiUrl}/api/listings/${listingId}`);
  }

  getHostawayListing(listingId: number): Observable<HostawayListingResponse> {
    const headers = new HttpHeaders().set('X-API-Key', environment.apiKey);
    return this.http.get<HostawayListingResponse>(`${this.apiUrl}/api/v1/hostaway/listings/${listingId}`, { headers });
  }
}
