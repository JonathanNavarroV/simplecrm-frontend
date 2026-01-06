import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  @Input() tabs: { label: string; content: string; icon?: string; badge?: number | string }[] = [];
  @Input() truncateLabels = false;
  @Input() nowrap = false;

  selected = 0;

  select(index: number) {
    this.selected = index;
  }

  get active() {
    return this.tabs[this.selected];
  }
}
