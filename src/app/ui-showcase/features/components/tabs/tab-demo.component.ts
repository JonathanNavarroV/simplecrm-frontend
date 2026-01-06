import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../../../../shared/components/ui/tabs/tabs.component';

@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  imports: [CommonModule, TabsComponent],
  templateUrl: './tab-demo.component.html',
  styleUrls: ['./tab-demo.component.css'],
})
export class TabDemoComponent {
  tabs = [
    {
      label: 'Perfil',
      content: 'Contenido del perfil: Nombre, correo y configuración.',
      icon: 'user',
    },
    {
      label: 'Actividad',
      content: 'Historial de actividad y últimos eventos.',
      icon: 'trending_up',
    },
    { label: 'Ajustes', content: 'Opciones de configuración y preferencias.', icon: 'settings' },
  ];
  tabsPlain = [
    { label: 'Perfil', content: 'Contenido del perfil: Nombre, correo y configuración.' },
    { label: 'Actividad', content: 'Historial de actividad y últimos eventos.' },
    { label: 'Ajustes', content: 'Opciones de configuración y preferencias.' },
  ];

  tabsWithIcons = [
    {
      label: 'Perfil',
      content: 'Contenido del perfil: Nombre, correo y configuración.',
      icon: 'user',
    },
    {
      label: 'Actividad',
      content: 'Historial de actividad y últimos eventos.',
      icon: 'trending_up',
    },
    { label: 'Ajustes', content: 'Opciones de configuración y preferencias.', icon: 'settings' },
  ];

  tabsWithBadges = [
    { label: 'Mensajes', content: 'Mensajes recientes', badge: 3 },
    { label: 'Notificaciones', content: 'Alertas del sistema', badge: 12 },
    { label: 'Tareas', content: 'Pendientes', badge: 0 },
  ];

  tabsPlainLong = Array.from({ length: 10 }).map((_, i) => ({
    label: `Item ${i + 1}`,
    content: `Contenido para Item ${i + 1}`,
  }));

  tabsWithIconsLong = Array.from({ length: 10 }).map((_, i) => ({
    label: `Item ${i + 1}`,
    content: `Contenido para Item ${i + 1}`,
    icon: ['user', 'trending_up', 'settings', 'grid', 'info'][i % 5],
  }));
}
