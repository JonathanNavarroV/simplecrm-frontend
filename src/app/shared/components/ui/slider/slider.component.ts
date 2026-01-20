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
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();

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
}
