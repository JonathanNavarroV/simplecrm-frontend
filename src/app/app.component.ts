import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { BreadcrumbService } from './core/layout/breadcrumb.service';
import { BreadcrumbItem } from './shared/components/layout/header-controls/breadcrumbs/breadcrumb-item.interface';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly activaterRoute = inject(ActivatedRoute);
  private readonly breadcrumbService = inject(BreadcrumbService);

  constructor() {
    this.router.events
      // Se filtra para que solo pasen eventos de tipo NavigationEnd
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        // Si el breadcrumb fue modificado manualmente, no se sobreescribe
        if (this.breadcrumbService.isManual()) return;

        // Se obtienen los items en base al árbol de rutas
        const items = this.build(this.activaterRoute.root);

        // Se llama al servicio para actualizar con los nuevos items y se indica que no fue un cambio manual
        this.breadcrumbService.set(items, false);
      });
  }

  /** Se construye recursivamente el breadcrumb a partir del árbol de rutas */
  private build(
    route: ActivatedRoute,
    url = '', // URL acumulada hasta ese punto
    acc: BreadcrumbItem[] = [] // Items acumulados
  ): BreadcrumbItem[] {
    // Se obtiene el primer hijo de la ruta actual
    const child = route.firstChild;

    // Si no hay más hijos se devuelve lo acumulado
    if (!child) return acc;

    // Se obtienen los segmentos de la URL de este hijo (con parámetros resueltos)
    const segs = child.snapshot.url.map((s) => s.path);

    // Se construye la URL completa sumando los segmentos actuales
    const nextUrl = segs.length ? `${url}/${segs.join('/')}` : url;

    // Se obtiene el label para el breadcrumb
    const dataCrumb = child.snapshot.data['breadcrumb'];
    let label: string | undefined;
    // Si en la data de la ruta hay un 'breadcrumb' definido como función, se ejecuta
    if (typeof dataCrumb === 'function') label = dataCrumb(child.snapshot);
    // Si es un string, se usa ese string
    else if (typeof dataCrumb === 'string') label = dataCrumb;
    // Si no hay data pero existen segmentos, se usan como texto
    else if (segs.length) label = segs.join(' ');

    // Es true si la ruta no tiene hijo
    const isLeaf = !child.firstChild;

    // Si se obtiene un label válido, se agrega un nuevo item al acumulador
    if (label)
      acc = [
        ...acc,
        {
          label,
          ...(isLeaf ? {} : { route: nextUrl || '/' }), // Si es la última, no se asigna 'route'
        },
      ];

    // Se llama recursivamente para seguir bajando por el árbol de rutas
    return this.build(child, nextUrl, acc);
  }
}
