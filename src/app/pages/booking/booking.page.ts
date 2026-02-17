import { Component, inject, signal, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingDetails } from '../../models/listing.model';
import { BookingRequest } from '../../models/booking.model';
import { ListingsService } from '../../services/listings.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-page',
  imports: [ReactiveFormsModule],
  templateUrl: './booking.page.html',
})
export class BookingPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private listingsService = inject(ListingsService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);

  listing = signal<ListingDetails | null>(null);
  loading = signal(true);
  submitting = signal(false);
  submitError = signal<string | null>(null);
  private idempotencyKey = crypto.randomUUID();

  checkIn = signal('');
  checkOut = signal('');
  guests = signal(1);

  guestForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    notes: [''],
  });

  ngOnInit(): void {
    const listingId = Number(
      this.route.snapshot.paramMap.get('listingId'),
    );

    // Read dates and guests from query params (set by BookingSidebar)
    const queryParams = this.route.snapshot.queryParams;
    this.checkIn.set(queryParams['checkIn'] ?? '');
    this.checkOut.set(queryParams['checkOut'] ?? '');
    this.guests.set(Number(queryParams['guests']) || 1);

    // Pre-fill guest form with logged-in user's data
    const user = this.authService.currentUser();
    if (user) {
      this.guestForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
      });
    }

    if (listingId) {
      this.listingsService.getListingById(listingId).subscribe({
        next: (details) => {
          this.listing.set(details);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }

  onSubmit(): void {
    if (this.guestForm.invalid || this.submitting()) return;

    this.guestForm.markAllAsTouched();
    if (this.guestForm.invalid) return;

    const listing = this.listing();
    if (!listing) return;

    this.submitting.set(true);
    this.submitError.set(null);

    const formValue = this.guestForm.value;

    const request: BookingRequest = {
      listingId: listing.listingId,
      checkIn: this.checkIn(),
      checkOut: this.checkOut(),
      guests: this.guests(),
      guest: {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone || undefined,
      },
      payment: {
        mode: 'pay_at_property',
        provider: 'none',
        paymentIntentId: '',
      },
      notes: formValue.notes || undefined,
    };

    this.bookingService.createBooking(request, this.idempotencyKey).subscribe({
      next: (response) => {
        this.submitting.set(false);
        // Reset key after successful booking so a new submission gets a fresh key
        this.idempotencyKey = crypto.randomUUID();
        this.router.navigate(['/booking-confirmation'], {
          state: { booking: response, listingName: listing.name },
        });
      },
      error: (err) => {
        this.submitting.set(false);
        // Keep the same idempotency key so retries are safe
        this.submitError.set(
          err?.error?.message ??
            'Something went wrong. Please try again.',
        );
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.guestForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getFieldError(fieldName: string): string {
    const control = this.guestForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Please enter a valid email.';
    return '';
  }
}
