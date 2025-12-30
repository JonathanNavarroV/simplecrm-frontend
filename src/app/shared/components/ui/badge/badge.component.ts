import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css'],
})
export class BadgeComponent {
  @Input() label?: string;
  @Input() variant: 'default' | 'primary' | 'success' | 'danger' | 'warning' = 'default';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() pill = false;
  @Input() iconName?: string;

  get classes(): string {
    const base = 'inline-flex items-center gap-2 font-medium select-none border border-gray-200';
    const rounded = this.pill ? 'rounded-full' : 'rounded';

    const sizeCls = this.size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

    const variantCls = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-indigo-100 text-indigo-700',
      success: 'bg-green-100 text-green-700',
      danger: 'bg-red-100 text-red-700',
      warning: 'bg-yellow-100 text-yellow-700',
    }[this.variant || 'default'];

    return [base, rounded, sizeCls, variantCls].join(' ');
  }
}
