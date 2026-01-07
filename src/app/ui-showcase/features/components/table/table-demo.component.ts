import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { TooltipComponent } from '../../../../shared/components/ui/tooltip/tooltip.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import {
  SimpleTableColumn,
  TableComponent,
} from '../../../../shared/components/ui/table/table.component';

type UserRow = { id: number; name: string; email: string; role: string; active: boolean };

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [CommonModule, TableComponent, BadgeComponent, ButtonComponent, TooltipComponent],
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.css'],
})
export class TableDemoComponent implements OnInit {
  columns: SimpleTableColumn<UserRow>[] = [];
  columnsBadges: SimpleTableColumn<UserRow>[] = [];
  columnsActions: SimpleTableColumn<UserRow>[] = [];

  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

  rows: UserRow[] = [
    { id: 1, name: 'María López', email: 'maria@example.com', role: 'Admin', active: true },
    { id: 2, name: 'Carlos Pérez', email: 'carlos@example.com', role: 'Usuario', active: false },
    { id: 3, name: 'Ana Gómez', email: 'ana@example.com', role: 'Usuario', active: true },
    { id: 4, name: 'Luis Ramírez', email: 'luis@example.com', role: 'Manager', active: false },
  ];

  // Subconjunto de filas para centrarnos en la columna especial en demos
  rowsShort: UserRow[] = this.rows.slice(0, 2);

  // Usar las mismas filas (4 elementos) para la tabla de acciones
  rowsActions: UserRow[] = this.rows;

  ngOnInit(): void {
    // Definir columnas en ngOnInit usando statusTpl/actionsTpl (static: true)
    this.columns = [
      { key: 'id', label: 'ID', width: 'w-8', align: 'left' },
      { key: 'name', label: 'Nombre', width: 'w-24', align: 'left' },
      { key: 'email', label: 'Email', width: 'w-48', align: 'left' },
      { key: 'role', label: 'Rol', width: 'w-24', align: 'left' },
    ];

    // Columnas reducidas para demos específicos: enfocarse en la columna especial
    this.columnsBadges = [
      { key: 'name', label: 'Nombre', width: 'w-48', align: 'left' },
      { key: 'active', label: 'Estado', align: 'center', cellTemplate: this.statusTpl },
    ];

    this.columnsActions = [
      { key: 'name', label: 'Nombre', width: 'w-48', align: 'left' },
      { key: 'role', label: 'Rol', width: 'w-32', align: 'center' },
      { key: 'actions', label: 'Acciones', align: 'center', cellTemplate: this.actionsTpl },
    ];
  }

  onView(row: UserRow) {
    console.log('Ver', row);
  }

  onEdit(row: UserRow) {
    console.log('Editar', row);
  }

  onDelete(row: UserRow) {
    console.log('Eliminar', row);
  }
}
