import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent {
  @Input() page = 1;
  @Output() pageChange = new EventEmitter<number>();

  @Input() pageSize = 10;
  @Output() pageSizeChange = new EventEmitter<number>();

  @Input() total = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  go(page: number) {
    const p = Math.min(Math.max(1, page), this.totalPages);
    if (p === this.page) return;
    this.page = p;
    this.pageChange.emit(this.page);
  }

  prev() {
    this.go(this.page - 1);
  }

  next() {
    this.go(this.page + 1);
  }

  changePageSize(size: number | string) {
    const s = typeof size === 'string' ? parseInt(size, 10) : size;
    this.pageSize = s;
    this.pageSizeChange.emit(this.pageSize);
    if (this.page > this.totalPages) this.go(this.totalPages);
  }

  pageRange(): number[] {
    const pages = this.totalPages;
    const arr: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(pages, start + 4);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }
}
