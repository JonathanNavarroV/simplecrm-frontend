import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateInputComponent } from '../../../../shared/components/ui/date-input/date-input.component';

@Component({
  selector: 'app-date-input-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, DateInputComponent],
  templateUrl: './date-input-demo.component.html',
  styleUrls: ['./date-input-demo.component.css'],
})
export class DateInputDemoComponent {
  model: string | null = null;
  rangeModel: { start: string; end: string } | null = null;
  startModel: string | null = null;
  endModel: string | null = null;
  skeleton = false;

  getStartAnchoredDate(): Date | null {
    if (!this.endModel) return null;
    const [year, month, day] = this.endModel.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  getEndAnchoredDate(): Date | null {
    if (!this.startModel) return null;
    const [year, month, day] = this.startModel.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
