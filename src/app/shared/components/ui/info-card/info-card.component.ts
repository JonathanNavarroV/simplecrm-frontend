import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css'],
})
export class InfoCardComponent {
  @Input() title = '';
  @Input() value: string | number | null = null;
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() color: 'indigo' | 'green' | 'red' | 'yellow' | 'gray' = 'indigo';
  // Formato numérico (reusar convenciones de NumberInput)
  @Input() thousandSeparator: string = '.';
  @Input() decimalSeparator: string = ',';
  // Prefijo/sufijo opcional (ej. moneda o unidad)
  @Input() prefix: string = '';
  @Input() suffix: string = '';

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

  private formatNumber(n: number): string {
    const isNegative = n < 0;
    const abs = Math.abs(n);
    const parts = String(abs).split('.');
    const intRaw = parts[0];
    const fracRaw = parts[1] || '';
    const intWithSep = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
    const sign = isNegative ? '-' : '';
    if (fracRaw && fracRaw.length > 0) {
      return sign + intWithSep + this.decimalSeparator + fracRaw;
    }
    return sign + intWithSep;
  }

  get displayValue(): string {
    if (this.value === null || this.value === undefined) return '';
    // Si es number formatear
    if (typeof this.value === 'number') {
      return this.prefix + this.formatNumber(this.value) + this.suffix;
    }
    // Si es string intentar parsearlo como número según locales
    const s = String(this.value).trim();
    const parsed = this.parseLocalizedNumber(s);
    if (parsed !== null) {
      return this.prefix + this.formatNumber(parsed) + this.suffix;
    }
    // Texto: retornar tal cual (y respetar prefix/suffix si se desea)
    return this.prefix + s + this.suffix;
  }
}
