import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RangeSliderComponent } from '../../../../shared/components/ui/range-slider/range-slider.component';

@Component({
  selector: 'app-range-slider-demo',
  standalone: true,
  imports: [CommonModule, RangeSliderComponent],
  templateUrl: './range-slider-demo.component.html',
  styleUrls: ['./range-slider-demo.component.css'],
})
export class RangeSliderDemoComponent {
  rangeA = { lower: 10, upper: 70 };
  rangeB = { lower: 2000, upper: 6000 };
  rangeC = { lower: 1.5, upper: 4.5 };

  onRangeAChange(range: { lower: number; upper: number }) {
    this.rangeA = { ...range };
  }

  onRangeBChange(range: { lower: number; upper: number }) {
    this.rangeB = { ...range };
  }

  onRangeCChange(range: { lower: number; upper: number }) {
    this.rangeC = { ...range };
  }
}
