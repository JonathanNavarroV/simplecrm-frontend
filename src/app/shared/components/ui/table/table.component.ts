import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SimpleTableColumn<T = any> = {
  key: keyof T | string;
  label: string;
  width?: string; // tailwind width class or CSS value
  align?: 'left' | 'center' | 'right';
};

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent<T = any> {
  @Input() columns: SimpleTableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() striped = true;
  @Input() hover = true;
  @Input() compact = false;

  trackByIndex(index: number) {
    return index;
  }

  getCellValue(row: any, key: string | keyof any) {
    try {
      return row[key as any];
    } catch {
      return '';
    }
  }
}
