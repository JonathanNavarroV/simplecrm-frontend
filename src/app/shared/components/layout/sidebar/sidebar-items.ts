import { environment } from '../../../../../environments/environment';

export const SIDEBAR_ITEMS = [
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
              icon: 'grid',
              route: '/ui-showcase/components/text-input',
            },
            {
              id: 'ui-number-input',
              label: 'Number Input',
              icon: 'grid',
              route: '/ui-showcase/components/number-input',
            },
            {
              id: 'ui-buttons',
              label: 'Buttons',
              icon: 'grid',
              route: '/ui-showcase/components/buttons',
            },
            {
              id: 'ui-select',
              label: 'Select',
              icon: 'grid',
              route: '/ui-showcase/components/select',
            },
            {
              id: 'ui-badge',
              label: 'Badge',
              icon: 'grid',
              route: '/ui-showcase/components/badge',
            },
            {
              id: 'ui-tabs',
              label: 'Tabs',
              icon: 'grid',
              route: '/ui-showcase/components/tabs',
            },
            {
              id: 'ui-tooltip',
              label: 'Tooltip',
              icon: 'info',
              route: '/ui-showcase/components/tooltip',
            },
          ],
        },
        {
          id: 'ui-forms-module',
          label: 'Formularios',
          items: [
            {
              id: 'ui-simple-form',
              label: 'Formulario simple',
              icon: 'toggle-header-column',
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
              icon: 'user',
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
              icon: 'user',
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
