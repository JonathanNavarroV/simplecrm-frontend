import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from '../../../../shared/components/ui/tooltip/tooltip.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [CommonModule, TooltipComponent, ButtonComponent],
  templateUrl: './tooltip-demo.component.html',
  styleUrls: ['./tooltip-demo.component.css'],
})
export class TooltipDemoComponent {}
