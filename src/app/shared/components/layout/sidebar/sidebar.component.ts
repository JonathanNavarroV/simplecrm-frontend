import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

interface SidebarSection {
  id: string;
  label: string;
  items: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  // Estructura: lista de secciones, cada una con su lista de items.
  sidebarItems: SidebarSection[] = [
    {
      id: 'main-section',
      label: 'Principal',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'home',
          route: '/',
        },
      ],
    },
    {
      id: 'crm-section',
      label: 'CRM',
      items: [
        {
          id: 'crm-clients',
          label: 'Clientes',
          icon: 'person',
          route: '/crm/clients',
        },
        {
          id: 'crm-opportunities',
          label: 'Oportunidades',
          icon: 'trending_up',
          route: '/crm/opportunities',
        },
        {
          id: 'crm-contacts',
          label: 'Contactos',
          icon: 'contacts',
          route: '/crm/contacts',
        },
      ],
    },
    {
      id: 'users-section',
      label: 'Usuarios',
      items: [
        {
          id: 'users-list',
          label: 'Usuarios',
          icon: 'person',
          route: '/users',
        },
        {
          id: 'users-permissions',
          label: 'Permisos',
          icon: 'shield',
          route: '/users/permissions',
        },
        {
          id: 'users-roles',
          label: 'Roles',
          icon: 'groups',
          route: '/users/roles',
        },
      ],
    },
  ];
}
