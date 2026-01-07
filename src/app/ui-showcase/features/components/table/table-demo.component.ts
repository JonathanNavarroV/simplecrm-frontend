import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TableComponent,
  SimpleTableColumn,
} from '../../../../shared/components/ui/table/table.component';

type UserRow = { id: number; name: string; email: string; role: string };

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.css'],
})
export class TableDemoComponent {
  columns: SimpleTableColumn<UserRow>[] = [
    { key: 'id', label: 'ID', width: 'w-8', align: 'left' },
    { key: 'name', label: 'Nombre', width: 'w-48', align: 'left' },
    { key: 'email', label: 'Email', width: 'w-48', align: 'left' },
    { key: 'role', label: 'Rol', width: 'w-32', align: 'center' },
  ];

  rows: UserRow[] = [
    { id: 1, name: 'María López', email: 'maria@example.com', role: 'Admin' },
    { id: 2, name: 'Carlos Pérez', email: 'carlos@example.com', role: 'Usuario' },
    { id: 3, name: 'Ana Gómez', email: 'ana@example.com', role: 'Usuario' },
    { id: 4, name: 'Luis Ramírez', email: 'luis@example.com', role: 'Manager' },
  ];
}
