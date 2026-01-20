import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.css'],
})
export class RangeSliderComponent {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;

  @Input() prefix = '';
  @Input() suffix = '';
  @Input() thousandSeparator: string = '.';
  @Input() decimalSeparator: string = ',';
  @Input() label?: string;

  @Input() lower = 25;
  @Input() upper = 75;

  @Output() lowerChange = new EventEmitter<number>();
  @Output() upperChange = new EventEmitter<number>();
  @Output() rangeChange = new EventEmitter<{ lower: number; upper: number }>();

  private clamp(value: number): number {
    return Math.min(this.max, Math.max(this.min, value));
  }

  private decimalsFromStep(): number {
    const s = String(this.step);
    if (!s.includes('.')) return 0;
    return s.split('.')[1].length;
  }

  private escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private parseLocalizedNumber(text: string): number | null {
    const ts = this.thousandSeparator;
    const ds = this.decimalSeparator;
    if (!ts && !ds) {
      const n = Number(text);
      return Number.isFinite(n) ? n : null;
    }
    const dsEsc = this.escapeRegExp(ds);
    const plain = new RegExp(`^-?\\d+(?:${dsEsc}\\d+)?$`);
    if (ts && ts !== ds && text.indexOf(ts) !== -1) return null;
    if (!plain.test(text)) return null;
    const normalized = ds ? text.split(ds).join('.') : text;
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }

  private formatNumber(n: number, decimals?: number): string {
    const places = decimals ?? this.decimalsFromStep();
    const isNegative = n < 0;
    const abs = Math.abs(n);
    const fixed = places > 0 ? abs.toFixed(places) : String(Math.trunc(abs));
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

  get displayLower(): string {
    return this.prefix + this.formatNumber(this.lower) + this.suffix;
  }

  get displayUpper(): string {
    return this.prefix + this.formatNumber(this.upper) + this.suffix;
  }

  get displayMin(): string {
    return this.prefix + this.formatNumber(this.min) + this.suffix;
  }

  get displayMax(): string {
    return this.prefix + this.formatNumber(this.max) + this.suffix;
  }

  get lowerPercent(): string {
    const pct = ((this.lower - this.min) / (this.max - this.min)) * 100;
    return `${pct}%`;
  }

  get rangePercent(): string {
    const pct = ((this.upper - this.lower) / (this.max - this.min)) * 100;
    return `${pct}%`;
  }

  private emitChanges(): void {
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
      // Se movió a la derecha estando fusionados: pasa a ser el máximo
      this.upper = clamped;
      this.lower = prevUpper;
    } else {
      this.lower = Math.min(clamped, this.upper);
    }

    this.emitChanges();
  }

  onUpperInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    const clamped = this.clamp(raw);
    const wasMerged = this.lower === this.upper;
    const prevLower = this.lower;

    if (wasMerged && clamped < this.lower) {
      // Se movió a la izquierda estando fusionados: pasa a ser el mínimo
      this.lower = clamped;
      this.upper = prevLower;
    } else {
      this.upper = Math.max(clamped, this.lower);
    }

    this.emitChanges();
  }

  // Permite setear valores desde texto con separadores locales
  setLowerFromText(text: string): void {
    const parsed = this.parseLocalizedNumber(text.trim());
    if (parsed === null) return;
    const clamped = this.clamp(parsed);
    this.lower = Math.min(clamped, this.upper);
    this.emitChanges();
  }

  setUpperFromText(text: string): void {
    const parsed = this.parseLocalizedNumber(text.trim());
    if (parsed === null) return;
    const clamped = this.clamp(parsed);
    this.upper = Math.max(clamped, this.lower);
    this.emitChanges();
  }
}
