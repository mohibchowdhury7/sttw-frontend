import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.page.html',
})
export class SignupPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  submitting = signal(false);
  submitError = signal<string | null>(null);

  signupForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phone: [''],
  });

  onSubmit(): void {
    if (this.signupForm.invalid || this.submitting()) return;

    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid) return;

    this.submitting.set(true);
    this.submitError.set(null);

    const { firstName, lastName, email, password, phone } = this.signupForm.value;

    this.authService
      .registerRequest({ firstName, lastName, email, password, phone: phone || undefined })
      .subscribe({
        next: (response) => {
          this.authService.handleAuthSuccess(response);
          this.submitting.set(false);
          this.router.navigate(['/my-bookings']);
        },
        error: (err) => {
          this.submitting.set(false);
          this.submitError.set(err?.error?.error ?? 'Registration failed. Please try again.');
        },
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.signupForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getFieldError(fieldName: string): string {
    const control = this.signupForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Please enter a valid email.';
    if (control.errors['minlength']) return 'Password must be at least 8 characters.';
    return '';
  }
}
