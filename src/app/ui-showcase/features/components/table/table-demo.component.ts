import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import {
  SimpleTableColumn,
  TableComponent,
} from '../../../../shared/components/ui/table/table.component';

type UserRow = { id: number; name: string; email: string; role: string; active: boolean };

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [CommonModule, TableComponent, BadgeComponent],
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.css'],
})
export class TableDemoComponent {
  columns: SimpleTableColumn<UserRow>[] = [];

  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;

  rows: UserRow[] = [
    { id: 1, name: 'María López', email: 'maria@example.com', role: 'Admin', active: true },
    { id: 2, name: 'Carlos Pérez', email: 'carlos@example.com', role: 'Usuario', active: false },
    { id: 3, name: 'Ana Gómez', email: 'ana@example.com', role: 'Usuario', active: true },
    { id: 4, name: 'Luis Ramírez', email: 'luis@example.com', role: 'Manager', active: false },
  ];

  ngOnInit(): void {
    // Definir columnas en ngOnInit usando statusTpl (static: true) para
    // evitar cambios de bindings después de la detección.
    this.columns = [
      { key: 'id', label: 'ID', width: 'w-8', align: 'left' },
      { key: 'name', label: 'Nombre', width: 'w-48', align: 'left' },
      { key: 'email', label: 'Email', width: 'w-48', align: 'left' },
      { key: 'role', label: 'Rol', width: 'w-32', align: 'left' },
      { key: 'active', label: 'Estado', align: 'center', cellTemplate: this.statusTpl },
    ];
  }
}
