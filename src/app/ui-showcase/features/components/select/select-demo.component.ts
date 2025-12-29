import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../../../../shared/components/ui/select/select.component';

@Component({
  selector: 'app-select-demo',
  standalone: true,
  imports: [CommonModule, SelectComponent],
  templateUrl: './select-demo.component.html',
  styleUrls: ['./select-demo.component.css'],
})
export class SelectDemoComponent {
  value: string | string[] | null = null;
  valueMultiple: string | string[] | null = null;
  error?: string;

  options = [
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' },
    { value: '3', label: 'Opción 3' },
  ];

  // Ejemplo con claves `id` / `name`
  optionsIdName = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
    { id: 'g', name: 'Gamma' },
  ];
}
