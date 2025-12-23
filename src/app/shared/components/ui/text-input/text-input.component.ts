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
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() label?: string;
  @Input() placeholder?: string = '';
  @Input() error?: string;

  public ngControl: NgControl | null = null;

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef,
  ) {}

  private _value: string = '';

  @Input()
  set value(v: string) {
    this.writeValue(v);
  }
  get value(): string {
    return this._value;
  }
  disabled = false;

  @Output() valueChange = new EventEmitter<string>();

  private onChange: (v: any) => void = () => {};
  onTouched: () => void = () => {};

  onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this._value = v;
    this.valueChange.emit(v);
    this.onChange(v);
  }

  writeValue(obj: any): void {
    this._value = obj ?? '';
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
