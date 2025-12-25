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
  // Máximo de dígitos permitidos (por defecto 15 para evitar notación exponencial)
  @Input() maxDigits = 15;

  public ngControl: NgControl | null = null;

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef,
  ) {}

  // Valor interno como string para mostrar en el input
  private _value: string = '';

  @Input()
  set value(v: number | string | null) {
    this.writeValue(v);
  }
  get value(): string {
    return this._value;
  }
  disabled = false;

  @Output() valueChange = new EventEmitter<number | null>();

  private onChange: (v: number | null) => void = () => {};
  onTouched: () => void = () => {};
  // Flag para manejo de composición IME. Mientras se compone, no sanitizamos.
  private isComposing = false;

  onInput(e: Event) {
    if (this.isComposing) return;
    const input = e.target as HTMLInputElement;
    const raw = input.value;
    const selStart = input.selectionStart ?? raw.length;
    // Permitir sólo dígitos y un '-' al inicio
    let filtered = raw.replace(/[^0-9-]/g, '');
    // Mantener '-' sólo si está al inicio
    if (filtered.includes('-')) {
      if (filtered[0] === '-') {
        filtered = '-' + filtered.slice(1).replace(/-/g, '');
      } else {
        filtered = filtered.replace(/-/g, '');
      }
    }
    // Truncar al máximo de dígitos (excluyendo '-').
    const digitsOnly = filtered.startsWith('-') ? filtered.slice(1) : filtered;
    if (this.maxDigits && digitsOnly.length > this.maxDigits) {
      const truncated = digitsOnly.slice(0, this.maxDigits);
      filtered = filtered.startsWith('-') ? '-' + truncated : truncated;
    }

    // Actualizar valor solo si cambió para evitar bucles
    if (filtered !== this._value) {
      this._value = filtered;
      const num = filtered === '' || filtered === '-' ? null : Number(filtered);
      this.valueChange.emit(num);
      this.onChange(num);
      // Forzar actualización del input de forma segura y conservar caret
      try {
        const delta = filtered.length - raw.length;
        let newPos = Math.max(0, Math.min(filtered.length, selStart + delta));
        setTimeout(() => {
          try {
            input.value = filtered;
            input.setSelectionRange(newPos, newPos);
          } catch {}
        }, 0);
      } catch {}
    }
  }

  onPaste(e: ClipboardEvent) {
    const paste = e.clipboardData?.getData('text') ?? '';
    const digits = paste.replace(/[^0-9-]/g, '');
    // Evitar pegado por defecto e insertar solo los dígitos filtrados
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const newValue = input.value.slice(0, start) + digits + input.value.slice(end);
    // Filtrar '-' y dígitos como en onInput
    let finalClean = newValue.replace(/[^0-9-]/g, '');
    if (finalClean.includes('-')) {
      if (finalClean[0] === '-') finalClean = '-' + finalClean.slice(1).replace(/-/g, '');
      else finalClean = finalClean.replace(/-/g, '');
    }
    // Truncar dígitos excluyendo '-'
    const finalDigits = finalClean.startsWith('-') ? finalClean.slice(1) : finalClean;
    if (this.maxDigits && finalDigits.length > this.maxDigits) {
      finalClean = finalClean.startsWith('-')
        ? '-' + finalDigits.slice(0, this.maxDigits)
        : finalDigits.slice(0, this.maxDigits);
    }
    this._value = finalClean;
    const num = finalClean === '' || finalClean === '-' ? null : Number(finalClean);
    this.valueChange.emit(num);
    this.onChange(num);
    // Forzar actualización del input y mantener caret
    try {
      setTimeout(() => {
        try {
          input.value = finalClean;
          const tentative = start + digits.length;
          const pos = Math.max(0, Math.min(finalClean.length, tentative));
          input.setSelectionRange(pos, pos);
        } catch {}
      }, 0);
    } catch {}
  }

  onCompositionStart(): void {
    this.isComposing = true;
  }

  onCompositionEnd(e: CompositionEvent): void {
    this.isComposing = false;
    // Procesar el valor final tras composición
    this.onInput(e as unknown as Event);
  }

  onKeyDown(e: KeyboardEvent) {
    // permitir combinaciones con ctrl/meta (copiar/pegar, etc.)
    if (e.ctrlKey || e.metaKey) return;

    const key = e.key;
    // permitir teclas de control/navegación
    const allowed = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Tab',
      'Enter',
    ];
    if (allowed.includes(key)) return;

    // Si es un carácter imprimible de longitud 1
    if (key.length === 1) {
      // dígitos permitidos
      if (/^[0-9]$/.test(key)) return;
      // permitir '-' sólo si va a ser el primer carácter y no existe otro
      if (key === '-') {
        const input = e.target as HTMLInputElement;
        const start = input.selectionStart ?? 0;
        // Si se intenta insertar '-' en la posición 0, manejamos manualmente
        // para reemplazar cualquier '-' existente y evitar acumulaciones.
        if (start === 0) {
          e.preventDefault();
          // Construir nuevo valor con '-' solo al inicio y sin otros '-'
          const current = input.value ?? '';
          const digitsOnly = current.replace(/-/g, '');
          // Truncar según maxDigits
          const truncated = this.maxDigits ? digitsOnly.slice(0, this.maxDigits) : digitsOnly;
          const newValue = '-' + truncated;
          this._value = newValue;
          const num = newValue === '-' || newValue === '' ? null : Number(newValue);
          this.valueChange.emit(num);
          this.onChange(num);
          // Actualizar input y poner caret después del '-'
          try {
            input.value = newValue;
            input.setSelectionRange(1, 1);
          } catch {}
          return;
        }
      }
    }

    // cualquier otra tecla imprimible se bloquea
    e.preventDefault();
  }

  writeValue(obj: any): void {
    if (typeof obj === 'number') this._value = String(obj);
    else if (obj === null) this._value = '';
    else this._value = obj ?? '';
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
