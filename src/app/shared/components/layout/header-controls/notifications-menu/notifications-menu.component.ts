import { Component } from '@angular/core';
import { IconComponent } from '../../../ui/icon/icon.component';
import { CloseOnInteractDirective } from '../../../../directives/close-on-interact.directive';

@Component({
  selector: 'app-notifications-menu',
  imports: [IconComponent, CloseOnInteractDirective],
  templateUrl: './notifications-menu.component.html',
  styleUrl: './notifications-menu.component.css',
})
export class NotificationsMenuComponent {
  open = false;
}
