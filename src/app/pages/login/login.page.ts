import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  submitting = signal(false);
  submitError = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid || this.submitting()) return;

    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.submitting.set(true);
    this.submitError.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.loginRequest({ email, password }).subscribe({
      next: (response) => {
        this.authService.handleAuthSuccess(response);
        this.submitting.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/my-bookings';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(err?.error?.error ?? 'Invalid email or password.');
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Please enter a valid email.';
    if (control.errors['minlength']) return 'Password must be at least 8 characters.';
    return '';
  }
}
