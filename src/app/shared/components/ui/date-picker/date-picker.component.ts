import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getMonthMatrix, isSameDate, toDateOnly, formatDate } from '../../../utils/date-utils';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  @Input() selected: Date | null = null;
  @Input() weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;
  @Input() month?: Date | string;
  @Output() select = new EventEmitter<Date>();

  currentMonth: Date = new Date();

  ngOnInit(): void {
    const m = toDateOnly(this.month as any);
    this.currentMonth = m ?? new Date();
  }

  get weeks() {
    return getMonthMatrix(this.currentMonth, this.weekStartsOn);
  }

  prevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1,
    );
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1,
    );
  }

  onSelect(day: Date | null) {
    if (!day) return;
    this.select.emit(day);
  }

  isSelected(day: Date | null) {
    return isSameDate(day, this.selected ?? null);
  }

  monthLabel() {
    return formatDate(this.currentMonth, 'MMMM yyyy');
  }
}
