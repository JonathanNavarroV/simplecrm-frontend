import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SliderComponent } from '../../../../shared/components/ui/slider/slider.component';

@Component({
  selector: 'app-slider-demo',
  standalone: true,
  imports: [CommonModule, SliderComponent],
  templateUrl: './slider-demo.component.html',
  styleUrls: ['./slider-demo.component.css'],
})
export class SliderDemoComponent {
  v1 = 25;
  v2 = 50;
  v3 = 75;
  vPercent = 40;
  vCurrency = 1200;
}
