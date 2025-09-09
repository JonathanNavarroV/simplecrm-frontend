import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../../../core/layout/breadcrumb.service';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
})
export class BreadcrumbsComponent {
  protected readonly breadcrumbService = inject(BreadcrumbService);
}
