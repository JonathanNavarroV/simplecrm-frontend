import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  @Input() tabs: { label: string; content: string; icon?: string; badge?: number | string }[] = [];

  selected = 0;

  @ViewChild('nav', { static: true }) nav!: ElementRef<HTMLElement>;

  canScrollLeft = false;
  canScrollRight = false;
  private scrollAmount = 150;
  private resizeObserver: ResizeObserver | null = null;
  // Referencia estable para añadir/remover listeners correctamente
  private boundUpdate = () => this.updateScrollButtons();

  constructor(private cd: ChangeDetectorRef) {}

  select(index: number) {
    this.selected = index;
  }

  get active() {
    return this.tabs[this.selected];
  }

  ngAfterViewInit(): void {
    // Ejecutar la actualización en la siguiente microtarea para evitar
    // ExpressionChangedAfterItHasBeenCheckedError en modo dev.
    Promise.resolve().then(() => {
      this.updateScrollButtons();
      this.cd.detectChanges();
    });

    this.nav.nativeElement.addEventListener('scroll', this.boundUpdate, {
      passive: true,
    });

    this.resizeObserver = new ResizeObserver(this.boundUpdate);
    this.resizeObserver.observe(this.nav.nativeElement);

    window.addEventListener('resize', this.boundUpdate);
  }

  ngOnDestroy(): void {
    try {
      this.nav.nativeElement.removeEventListener('scroll', this.boundUpdate);
    } catch {}
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    try {
      window.removeEventListener('resize', this.boundUpdate);
    } catch {}
  }

  updateScrollButtons(): void {
    const el = this.nav?.nativeElement;
    if (!el) return;
    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = el.scrollWidth > el.clientWidth + el.scrollLeft + 1;
  }

  scrollLeft(): void {
    const el = this.nav?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: -this.scrollAmount, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  scrollRight(): void {
    const el = this.nav?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: this.scrollAmount, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 300);
  }
}
