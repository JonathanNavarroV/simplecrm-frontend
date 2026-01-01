import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService } from '../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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

// Tipo para los breakpoints que utiliza la máquina de estados del sidebar
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg';
type SidebarMode = 'hidden' | 'slim' | 'overlay' | 'expanded';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  // Estado local: modo del sidebar (hidden/slim/overlay/expanded)
  currentMode: SidebarMode = 'slim';

  // Máquina de estados: breakpoints simplificados
  currentBreakpoint: Breakpoint = 'lg';

  // Handler como propiedad para permitir add/removeEventListener
  private onResize = () => {
    const bp = this.getBreakpoint(window.innerWidth);
    if (bp !== this.currentBreakpoint) {
      const previous = this.currentBreakpoint;
      const prevCollapsed = this.getCollapsedModeForBreakpoint(previous);
      const prevExpanded = this.getExpandedModeForBreakpoint(previous);
      const newCollapsed = this.getCollapsedModeForBreakpoint(bp);
      const newExpanded = this.getExpandedModeForBreakpoint(bp);
      this.currentBreakpoint = bp;
      console.log(`Sidebar: cambio de breakpoint -> ${this.currentBreakpoint}`);

      // Comportamiento explícito: si entramos en `md` replegamos; si entramos
      // en `lg` desplegamos. Para otros breakpoints se mantiene la semántica
      // mapeando collapsed/expanded del breakpoint anterior al nuevo.
      this.ngZone.run(() => {
        if (bp === 'md') {
          this.currentMode = newCollapsed;
          console.log(`Sidebar: forzado replegado al entrar en md -> ${newCollapsed}`);
          return;
        }

        if (bp === 'lg') {
          this.currentMode = newExpanded;
          console.log(`Sidebar: forzado desplegado al entrar en lg -> ${newExpanded}`);
          return;
        }

        // Fallback: mantener la semántica (collapsed/expanded) pero con el
        // modo correspondiente del nuevo breakpoint.
        if (this.currentMode === prevCollapsed) {
          this.currentMode = newCollapsed;
          console.log(`Sidebar: map -> ${prevCollapsed} -> ${newCollapsed}`);
        } else if (this.currentMode === prevExpanded) {
          this.currentMode = newExpanded;
          console.log(`Sidebar: map -> ${prevExpanded} -> ${newExpanded}`);
        } else if (this.isCollapsedMode(this.currentMode)) {
          this.currentMode = newCollapsed;
          console.log(`Sidebar: map (collapsed fallback) -> ${newCollapsed}`);
        } else {
          this.currentMode = newExpanded;
          console.log(`Sidebar: map (expanded fallback) -> ${newExpanded}`);
        }
      });
    }
  };

  private _sidebarSub?: Subscription;

  constructor(
    private ngZone: NgZone,
    private sidebarService: SidebarService,
  ) {}

  ngOnInit(): void {
    // Detectar breakpoint inicial
    this.currentBreakpoint = this.getBreakpoint(window.innerWidth);
    // Inicializar modo acorde al breakpoint: por defecto collapsado en xs/md, expandido en lg
    if (this.currentBreakpoint === 'lg') {
      this.currentMode = this.getExpandedModeForBreakpoint(this.currentBreakpoint);
      console.log(`Sidebar: inicio -> modo inicial ${this.currentMode} (lg)`);
    } else {
      this.currentMode = this.getCollapsedModeForBreakpoint(this.currentBreakpoint);
      console.log(
        `Sidebar: inicio -> modo inicial ${this.currentMode} (${this.currentBreakpoint})`,
      );
    }
    // Escuchar resize fuera de Angular para reducir sobrecarga
    this.ngZone.runOutsideAngular(() => window.addEventListener('resize', this.onResize));

    // Suscribirse a solicitudes desde el header para abrir overlay en xs
    this._sidebarSub = this.sidebarService.openOverlay$.subscribe(() => {
      if (this.currentBreakpoint === 'xs') {
        this.ngZone.run(() => {
          this.currentMode = this.getExpandedModeForBreakpoint(this.currentBreakpoint);
          console.log('Sidebar: apertura solicitada desde header -> modo', this.currentMode);
        });
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this._sidebarSub?.unsubscribe();
  }

  // Alterna entre el modo replegado y desplegado según el breakpoint actual
  toggleSidebar() {
    const collapsed = this.getCollapsedModeForBreakpoint(this.currentBreakpoint);
    const expanded = this.getExpandedModeForBreakpoint(this.currentBreakpoint);
    if (this.isCollapsedMode(this.currentMode)) {
      this.currentMode = expanded;
      console.log(
        `Acción: toggle sidebar -> expandido (${expanded}). Breakpoint: ${this.currentBreakpoint}`,
      );
    } else {
      this.currentMode = collapsed;
      console.log(
        `Acción: toggle sidebar -> replegado (${collapsed}). Breakpoint: ${this.currentBreakpoint}`,
      );
    }
  }

  // Cierra cuando se pulsa el overlay
  closeOverlay() {
    const collapsed = this.getCollapsedModeForBreakpoint(this.currentBreakpoint);
    this.currentMode = collapsed;
    console.log(
      `Acción: overlay click -> replegado (${collapsed}). Breakpoint: ${this.currentBreakpoint}`,
    );
  }

  // Cuando se hace click en un item de navegación, si estamos en overlay
  // entonces cerramos el sidebar (comportamiento móvil).
  onNavItemClick() {
    if (this.currentMode === 'overlay') {
      this.closeOverlay();
      console.log('Sidebar: navegación -> cierre por modo overlay');
    }
  }

  /**
   * Mapeo simple de anchura a breakpoint (sm/md/lg).
   * - < 640 => xs
   * - 640 .. 767 => sm
   * - 768 .. 1023 => md
   * - >= 1024 => lg
   */
  private getBreakpoint(width: number): Breakpoint {
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    return 'lg';
  }

  private getCollapsedModeForBreakpoint(bp: Breakpoint): SidebarMode {
    if (bp === 'xs') return 'hidden';
    return 'slim';
  }

  // Getter público para usar en la plantilla y evitar llamadas directas a
  // métodos privados desde el template.
  get collapsedModeForCurrentBreakpoint(): SidebarMode {
    return this.getCollapsedModeForBreakpoint(this.currentBreakpoint);
  }

  private getExpandedModeForBreakpoint(bp: Breakpoint): SidebarMode {
    if (bp === 'lg') return 'expanded';
    return 'overlay';
  }

  private isCollapsedMode(mode: SidebarMode) {
    return mode === 'hidden' || mode === 'slim';
  }

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
}
