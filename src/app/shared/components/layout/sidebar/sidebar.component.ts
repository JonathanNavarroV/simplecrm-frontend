import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { environment } from '../../../../../environments/environment';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

interface SidebarModule {
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
  // Estructura: lista de módulos, cada uno con su lista de items.
  sidebarItems: SidebarModule[] = [
    // Si la flag `uiShowcase` está activada mostramos únicamente módulos de ejemplo
    ...(environment.uiShowcase
      ? [
          {
            id: 'ui-components-module',
            label: 'Componentes',
            items: [
              {
                id: 'ui-text-input',
                label: 'Text Input',
                icon: 'edit',
                route: '/ui-showcase/components/text-input',
              },
              // aquí puedes añadir más componentes de muestra
            ],
          },
          {
            id: 'ui-forms-module',
            label: 'Formularios',
            items: [
              {
                id: 'ui-simple-form',
                label: 'Formulario simple',
                icon: 'sticky_note_2',
                route: '/ui-showcase/forms/simple',
              },
            ],
          },
        ]
      : [
          {
            id: 'main-module',
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
            id: 'crm-module',
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
            id: 'users-module',
            label: 'Usuarios',
            items: [
              {
                id: 'users-list',
                label: 'Usuarios',
                icon: 'person',
                route: '/users',
              },
              {
                id: 'users-roles',
                label: 'Roles',
                icon: 'groups',
                route: '/users/roles',
              },
            ],
          },
        ]),
  ];
}
