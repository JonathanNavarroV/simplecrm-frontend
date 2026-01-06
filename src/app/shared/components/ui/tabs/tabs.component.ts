import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  @Input() tabs: { label: string; content: string; icon?: string }[] = [];

  selected = 0;

  select(index: number) {
    this.selected = index;
  }

  get active() {
    return this.tabs[this.selected];
  }
}
