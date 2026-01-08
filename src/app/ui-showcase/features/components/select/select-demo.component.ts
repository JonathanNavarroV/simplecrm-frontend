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
  // Estados independientes para cada demo para evitar compartir valores entre selects
  valueMain: string | string[] | null = null;
  valueIdName: string | string[] | null = null;
  valueMultipleCustom: string | string[] | null = null;
  // Estado para el select searchable (single)
  valueSearchSingle: string | string[] | null = null;
  // Estado para el select searchable (multiple)
  valueSearchMultiple: string | string[] | null = null;
  // Estado para el select de grupos (single)
  valueMainGroups: string | string[] | null = null;
  error?: string;

  options = [
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' },
    { value: '3', label: 'Opción 3' },
  ];

  // Demo con 10 elementos
  options10 = Array.from({ length: 10 }).map((_, i) => ({
    value: String(i + 1),
    label: `Elemento ${i + 1}`,
  }));

  // Ejemplo con claves `id` / `name`
  optionsIdName = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
    { id: 'g', name: 'Gamma' },
  ];

  // Ejemplo de secciones / grupos
  groupedOptions = [
    {
      label: 'Grupo A',
      options: [
        { value: 'a1', label: 'A - Uno' },
        { value: 'a2', label: 'A - Dos' },
      ],
    },
    {
      label: 'Grupo B',
      options: [
        { value: 'b1', label: 'B - Uno' },
        { value: 'b2', label: 'B - Dos' },
      ],
    },
  ];

  groupedMultipleValue: string | string[] | null = null;

  // valores para demo de 10 elementos
  valueTenDefault: string | string[] | null = null;
  valueTenSmall: string | string[] | null = null;
}
