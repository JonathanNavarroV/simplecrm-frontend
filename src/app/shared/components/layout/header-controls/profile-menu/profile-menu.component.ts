import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CloseOnInteractDirective } from '../../../../directives/close-on-interact.directive';

export interface ProfileMenuItem {
  label: string;
  routerLink?: string;
  action?: () => void;
}

@Component({
  selector: 'app-profile-menu',
  imports: [CommonModule, CloseOnInteractDirective, RouterLink],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css',
})
export class ProfileMenuComponent {
  @Input() items: ProfileMenuItem[] = [];

  open = false;
}
