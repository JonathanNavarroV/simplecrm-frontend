import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { CloseOnInteractDirective } from '../../../directives/close-on-interact.directive';
import { formatDate, toDateOnly } from '../../../utils/date-utils';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule, IconComponent, DatePickerComponent, CloseOnInteractDirective],
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
})
export class DateInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() isSkeleton: boolean = false;

  @Output() valueChange = new EventEmitter<string | null>();

  value: string | null = null;
  open = false;
  // valor interno en tipo Date para la interacción con el date-picker
  _dateValue: Date | null = null;
  @ViewChild('pickerRef', { static: false }) pickerRef?: ElementRef<HTMLElement>;
  @ViewChild('inputRef', { static: false }) inputRef?: ElementRef<HTMLInputElement>;
  pickerStyles: { [k: string]: any } = {};
  // Evita que el click inmediatamente siguiente al focus cierre el picker
  private ignoreNextClick: boolean = false;
  // Temporizador para resetear la bandera si no se recibe el click esperado
  private ignoreClickTimer: any | undefined;

  constructor(private renderer: Renderer2) {}
  onTouched = () => {};
  onChange: (v: string | null) => void = () => {};

  writeValue(obj: any): void {
    this.value = obj ?? null;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value || null;
    this.value = v;
    this.onChange(v);
    this.valueChange.emit(v);
  }

  // Handler cuando el date-picker emite una selección
  onDateSelected(d: Date) {
    const dt = toDateOnly(d);
    this._dateValue = dt;
    this.value = formatDate(dt, 'yyyy-MM-dd');
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.open = false;
  }

  ngAfterViewInit(): void {
    // noop
  }

  // Calcular posición del popup relativo al viewport y fijar estilos (fixed)
  private positionPicker() {
    try {
      if (!this.inputRef || !this.pickerRef) return;
      const inputEl = this.inputRef.nativeElement;
      const rect = inputEl.getBoundingClientRect();
      const top = rect.bottom; // sin gap: pegar el popup justo debajo del input
      const left = rect.left;
      this.pickerStyles = {
        position: 'fixed',
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        zIndex: 1100,
      };
    } catch {
      // ignore
    }
  }

  // Toggle open and position
  toggleOpen() {
    this.open = !this.open;
    // Si acabamos de abrir, ignoramos el click que suele venir inmediatamente después del focus
    if (this.open) {
      this.ignoreNextClick = true;
      // Limpiar timer previo si existe
      if (this.ignoreClickTimer) {
        clearTimeout(this.ignoreClickTimer);
      }
      // Reiniciar la bandera en caso de que no llegue el click esperado
      this.ignoreClickTimer = setTimeout(() => {
        this.ignoreNextClick = false;
        this.ignoreClickTimer = undefined;
      }, 100);
      setTimeout(() => this.positionPicker(), 0);
    }
  }

  onInputClick(e: MouseEvent) {
    if (this.ignoreNextClick) {
      this.ignoreNextClick = false;
      if (this.ignoreClickTimer) {
        clearTimeout(this.ignoreClickTimer);
        this.ignoreClickTimer = undefined;
      }
      return;
    }
    this.toggleOpen();
  }

  clear() {
    this.value = null;
    this.onChange(null);
    this.valueChange.emit(null);
  }
}
