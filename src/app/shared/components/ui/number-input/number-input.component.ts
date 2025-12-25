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
    const raw = (e.target as HTMLInputElement).value;
    // Permitir sólo dígitos
    let filtered = raw.replace(/\D/g, '');
    // Truncar al máximo de dígitos configurado
    if (this.maxDigits && filtered.length > this.maxDigits) {
      filtered = filtered.slice(0, this.maxDigits);
    }

    // Actualizar valor solo si cambió para evitar bucles
    if (filtered !== this._value) {
      this._value = filtered;
      const num = filtered === '' ? null : Number(filtered);
      this.valueChange.emit(num);
      this.onChange(num);
      // Forzar actualización del input de forma segura para eliminar caracteres no permitidos
      try {
        const input = e.target as HTMLInputElement;
        setTimeout(() => {
          try {
            input.value = filtered;
            const pos = filtered.length;
            input.setSelectionRange(pos, pos);
          } catch {}
        }, 0);
      } catch {}
    }
  }

  onPaste(e: ClipboardEvent) {
    const paste = e.clipboardData?.getData('text') ?? '';
    const digits = paste.replace(/\D/g, '');
    // Evitar pegado por defecto e insertar solo los dígitos filtrados
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const newValue = input.value.slice(0, start) + digits + input.value.slice(end);
    let finalClean = newValue.replace(/\D/g, '');
    if (this.maxDigits && finalClean.length > this.maxDigits) {
      finalClean = finalClean.slice(0, this.maxDigits);
    }
    this._value = finalClean;
    const num = finalClean === '' ? null : Number(finalClean);
    this.valueChange.emit(num);
    this.onChange(num);
    // Forzar actualización del input y mantener caret
    try {
      setTimeout(() => {
        try {
          input.value = finalClean;
          const pos = start + digits.length;
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
      // sólo dígitos permitidos
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
