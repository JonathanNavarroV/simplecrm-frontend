import {
  Component,
  Input,
  forwardRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { CloseOnInteractDirective } from '../../../directives/close-on-interact.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, IconComponent, CloseOnInteractDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label?: string;
  // Se aceptan arrays arbitrarios; normalizamos internamente a { value, label }
  // También soportamos grupos: { label: string, options: [...] }
  private _rawOptions: any[] = [];
  // Cada entrada puede ser una opción o un grupo de opciones
  // Usamos any[] para simplificar el acceso desde la plantilla.
  normalizedOptions: any[] = [];

  @Input() optionValueKey = 'value';
  @Input() optionLabelKey = 'label';

  @Input()
  set options(v: any[]) {
    this._rawOptions = v ?? [];
    const out: Array<any> = [];
    for (const o of this._rawOptions) {
      // Soporte para grupo: { label, options: [...] }
      if (o && Array.isArray(o.options)) {
        const grp = {
          label: String(o.label ?? o.name ?? ''),
          options: o.options.map((opt: any) => ({
            value: String(opt?.[this.optionValueKey] ?? opt?.value ?? opt?.id ?? ''),
            label: String(opt?.[this.optionLabelKey] ?? opt?.label ?? opt?.name ?? opt?.id ?? ''),
          })),
        };
        out.push(grp);
      } else {
        out.push({
          value: String(o?.[this.optionValueKey] ?? o?.value ?? o?.id ?? ''),
          label: String(o?.[this.optionLabelKey] ?? o?.label ?? o?.name ?? o?.id ?? ''),
        });
      }
    }
    this.normalizedOptions = out;
  }
  get options(): any[] {
    return this._rawOptions;
  }
  @Input() placeholder: string = 'Selecciona...';
  @Input() disabled = false;
  @Input() error?: string;
  @Input() size: 'sm' | 'md' = 'md';

  @Input() multiple = false;

  // Puede ser string (single) o string[] (multiple)
  private _value: string | string[] | null = '';

  @Output() valueChange = new EventEmitter<string | string[] | null>();

  private onChange: (v: string | string[] | null) => void = () => {};
  // exponer onTouched para usarlo desde la plantilla (blur)
  onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  get value(): string | string[] | null {
    return this._value;
  }

  @Input()
  set value(v: any) {
    this.writeValue(v);
  }

  writeValue(obj: any): void {
    if (this.multiple) {
      this._value = Array.isArray(obj) ? obj : obj ? [String(obj)] : null;
    } else {
      this._value = obj ?? '';
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

  onSelect(e: Event) {
    const v = (e.target as HTMLSelectElement).value;
    this._value = v;
    const out = v === '' ? null : v;
    this.onChange(out);
    this.valueChange.emit(out);
  }

  // --- custom multiselect helpers ---
  isOpen = false;

  toggleOpen() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  get selectedValues(): string[] {
    if (this.multiple) return Array.isArray(this._value) ? this._value.map(String) : [];
    return this._value ? [String(this._value)] : [];
  }

  isSelected(v: string) {
    return this.selectedValues.indexOf(String(v)) !== -1;
  }

  toggleOption(v: string) {
    if (this.disabled) return;
    if (!this.multiple) {
      this._value = v;
      this.onChange(v);
      this.valueChange.emit(v);
      this.close();
      return;
    }

    const arr = [...this.selectedValues];
    const i = arr.indexOf(String(v));
    if (i === -1) arr.push(String(v));
    else arr.splice(i, 1);
    this._value = arr.length ? arr : null;
    const out = arr.length ? arr : null;
    this.onChange(out);
    this.valueChange.emit(out);
  }

  get selectedLabels(): string {
    const vals = this.selectedValues;
    const labels: string[] = [];
    for (const entry of this.normalizedOptions) {
      if (entry && entry.options && Array.isArray(entry.options)) {
        for (const opt of entry.options) {
          if (vals.indexOf(opt.value) !== -1) labels.push(opt.label);
        }
      } else if (entry) {
        const opt = entry;
        if (vals.indexOf(opt.value) !== -1) labels.push(opt.label);
      }
    }
    return labels.join(', ');
  }
}
