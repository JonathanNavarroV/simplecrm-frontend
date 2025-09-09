import { Component } from '@angular/core';
import { IconComponent } from '../../../ui/icon/icon.component';
import { CloseOnInteractDirective } from "../../../../directives/close-on-interact.directive";

@Component({
  selector: 'app-profile-menu',
  imports: [IconComponent, CloseOnInteractDirective],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css',
})
export class ProfileMenuComponent {
  open = false;

  logout() {
    // lógica de logout
  }
}
