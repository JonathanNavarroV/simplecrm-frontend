import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent {
  // Modo: single (valor único) o range (dos manijas)
  @Input() range = false;

  // Single value API (compatibilidad previa)
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();

  // Range API
  @Input() lower = 0;
  @Input() upper = 100;
  @Output() lowerChange = new EventEmitter<number>();
  @Output() upperChange = new EventEmitter<number>();
  @Output() rangeChange = new EventEmitter<{ lower: number; upper: number }>();

  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;

  // Formato numérico por defecto: miles '.' y decimales ','
  @Input() thousandSeparator: string = '.';
  @Input() decimalSeparator: string = ',';

  @Input() prefix = '';
  @Input() suffix = '';
  @Input() showValue = true;
  @Input() label?: string;

  onInput(e: Event) {
    const v = Number((e.target as HTMLInputElement).value);
    this.value = v;
    this.valueChange.emit(v);
  }

  private decimalPlacesFromStep(): number {
    const s = String(this.step);
    if (s.indexOf('.') === -1) return 0;
    return s.split('.')[1].length;
  }

  private formatNumber(n: number): string {
    const isNegative = n < 0;
    const abs = Math.abs(n);
    const decimals = this.decimalPlacesFromStep();
    const fixed = decimals > 0 ? abs.toFixed(decimals) : String(Math.trunc(abs));
    const parts = fixed.split('.');
    const intRaw = parts[0];
    const fracRaw = parts[1] || '';
    const intWithSep = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
    const sign = isNegative ? '-' : '';
    if (fracRaw.length > 0) {
      return sign + intWithSep + this.decimalSeparator + fracRaw;
    }
    return sign + intWithSep;
  }

  get displayValue(): string {
    return this.prefix + this.formatNumber(this.value) + this.suffix;
  }

  get displayMin(): string {
    return this.prefix + this.formatNumber(this.min) + this.suffix;
  }

  get displayMax(): string {
    return this.prefix + this.formatNumber(this.max) + this.suffix;
  }

  // Range helpers
  private clamp(value: number): number {
    return Math.min(this.max, Math.max(this.min, value));
  }

  get lowerPercent(): string {
    const pct = ((this.lower - this.min) / (this.max - this.min)) * 100;
    return `${pct}%`;
  }

  get rangePercent(): string {
    const pct = ((this.upper - this.lower) / (this.max - this.min)) * 100;
    return `${pct}%`;
  }

  private emitRange(): void {
    this.lowerChange.emit(this.lower);
    this.upperChange.emit(this.upper);
    this.rangeChange.emit({ lower: this.lower, upper: this.upper });
  }

  onLowerInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    const clamped = this.clamp(raw);
    const wasMerged = this.lower === this.upper;
    const prevUpper = this.upper;

    if (wasMerged && clamped > this.upper) {
      this.upper = clamped;
      this.lower = prevUpper;
    } else {
      this.lower = Math.min(clamped, this.upper);
    }

    this.emitRange();
  }

  onUpperInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    const clamped = this.clamp(raw);
    const wasMerged = this.lower === this.upper;
    const prevLower = this.lower;

    if (wasMerged && clamped < this.lower) {
      this.lower = clamped;
      this.upper = prevLower;
    } else {
      this.upper = Math.max(clamped, this.lower);
    }

    this.emitRange();
  }
}
