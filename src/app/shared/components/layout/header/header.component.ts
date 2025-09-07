import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-header',
  imports: [IconComponent, CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  protected readonly breadcrumbService = inject(BreadcrumbService);
}
