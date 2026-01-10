import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberInputComponent } from '../../../../shared/components/ui/number-input/number-input.component';

@Component({
  selector: 'app-number-input-demo',
  standalone: true,
  imports: [CommonModule, NumberInputComponent],
  templateUrl: './number-input-demo.component.html',
  styleUrls: ['./number-input-demo.component.css'],
})
export class NumberInputDemoComponent {
  value: number | null | string = null;
  error?: string;
  loading = false;
  skeleton = false;

  showError() {
    this.error = 'Este es un error personalizado.';
  }

  clear() {
    this.value = null;
    this.error = undefined;
  }
}
