import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  @Input() tabs: { label: string; content: string }[] = [];

  selected = 0;

  select(index: number) {
    this.selected = index;
  }

  get active() {
    return this.tabs[this.selected];
  }
}
