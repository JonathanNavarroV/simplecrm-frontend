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
}
