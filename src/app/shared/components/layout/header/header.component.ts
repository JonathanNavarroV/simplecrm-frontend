import { Component } from '@angular/core';
import { IconComponent } from '../../ui/icon/icon.component';
import { BreadcrumbsComponent } from '../header-controls/breadcrumbs/breadcrumbs.component';
import { NotificationsMenuComponent } from '../header-controls/notifications-menu/notifications-menu.component';
import { ProfileMenuComponent } from '../header-controls/profile-menu/profile-menu.component';

@Component({
  selector: 'app-header',
  imports: [IconComponent, BreadcrumbsComponent, NotificationsMenuComponent, ProfileMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
