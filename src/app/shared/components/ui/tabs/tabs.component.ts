import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { BadgeComponent } from '../badge/badge.component';

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

  select(index: number) {
    this.selected = index;
  }

  get active() {
    return this.tabs[this.selected];
  }

  ngAfterViewInit(): void {
    this.updateScrollButtons();

    this.nav.nativeElement.addEventListener('scroll', this.updateScrollButtons.bind(this), {
      passive: true,
    });

    this.resizeObserver = new ResizeObserver(() => this.updateScrollButtons());
    this.resizeObserver.observe(this.nav.nativeElement);

    window.addEventListener('resize', this.updateScrollButtons.bind(this));
  }

  ngOnDestroy(): void {
    try {
      this.nav.nativeElement.removeEventListener('scroll', this.updateScrollButtons.bind(this));
    } catch {}
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    try {
      window.removeEventListener('resize', this.updateScrollButtons.bind(this));
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
