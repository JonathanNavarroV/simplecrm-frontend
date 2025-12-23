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
  set value(v: number | string) {
    this.writeValue(v);
  }
  get value(): string {
    return this._value;
  }
  disabled = false;

  @Output() valueChange = new EventEmitter<number | null>();

  private onChange: (v: number | null) => void = () => {};
  onTouched: () => void = () => {};

  onInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    // Permitir sólo dígitos y un '-' al inicio
    let filtered = raw.replace(/[^0-9-]/g, '');
    // Mantener sólo el primer '-' si está al inicio
    if (filtered.includes('-')) {
      // separar primer char si es '-'
      if (filtered[0] === '-') {
        // eliminar otros '-' del resto
        filtered = '-' + filtered.slice(1).replace(/-/g, '');
      } else {
        // quitar todos los '-' si no están al inicio
        filtered = filtered.replace(/-/g, '');
      }
    }

    // Actualizar valor solo si cambió para evitar bucles
    if (filtered !== this._value) {
      this._value = filtered;
      const num = this.convertToNumber(filtered);
      this.valueChange.emit(num);
      this.onChange(num);
      // actualizar el input mostrado
      try {
        (e.target as HTMLInputElement).value = filtered;
      } catch {}
    }
  }

  onPaste(e: ClipboardEvent) {
    const paste = e.clipboardData?.getData('text') ?? '';
    let filtered = paste.replace(/[^0-9-]/g, '');
    if (filtered.includes('-')) {
      if (filtered[0] === '-') filtered = '-' + filtered.slice(1).replace(/-/g, '');
      else filtered = filtered.replace(/-/g, '');
    }
    // Prevent default paste and insert filtered text manually
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const newValue = input.value.slice(0, start) + filtered + input.value.slice(end);
    const final = newValue.replace(/[^0-9-]/g, '');
    // cleanup '-' occurrences
    let finalClean = final;
    if (finalClean.includes('-')) {
      if (finalClean[0] === '-') finalClean = '-' + finalClean.slice(1).replace(/-/g, '');
      else finalClean = finalClean.replace(/-/g, '');
    }
    this._value = finalClean;
    const num = this.convertToNumber(finalClean);
    this.valueChange.emit(num);
    this.onChange(num);
    try {
      input.value = finalClean;
      const pos =
        input.value.indexOf('-') === 0 && start > 0
          ? start + filtered.length
          : start + filtered.length;
      input.setSelectionRange(pos, pos);
    } catch {}
  }

  private convertToNumber(s: string): number | null {
    if (s == null || s === '') return null;
    if (s === '-') return null;
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? null : n;
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
      // '-' sólo permitido si se escribe en la posición 0 y aún no existe
      if (key === '-') {
        const input = e.target as HTMLInputElement;
        const start = input.selectionStart ?? 0;
        if (start === 0 && !input.value.includes('-')) return;
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
