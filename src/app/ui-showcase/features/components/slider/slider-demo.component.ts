import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from '../../../../shared/components/ui/slider/slider.component';

@Component({
  selector: 'app-slider-demo',
  standalone: true,
  imports: [CommonModule, SliderComponent, FormsModule],
  templateUrl: './slider-demo.component.html',
  styleUrls: ['./slider-demo.component.css'],
})
export class SliderDemoComponent {
  v1 = 25;
  // Control A starts at min (0) and Control B starts at max (100)
  v2 = 0;
  v3 = 100;
  vPercent = 40;
  vCurrency = 1200;
  vStep5 = 10;
  vStepDecimal = 2.5;
  // Range examples (se integran en el mismo demo)
  range1Lower = 10;
  range1Upper = 70;
  range2Lower = 2000;
  range2Upper = 6000;
  range3Lower = 1.5;
  range3Upper = 4.5;

  // Formateo simple consistente: miles='.' y decimales=','
  private formatNumber(n: number, decimals = 0): string {
    const isNegative = n < 0;
    const abs = Math.abs(n);
    const fixed = decimals > 0 ? abs.toFixed(decimals) : String(Math.trunc(abs));
    const parts = fixed.split('.');
    const intRaw = parts[0];
    const fracRaw = parts[1] || '';
    const intWithSep = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const sign = isNegative ? '-' : '';
    if (fracRaw.length > 0) {
      return sign + intWithSep + ',' + fracRaw;
    }
    return sign + intWithSep;
  }

  display(v: number, prefix = '', suffix = '', step = 1): string {
    const decimals = String(step).includes('.') ? String(step).split('.')[1].length : 0;
    return prefix + this.formatNumber(v, decimals) + suffix;
  }
}
