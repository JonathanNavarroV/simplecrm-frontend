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
  startModel: string | null = null;
  endModel: string | null = null;
  skeleton = false;

  private parseDate(value: string | null): Date | null {
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }

  getParsedStart(): Date | null {
    return this.parseDate(this.startModel);
  }

  getParsedEnd(): Date | null {
    return this.parseDate(this.endModel);
  }
}
