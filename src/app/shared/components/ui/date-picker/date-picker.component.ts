import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getMonthMatrix, isSameDate, toDateOnly, formatDate } from '../../../utils/date-utils';
import { es } from 'date-fns/locale/es';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  @Input() selected: Date | null = null;
  @Input() weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1;
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

  // Array de nombres de días en español (abreviados). Se rota según `weekStartsOn`.
  get weekdays() {
    const base = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    // weekStartsOn puede ser 0..6
    const start = this.weekStartsOn ?? 0;
    return base.slice(start).concat(base.slice(0, start));
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
    return formatDate(this.currentMonth, 'MMMM yyyy', { locale: es });
  }

  // Indica si la celda `day` corresponde a un día fuera del mes actual mostrado.
  isOtherMonth(day: Date | null) {
    if (!day) return true;
    const cm = this.currentMonth;
    return day.getMonth() !== cm.getMonth() || day.getFullYear() !== cm.getFullYear();
  }
}
