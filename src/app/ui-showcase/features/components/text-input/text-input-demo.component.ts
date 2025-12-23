import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../../../../shared/components/ui/text-input/text-input.component';

@Component({
  selector: 'app-text-input-demo',
  standalone: true,
  imports: [CommonModule, TextInputComponent],
  templateUrl: './text-input-demo.component.html',
  styleUrls: ['./text-input-demo.component.css'],
})
export class TextInputDemoComponent {
  value = '';
  error?: string;

  showError() {
    this.error = 'Este es un error personalizado.';
  }

  clear() {
    this.value = '';
    this.error = undefined;
  }
}
