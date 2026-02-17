import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-guest-selector',
  template: `
    <div class="flex items-center gap-3">
      <label class="text-sm font-medium text-stone-700">Guests</label>

      <div class="flex items-center gap-2 bg-stone-50 rounded-lg px-1 py-1">
        <!-- Minus Button -->
        <button
          (click)="decrement()"
          [disabled]="guests() <= 1"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
          [class]="
            guests() <= 1
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
          "
          aria-label="Decrease guests"
        >
          &minus;
        </button>

        <!-- Count -->
        <span class="w-8 text-center font-semibold text-stone-800 tabular-nums">
          {{ guests() }}
        </span>

        <!-- Plus Button -->
        <button
          (click)="increment()"
          [disabled]="guests() >= maxGuests()"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
          [class]="
            guests() >= maxGuests()
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-white text-stone-600 hover:bg-stone-100 shadow-sm'
          "
          aria-label="Increase guests"
        >
          +
        </button>
      </div>
    </div>
  `,
})
export class GuestSelector {
  guests = model<number>(1);
  maxGuests = input<number>(10);

  increment(): void {
    if (this.guests() < this.maxGuests()) {
      this.guests.update((g) => g + 1);
    }
  }

  decrement(): void {
    if (this.guests() > 1) {
      this.guests.update((g) => g - 1);
    }
  }
}
