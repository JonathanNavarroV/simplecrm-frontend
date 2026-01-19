import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InfoCardComponent } from '../../../../shared/components/ui/info-card/info-card.component';

@Component({
  selector: 'app-info-card-demo',
  standalone: true,
  imports: [CommonModule, InfoCardComponent],
  templateUrl: './info-card-demo.component.html',
  styleUrls: ['./info-card-demo.component.css'],
})
export class InfoCardDemoComponent {}
