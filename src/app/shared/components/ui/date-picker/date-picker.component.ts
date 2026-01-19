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
    // En modo no-rango, si recibimos startDate/endDate (anclado externo),
    // también resaltamos esos extremos.
    if (this.startDate || this.endDate) {
      if (isSameDate(day, this.startDate ?? null) || isSameDate(day, this.endDate ?? null)) {
        return true;
      }
    }
    return isSameDate(day, this.selected ?? null);
  }

  isInRange(day: Date | null) {
    if (!day) return false;
    // En modo rango usamos start/end internos; en modo normal usamos
    // startDate/endDate anclados si existen, para sombrear el rango externo.
    if (this.startDate && this.endDate) {
      return day >= this.startDate && day <= this.endDate;
    }
    return false;
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

  // Define las clases de estilo para cada celda según su estado visual.
  dayClasses(day: Date | null): string[] {
    const classes = [
      'w-9 h-9 rounded-lg border border-transparent',
      'focus:outline-none focus:ring-2 focus:ring-indigo-100',
      'transition-colors duration-50',
    ];

    const selected = this.isSelected(day);
    const inRange = this.isInRange(day);
    const today = this.isToday(day);
    const anchored = this.isAnchored(day) && !selected && !today;
    const disabled = this.isDisabled(day);
    const otherMonth = day ? this.isOtherMonth(day) : false;

    if (disabled) {
      classes.push('text-gray-300', 'cursor-not-allowed', 'bg-gray-100', 'border-gray-200');
      return classes;
    }

    classes.push('cursor-pointer');
    // Hover sutil para celdas interactuables que no sean seleccionadas ni "hoy"
    if (!selected && !today) {
      classes.push('hover:bg-indigo-50', 'hover:border-indigo-200');
    }

    if (selected) {
      classes.push('bg-indigo-600', 'text-white');
    } else if (today && inRange) {
      // Cuando el día es hoy y además está dentro del rango, combinar ambos estilos:
      // fondo del rango + aro de "hoy" para destacarlo sin ocultar el contexto del rango.
      classes.push(
        'bg-indigo-200',
        'text-indigo-900',
        'font-semibold',
        'ring-2',
        'ring-indigo-500',
        'ring-offset-1',
      );
    } else if (today) {
      classes.push(
        'bg-white',
        'ring-2',
        'ring-indigo-500',
        'ring-offset-1',
        'text-indigo-700',
        'font-semibold',
      );
    } else if (inRange) {
      // Días intermedios del rango: aumentar visibilidad sin eclipsar los extremos
      classes.push('bg-indigo-200', 'text-indigo-900', 'font-medium', 'border-transparent');
    } else {
      classes.push('bg-white', 'text-gray-800');
    }

    if (anchored) {
      classes.push('ring-2', 'ring-indigo-300', 'ring-offset-1');
    }

    if (otherMonth && !selected && !inRange && !today) {
      // Días fuera del mes: apagados pero con hover sutil al pasar el ratón.
      classes.push('text-gray-400', 'bg-transparent', 'opacity-70', 'font-normal');
    }

    return classes;
  }
}
