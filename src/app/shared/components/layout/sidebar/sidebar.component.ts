import { CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { IconComponent } from '../../ui/icon/icon.component';
import { TooltipComponent } from '../../ui/tooltip/tooltip.component';
import { SidebarService } from '../services/sidebar.service';
import { SIDEBAR_ITEMS } from './sidebar-items';

// Tipo para los breakpoints que utiliza la máquina de estados del sidebar
// Nota: se eliminó 'lg' del cálculo para simplificar la lógica del sidebar.
type Breakpoint = 'xs' | 'sm' | 'md';
type SidebarMode = 'hidden' | 'slim' | 'overlay' | 'expanded';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent, TooltipComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  // Clave usada para persistir la preferencia del usuario en breakpoint md
  private readonly SESSION_KEY_MD_MODE = 'sidebar-md-mode';

  // Estado local: modo del sidebar (hidden/slim/overlay/expanded)
  currentMode: SidebarMode = 'slim';

  // Máquina de estados: breakpoints simplificados
  currentBreakpoint: Breakpoint = 'md';

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

      // Comportamiento explícito: si entramos en `sm` replegamos; si entramos
      // en `md` desplegamos. Para otros breakpoints se mantiene la semántica
      // mapeando collapsed/expanded del breakpoint anterior al nuevo.
      this.ngZone.run(() => {
        // Si entramos en xs siempre queremos ocultar el sidebar (comportamiento móvil)
        if (bp === 'xs') {
          this.currentMode = newCollapsed;
          return;
        }

        if (bp === 'sm') {
          this.currentMode = newCollapsed;
          return;
        }

        if (bp === 'md') {
          // Si tenemos una preferencia guardada para md, úsala; si no, usar el valor por defecto
          const persisted = this.readPersistedMdMode();
          this.currentMode = persisted ?? newExpanded;
          return;
        }

        // Fallback: mantener la semántica (collapsed/expanded) pero con el
        // modo correspondiente del nuevo breakpoint.
        if (this.currentMode === prevCollapsed) {
          this.currentMode = newCollapsed;
        } else if (this.currentMode === prevExpanded) {
          this.currentMode = newExpanded;
        } else if (this.isCollapsedMode(this.currentMode)) {
          this.currentMode = newCollapsed;
        } else {
          this.currentMode = newExpanded;
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
    // Inicializar modo acorde al breakpoint
    if (this.currentBreakpoint === 'md') {
      // Priorizar preferencia persistida en sessionStorage si existe
      const persisted = this.readPersistedMdMode();
      if (persisted) {
        this.currentMode = persisted;
      } else {
        this.currentMode = this.getExpandedModeForBreakpoint(this.currentBreakpoint);
      }
    } else {
      this.currentMode = this.getCollapsedModeForBreakpoint(this.currentBreakpoint);
    }
    // Escuchar resize fuera de Angular para reducir sobrecarga
    this.ngZone.runOutsideAngular(() => window.addEventListener('resize', this.onResize));

    // Suscribirse a solicitudes desde el header para abrir overlay en xs
    this._sidebarSub = this.sidebarService.openOverlay$.subscribe(() => {
      if (this.currentBreakpoint === 'xs') {
        this.ngZone.run(() => {
          this.currentMode = this.getExpandedModeForBreakpoint(this.currentBreakpoint);
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
    } else {
      this.currentMode = collapsed;
    }
    // Si estamos en md, persistir la preferencia del usuario
    if (this.currentBreakpoint === 'md') {
      this.persistMdMode();
    }
  }

  // Cierra cuando se pulsa el overlay
  closeOverlay() {
    const collapsed = this.getCollapsedModeForBreakpoint(this.currentBreakpoint);
    this.currentMode = collapsed;
  }

  // Cuando se hace click en un item de navegación, si estamos en overlay
  // entonces cerramos el sidebar (comportamiento móvil).
  onNavItemClick() {
    if (this.currentMode === 'overlay') {
      this.closeOverlay();
    }
  }

  /**
   * Mapeo simple de anchura a breakpoint (xs/sm/md).
   * - < 640 => xs
   * - 640 .. 767 => sm
   * - >= 768 => md
   */
  private getBreakpoint(width: number): Breakpoint {
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    return 'md';
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
    switch (bp) {
      case 'md':
        return 'expanded';
      case 'sm':
      case 'xs':
        return 'overlay';
    }
  }

  private isCollapsedMode(mode: SidebarMode) {
    return mode === 'hidden' || mode === 'slim';
  }

  // Estructura: lista de módulos, cada uno con su lista de items.
  sidebarItems = SIDEBAR_ITEMS;

  // Estado local: secciones desplegadas (por id de item)
  openSections: Record<string, boolean> = {};

  // Alterna la visibilidad de una sección con subitems
  toggleSection(id: string) {
    this.openSections[id] = !this.openSections[id];
  }

  isSectionOpen(id: string) {
    return !!this.openSections[id];
  }

  // Lee la preferencia guardada para md desde sessionStorage. Si no existe
  // devuelve null.
  private readPersistedMdMode(): SidebarMode | null {
    try {
      const v = sessionStorage.getItem(this.SESSION_KEY_MD_MODE);
      if (v === 'expanded' || v === 'slim') return v as SidebarMode;
      return null;
    } catch {
      return null;
    }
  }

  // Persiste la preferencia actual (solo tiene sentido en md)
  private persistMdMode() {
    try {
      if (this.currentBreakpoint === 'md') {
        // Solo persistimos modos 'expanded' o 'slim'
        if (this.currentMode === 'expanded' || this.currentMode === 'slim') {
          sessionStorage.setItem(this.SESSION_KEY_MD_MODE, this.currentMode);
        }
      }
    } catch {
      // ignorar errores de storage
    }
  }
}
