import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;
  @Input() anchoredDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() rangeMode: boolean = false;
  @Input() weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1;
  @Input() month?: Date | string;
  @Output() select = new EventEmitter<Date>();
  @Output() rangeSelect = new EventEmitter<{ start: Date; end: Date }>();

  currentMonth: Date = new Date();
  private selectingStart = true;

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
    if (!day || this.isDisabled(day)) return;
    const normalized = toDateOnly(day);

    if (this.rangeMode) {
      if (this.selectingStart || !this.startDate) {
        // Seleccionar fecha de inicio
        this.startDate = normalized;
        this.endDate = null;
        this.selectingStart = false;
      } else {
        // Seleccionar fecha de fin
        if (normalized && this.startDate && normalized < this.startDate) {
          // Si la fecha seleccionada es anterior a la de inicio, intercambiar
          this.endDate = this.startDate;
          this.startDate = normalized;
        } else {
          this.endDate = normalized;
        }
        this.selectingStart = true;
        // Emitir el rango completo
        if (this.startDate && this.endDate) {
          this.rangeSelect.emit({ start: this.startDate, end: this.endDate });
        }
      }
    } else {
      // Modo normal
      this.selected = normalized;
      this.select.emit(normalized as Date);
    }
  }

  isSelected(day: Date | null) {
    if (this.rangeMode) {
      return isSameDate(day, this.startDate ?? null) || isSameDate(day, this.endDate ?? null);
    }
    return isSameDate(day, this.selected ?? null);
  }

  isInRange(day: Date | null) {
    if (!this.rangeMode || !this.startDate || !this.endDate || !day) return false;
    return day >= this.startDate && day <= this.endDate;
  }

  isAnchored(day: Date | null) {
    return isSameDate(day, this.anchoredDate ?? null);
  }

  isDisabled(day: Date | null) {
    if (!day) return true;
    if (this.minDate && day < this.minDate) return true;
    if (this.maxDate && day > this.maxDate) return true;
    return false;
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

  // Indica si la celda `day` corresponde al día de hoy.
  isToday(day: Date | null) {
    if (!day) return false;
    return isSameDate(day, toDateOnly(new Date()));
  }
}
