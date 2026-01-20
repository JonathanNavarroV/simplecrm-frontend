import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../../../shared/components/ui/paginator/paginator.component';

@Component({
  standalone: true,
  selector: 'app-paginator-demo',
  imports: [CommonModule, PaginatorComponent],
  templateUrl: './paginator-demo.component.html',
  styleUrls: ['./paginator-demo.component.css'],
})
export class PaginatorDemoComponent {
  // ejemplo simple con handlers
  page = 1;
  pageSize = 10;
  total = 87;

  onPageChange(p: number) {
    this.page = p;
  }

  onPageSizeChange(s: number) {
    this.pageSize = typeof s === 'string' ? parseInt(s, 10) : s;
    this.page = 1;
  }

  // ejemplos con two-way binding
  page1 = 1;
  size1 = 10;
  total1 = 123;

  page2 = 1;
  size2 = 25;
  total2 = 500;
}
