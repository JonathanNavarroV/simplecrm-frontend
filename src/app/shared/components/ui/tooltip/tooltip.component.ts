import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-tooltip',
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
})
export class TooltipComponent {
  @Input() text = '';
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';
  // Ancho máximo del tooltip (acepta valores CSS, por ejemplo '200px' o '12rem')
  @Input() maxWidth = '200px';

  // Estado controlado por eventos mouseenter/mouseleave del wrapper
  show = false;
  // id único para aria-describedby
  tooltipId = 'tooltip-' + Math.random().toString(36).slice(2, 9);

  // Eventos simples: mostrar/ocultar
  // bandera para permitir wrap cuando el contenido excede el maxWidth
  allowWrap = false;

  onEnter() {
    // medir sin mostrar el tooltip para evitar flicker
    this.allowWrap = this.shouldAllowWrap(this.text, this.maxWidth);
    this.show = true;
  }

  onLeave() {
    this.show = false;
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
}
