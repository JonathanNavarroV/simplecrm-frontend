import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  Injector,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() label?: string;
  @Input() placeholder?: string = '';
  @Input() error?: string;

  public ngControl: NgControl | null = null;

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef,
  ) {}

  // Valor interno como string para mostrar en el input
  private _value: string = '';

  @Input()
  set value(v: string | number | null) {
    // Aceptar cualquier tipo y convertir a string internamente
    if (v === null || v === undefined) this._value = '';
    else this._value = String(v);
    // Al asignar un valor externo, actualizar el estado numérico y la previsualización
    this.updateNumericStateFromValue();
  }
  get value(): string {
    return this._value;
  }
  @Output() valueChange = new EventEmitter<string | null>();

  /** Máxima longitud permitida para la entrada (número de caracteres). Por defecto 15 */
  @Input() maxLength: number = 15;
  private onChange: (v: string | null) => void = () => {};
  onTouched: () => void = () => {};
  @Input() disabled: boolean = false;
  // Indica si el contenido actual puede convertirse a `number` correctamente.
  isNumberValid: boolean = false;
  // Valor numérico convertido cuando corresponde, o null si no es convertible.
  numericValue: number | null = null;
  /** Separador de miles (por ejemplo ',' ó '.') usado en la previsualización */
  @Input() thousandSeparator: string = '.';
  /** Separador decimal (por ejemplo '.' ó ',') usado en la previsualización */
  @Input() decimalSeparator: string = ',';
  /** Texto a mostrar antes del número en la previsualización (ej. moneda) */
  @Input() previewPrefix: string = '';
  /** Texto a mostrar después del número en la previsualización (ej. unidad) */
  @Input() previewSuffix: string = '';
  // Indica si el control está en estado de carga (muestra un spinner)
  @Input() isLoading: boolean = false;
  // Indica si mostrar un skeleton shimmer en lugar del input (para carga inicial)
  @Input() isSkeleton: boolean = false;

  // Manejo simple: aceptar cualquier entrada y emitir la cadena tal cual.
  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let raw = input.value;
    // Truncar si excede maxLength
    if (this.maxLength && raw.length > this.maxLength) {
      raw = raw.slice(0, this.maxLength);
      // actualizar el elemento para reflejar truncamiento
      input.value = raw;
    }
    this._value = raw;
    const out = raw === '' ? null : raw;
    // Validación localizada: convertir sólo si la cadena cumple el formato según los separadores configurados.
    const trimmed = raw.trim();
    if (trimmed === '') {
      this.numericValue = null;
      this.isNumberValid = false;
    } else {
      const num = this.parseLocalizedNumber(trimmed);
      if (num === null) {
        this.numericValue = null;
        this.isNumberValid = false;
      } else {
        this.numericValue = num;
        this.isNumberValid = true;
      }
    }
    this.valueChange.emit(out);
    this.onChange(out);
  }

  private escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Parsea un número de texto basado en los separadores configurados.
   * Devuelve `number` o `null` si la cadena no corresponde al formato esperado.
   */
  private parseLocalizedNumber(text: string): number | null {
    const ts = this.thousandSeparator;
    const ds = this.decimalSeparator;
    // Si separadores coinciden o son vacíos, caer al parser simple
    if (!ts && !ds) {
      const n = Number(text);
      return Number.isFinite(n) ? n : null;
    }

    const dsEsc = this.escapeRegExp(ds);
    const plain = new RegExp(`^-?\\d+(?:${dsEsc}\\d+)?$`);

    // Rechazar explícitamente si el usuario ha introducido el separador de miles en el input.
    // No permitimos que el usuario escriba separadores de miles; solo se acepta la forma "plana"
    // con el separador decimal configurado.
    if (ts && ts !== ds && text.indexOf(ts) !== -1) return null;

    if (!plain.test(text)) return null;

    // Normalizar: sustituir separador decimal configurado por '.' para parsear
    const normalized = ds ? text.split(ds).join('.') : text;

    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }

  private formatNumber(n: number): string {
    const isNegative = n < 0;
    const abs = Math.abs(n);
    const parts = String(abs).split('.');
    const intRaw = parts[0];
    const fracRaw = parts[1] || '';

    const intWithSep = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
    const sign = isNegative ? '-' : '';

    // Mostrar la parte completa formateada; no limitar por `maxLength`.
    if (fracRaw && fracRaw.length > 0) {
      return sign + intWithSep + this.decimalSeparator + fracRaw;
    }
    return sign + intWithSep;
  }

  get formattedPreview(): string | null {
    if (this.numericValue === null) return null;
    return this.formatNumber(this.numericValue);
  }

  writeValue(obj: any): void {
    if (typeof obj === 'number') this._value = String(obj);
    else if (obj === null) this._value = '';
    else this._value = obj ?? '';
    // Cuando Angular establece el valor (form control), calcular también la previsualización
    this.updateNumericStateFromValue();
  }

  // Actualiza `numericValue` y `isNumberValid` a partir del `_value` actual.
  private updateNumericStateFromValue(): void {
    const trimmed = (this._value ?? '').toString().trim();
    if (trimmed === '') {
      this.numericValue = null;
      this.isNumberValid = false;
      try {
        this.cdr.detectChanges();
      } catch {}
      return;
    }
    const num = this.parseLocalizedNumber(trimmed);
    if (num === null) {
      this.numericValue = null;
      this.isNumberValid = false;
    } else {
      this.numericValue = num;
      this.isNumberValid = true;
    }
    try {
      this.cdr.detectChanges();
    } catch {}
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = !!isDisabled;
  }

  get displayError(): string | undefined {
    if (this.error) return this.error;
    const errs = this.ngControl?.control?.errors;
    if (!errs) return undefined;
    if (errs['required']) return `${this.label ?? 'Este campo'} es requerido.`;
    if (errs['minlength']) return `${this.label ?? 'Este campo'} es muy corto.`;
    return undefined;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ngControl = this.injector.get(NgControl, null);
      if (this.ngControl) {
        try {
          this.ngControl.valueAccessor = this;
        } catch {}
      }
      try {
        this.cdr.detectChanges();
      } catch {}
    });
  }
}
