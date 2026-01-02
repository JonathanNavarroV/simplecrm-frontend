import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  NgZone,
  OnDestroy,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-tooltip',
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TooltipComponent implements OnDestroy, AfterViewInit {
  @Input() text = '';
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';
  // Ancho máximo del tooltip (acepta valores CSS, por ejemplo '200px' o '12rem')
  @Input() maxWidth = '250px';

  // Estado controlado por eventos mouseenter/mouseleave del wrapper
  // (se mantiene por retrocompatibilidad con el template)
  show = false;
  // id único para aria-describedby
  tooltipId = 'tooltip-' + Math.random().toString(36).slice(2, 9);

  // Eventos simples: mostrar/ocultar
  // bandera para permitir wrap cuando el contenido excede el maxWidth
  allowWrap = false;

  // Elemento portal creado en el body
  private tooltipEl?: HTMLElement;
  private repositionHandler = () => this.positionTooltip();
  private _unlistenEnter?: () => void;
  private _unlistenLeave?: () => void;
  private _triggerEl?: HTMLElement;

  constructor(
    private host: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    // attach listeners to the first child (trigger) so that wrapping with
    // display:contents on host doesn't break hover detection
    this.attachTriggerListeners();
  }

  private attachTriggerListeners() {
    try {
      const hostEl = this.host.nativeElement as HTMLElement;
      const trigger = (hostEl.firstElementChild as HTMLElement | null) || hostEl;
      this._triggerEl = trigger as HTMLElement;
      this._unlistenEnter = this.renderer.listen(trigger, 'mouseenter', () => this.onEnter());
      this._unlistenLeave = this.renderer.listen(trigger, 'mouseleave', () => this.onLeave());
    } catch (e) {
      // ignore
    }
  }

  onEnter() {
    // medir sin mostrar el tooltip para evitar flicker
    this.allowWrap = this.shouldAllowWrap(this.text, this.maxWidth);
    this.createTooltip();
  }

  onLeave() {
    this.destroyTooltip();
  }

  ngOnDestroy(): void {
    this.destroyTooltip(true);
    this._unlistenEnter?.();
    this._unlistenLeave?.();
  }

  private shouldAllowWrap(text: string, maxWidth: string): boolean {
    try {
      const el = document.createElement('span');
      // aplicar clases similares para aproximar el render (tailwind clases)
      el.className = 'tooltip whitespace-nowrap px-3 py-1 text-sm leading-4';
      el.style.position = 'absolute';
      el.style.visibility = 'hidden';
      el.style.maxWidth = typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`;
      el.textContent = text;
      document.body.appendChild(el);
      const isOverflowing = el.scrollWidth > el.clientWidth + 1;
      document.body.removeChild(el);
      return isOverflowing;
    } catch (e) {
      return false;
    }
  }

  private createTooltip() {
    if (this.tooltipEl) return;
    this.tooltipEl = this.renderer.createElement('div');
    // Aplicar utilidades de Tailwind donde sea posible y mantener la clase
    // `tooltip` para selectores CSS que controlan la flecha/posición.
    const classes = [
      'tooltip',
      this.position,
      'bg-gray-700',
      'text-white',
      'px-3',
      'py-1',
      'rounded',
      'text-sm',
      'leading-4',
      'shadow',
      'pointer-events-none',
    ].join(' ');
    this.renderer.setAttribute(this.tooltipEl, 'class', classes);
    this.renderer.setAttribute(this.tooltipEl, 'role', 'tooltip');
    this.renderer.setAttribute(this.tooltipEl, 'id', this.tooltipId);
    this.renderer.setStyle(this.tooltipEl, 'max-width', this.maxWidth);
    this.renderer.setStyle(this.tooltipEl, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipEl, 'z-index', '9999');
    // crear contenido interno y flecha como elementos separados (más confiable que ::after)
    const inner = this.renderer.createElement('div');
    this.renderer.addClass(inner, 'tooltip-inner');
    // El contenido hereda color/estilos desde las utilidades aplicadas al tooltip
    this.renderer.setProperty(inner, 'textContent', this.text);
    const arrow = this.renderer.createElement('div');
    this.renderer.addClass(arrow, 'tooltip-arrow');
    this.renderer.appendChild(this.tooltipEl, inner);
    this.renderer.appendChild(this.tooltipEl, arrow);

    this.ngZone.runOutsideAngular(() => {
      document.body.appendChild(this.tooltipEl as HTMLElement);
      window.addEventListener('scroll', this.repositionHandler, true);
      window.addEventListener('resize', this.repositionHandler);
      requestAnimationFrame(() => {
        this.renderer.addClass(this.tooltipEl!, 'show');
        // recalcular posición después de aplicar la clase show (y estilos)
        this.positionTooltip();
      });
    });
  }

  private destroyTooltip(force = false) {
    if (!this.tooltipEl) return;
    this.renderer.removeClass(this.tooltipEl, 'show');
    window.removeEventListener('scroll', this.repositionHandler, true);
    window.removeEventListener('resize', this.repositionHandler);
    if (force) {
      if (this.tooltipEl.parentNode) this.tooltipEl.parentNode.removeChild(this.tooltipEl);
      this.tooltipEl = undefined;
      return;
    }
    setTimeout(() => {
      if (this.tooltipEl && this.tooltipEl.parentNode) {
        this.tooltipEl.parentNode.removeChild(this.tooltipEl);
      }
      this.tooltipEl = undefined;
    }, 120);
  }

  private positionTooltip() {
    if (!this.tooltipEl) return;
    const sourceEl = this._triggerEl ? this._triggerEl : this.host.nativeElement;
    const hostRect = (sourceEl as HTMLElement).getBoundingClientRect();
    const tipRect = this.tooltipEl.getBoundingClientRect();
    // leer altura de la flecha definida en CSS para sincronizar el gap
    let gap = 8;
    try {
      const cs = getComputedStyle(this.tooltipEl as Element);
      const arrowVal = cs.getPropertyValue('--arrow-size');
      if (arrowVal) {
        const n = parseFloat(arrowVal.replace('px', '').trim());
        if (!Number.isNaN(n)) gap = n;
      }
    } catch (e) {
      gap = 8;
    }

    let top = 0;
    let left = 0;

    switch (this.position) {
      case 'top':
        top = hostRect.top - tipRect.height - gap;
        left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + gap;
        left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;
        break;
      case 'left':
        top = hostRect.top + hostRect.height / 2 - tipRect.height / 2;
        left = hostRect.left - tipRect.width - gap;
        break;
      case 'right':
        top = hostRect.top + hostRect.height / 2 - tipRect.height / 2;
        left = hostRect.right + gap;
        break;
    }

    const winW = window.innerWidth;
    const winH = window.innerHeight;
    left = Math.max(8, Math.min(left, winW - tipRect.width - 8));
    top = Math.max(8, Math.min(top, winH - tipRect.height - 8));

    this.renderer.setStyle(this.tooltipEl, 'left', `${Math.round(left)}px`);
    this.renderer.setStyle(this.tooltipEl, 'top', `${Math.round(top)}px`);
  }
}
