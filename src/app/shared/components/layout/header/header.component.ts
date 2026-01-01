import { Component, inject } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import { AuthService } from '../../../../core/services/auth.service';
import { IconComponent } from '../../ui/icon/icon.component';
import { BreadcrumbsComponent } from '../header-controls/breadcrumbs/breadcrumbs.component';
import { NotificationsMenuComponent } from '../header-controls/notifications-menu/notifications-menu.component';

import { ProfileMenuItem } from '../header-controls/profile-menu/profile-menu.component';
import { ProfileMenuComponent } from '../header-controls/profile-menu/profile-menu.component';

@Component({
  selector: 'app-header',
  imports: [IconComponent, BreadcrumbsComponent, NotificationsMenuComponent, ProfileMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly sidebarService = inject(SidebarService);

  profileItems: ProfileMenuItem[] = [
    { label: 'Perfil', routerLink: '/profile' },
    { label: 'Configuración', routerLink: '/settings' },
    { label: 'Cerrar sesión', action: () => this.authService.logout() },
  ];

  openSidebarXs() {
    this.sidebarService.requestOpenOverlay();
  }
}
