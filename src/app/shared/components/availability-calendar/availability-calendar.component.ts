import { Component, computed, input, output, signal } from '@angular/core';
import { AvailabilityDay } from '../../../models/availability.model';

@Component({
  selector: 'app-availability-calendar',
  templateUrl: './availability-calendar.component.html',
})
export class AvailabilityCalendar {
  availabilityDays = input<AvailabilityDay[]>([]);
  availabilityLoading = input<boolean>(false);
  selectedCheckIn = input<string | null>(null);
  selectedCheckOut = input<string | null>(null);

  dateSelected = output<string>();
  monthChanged = output<{ year: number; month: number }>();

  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());

  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  monthName = computed(() => {
    const date = new Date(this.currentYear(), this.currentMonth(), 1);
    return date.toLocaleString('default', { month: 'long' });
  });

  calendarDays = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const availMap = this.availabilityMap();

    const days: (CalendarDay | null)[] = [];

    // Leading empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const avail = availMap.get(dateStr);
      const checkIn = this.selectedCheckIn();
      const checkOut = this.selectedCheckOut();

      let isInRange = false;
      if (checkIn && checkOut) {
        isInRange = dateStr >= checkIn && dateStr <= checkOut;
      }

      const isCheckIn = dateStr === checkIn;
      const isCheckOut = dateStr === checkOut;

      days.push({
        day: d,
        dateStr,
        isAvailable: avail?.isAvailable ?? false,
        price: avail?.price,
        minimumStay: avail?.minimumStay,
        isInRange,
        isCheckIn,
        isCheckOut,
        isPast: dateStr < this.todayStr(),
      });
    }

    return days;
  });

  private availabilityMap = computed(() => {
    const map = new Map<string, AvailabilityDay>();
    for (const day of this.availabilityDays()) {
      map.set(day.date, day);
    }
    return map;
  });

  private todayStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  prevMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update((y) => y - 1);
    } else {
      this.currentMonth.update((m) => m - 1);
    }
    this.monthChanged.emit({ year: this.currentYear(), month: this.currentMonth() });
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update((y) => y + 1);
    } else {
      this.currentMonth.update((m) => m + 1);
    }
    this.monthChanged.emit({ year: this.currentYear(), month: this.currentMonth() });
  }

  onDayClick(day: CalendarDay | null): void {
    if (!day || !day.isAvailable || day.isPast) return;
    this.dateSelected.emit(day.dateStr);
  }
}

interface CalendarDay {
  day: number;
  dateStr: string;
  isAvailable: boolean;
  price?: number;
  minimumStay?: number;
  isInRange: boolean;
  isCheckIn: boolean;
  isCheckOut: boolean;
  isPast: boolean;
}
