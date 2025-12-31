import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './badge-demo.component.html',
  styleUrls: ['./badge-demo.component.css'],
})
export class BadgeDemoComponent {
  tags: {
    id: number;
    label: string;
    variant: 'default' | 'primary' | 'success' | 'danger' | 'warning';
    dot?: boolean;
    pill?: boolean;
    size?: 'sm' | 'md';
    iconName?: string;
  }[] = [
    { id: 1, label: 'Frontend', variant: 'primary', size: 'sm', pill: true },
    { id: 2, label: 'API', variant: 'success', dot: true },
    { id: 3, label: 'DB', variant: 'warning', pill: true, iconName: 'check' },
    { id: 4, label: 'Legacy', variant: 'danger' },
  ];

  onRemove(id: string | number | null) {
    this.tags = this.tags.filter((t) => t.id !== id);
  }
}
