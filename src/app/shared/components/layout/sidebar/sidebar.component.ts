import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarItem } from './sidebar-item.interface';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  sidebarItems: Array<SidebarItem> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home',
      route: '/',
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: 'person',
      route: '/',
    },
  ];
}
