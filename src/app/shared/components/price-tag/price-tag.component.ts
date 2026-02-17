import { Component, input } from '@angular/core';
import { CurrencyFormatPipe } from '../../pipes/currency.pipe';

@Component({
  selector: 'app-price-tag',
  imports: [CurrencyFormatPipe],
  template: `
    <span class="inline-flex items-baseline gap-1">
      <span class="text-xl font-bold text-stone-800">
        {{ price() | currencyFormat: currency() }}
      </span>
      <span class="text-sm text-stone-500 font-normal">/ night</span>
    </span>
  `,
})
export class PriceTag {
  price = input.required<number>();
  currency = input<string>('USD');
}
