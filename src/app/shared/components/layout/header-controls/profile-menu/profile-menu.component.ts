import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CloseOnInteractDirective } from '../../../../directives/close-on-interact.directive';
import { IconComponent } from '../../../ui/icon/icon.component';
import { ProfileMenuItem } from './profile-menu-item.interface';

@Component({
  selector: 'app-profile-menu',
  imports: [IconComponent, CloseOnInteractDirective, RouterLink],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css',
})
export class ProfileMenuComponent {
  @Input() items: ProfileMenuItem[] = [];

  open = false;
}
