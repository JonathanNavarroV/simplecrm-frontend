import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() disabled = false;
  @Input() size: 'sm' | 'md' = 'md';
  @Input() iconPosition: 'left' | 'right' | 'center' = 'left';
  @Input() icon?: string;
  @Input() iconClass = 'h-4 w-4';
  @Input() ariaLabel?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  get classes(): string {
    const dir = this.iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row';
    const base = 'inline-flex items-center justify-center border';
    const spacingBase = this.size === 'sm' ? 'space-x-1' : 'space-x-2';
    const spacing =
      this.iconPosition === 'center'
        ? ''
        : spacingBase + (dir === 'flex-row-reverse' ? ' space-x-reverse' : '');
    const sizeCls = this.size === 'sm' ? 'px-2.5 py-1.5 text-sm' : 'px-4 py-2 text-sm';
    const disabledCls = this.disabled
      ? 'opacity-60 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    switch (this.variant) {
      case 'secondary':
        return `${base} ${dir} ${spacing} ${sizeCls} ${disabledCls} rounded border-gray-300 text-gray-700 bg-white hover:bg-gray-300 hover:text-gray-900`;
      case 'danger':
        return `${base} ${dir} ${spacing} ${sizeCls} ${disabledCls} rounded border-transparent bg-red-600 text-white hover:bg-red-800`;
      // 'link' variant removed: prefer using a plain <a href> for navigational links.
      case 'primary':
      default:
        return `${base} ${dir} ${spacing} ${sizeCls} ${disabledCls} rounded border-transparent bg-indigo-600 text-white hover:bg-indigo-800`;
    }
  }
}
