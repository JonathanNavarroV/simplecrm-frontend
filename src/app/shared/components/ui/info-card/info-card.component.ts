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
}
