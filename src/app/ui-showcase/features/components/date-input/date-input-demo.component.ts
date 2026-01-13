import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateInputComponent } from '../../../../shared/components/ui/date-input/date-input.component';

@Component({
  selector: 'app-date-input-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, DateInputComponent],
  templateUrl: './date-input-demo.component.html',
})
export class DateInputDemoComponent {
  model: string | null = null;
  skeleton = false;
}
