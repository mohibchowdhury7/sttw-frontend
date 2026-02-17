import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {
  private static readonly symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '\u20AC',
    GBP: '\u00A3',
    JPY: '\u00A5',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '\u00A5',
    SEK: 'kr',
    NZD: 'NZ$',
    MXN: 'MX$',
    BRL: 'R$',
    INR: '\u20B9',
    KRW: '\u20A9',
    THB: '\u0E3F',
    TRY: '\u20BA',
    ZAR: 'R',
    ILS: '\u20AA',
    AED: 'AED',
    SGD: 'S$',
    HKD: 'HK$',
  };

  transform(value: number | null | undefined, currencyCode: string = 'USD'): string {
    if (value == null) return '';

    const symbol = CurrencyFormatPipe.symbolMap[currencyCode.toUpperCase()] ?? currencyCode + ' ';

    // No decimals for JPY and KRW
    const noDecimalCurrencies = ['JPY', 'KRW'];
    const digits = noDecimalCurrencies.includes(currencyCode.toUpperCase()) ? 0 : 2;

    const formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });

    return `${symbol}${formatted}`;
  }
}
