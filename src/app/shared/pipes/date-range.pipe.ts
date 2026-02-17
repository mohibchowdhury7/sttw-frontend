import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRange',
})
export class DateRangePipe implements PipeTransform {
  transform(value: { start: string; end: string } | null | undefined): string {
    if (!value || !value.start || !value.end) return '';

    const start = new Date(value.start + 'T00:00:00');
    const end = new Date(value.end + 'T00:00:00');

    const startMonth = start.toLocaleString('en-US', { month: 'short' });
    const endMonth = end.toLocaleString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const endYear = end.getFullYear();

    if (startMonth === endMonth && start.getFullYear() === endYear) {
      // Same month and year: "Mar 15 - 20, 2026"
      return `${startMonth} ${startDay} - ${endDay}, ${endYear}`;
    }

    if (start.getFullYear() === endYear) {
      // Different months, same year: "Mar 15 - Apr 2, 2026"
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
    }

    // Different years: "Dec 28, 2025 - Jan 3, 2026"
    const startYear = start.getFullYear();
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
  }
}
