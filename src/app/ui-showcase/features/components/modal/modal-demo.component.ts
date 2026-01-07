import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './modal-demo.component.html',
  styleUrls: ['./modal-demo.component.css'],
})
export class ModalDemoComponent {
  isOpen = signal<string | null>(null);
  lastConfirmed = false;

  open(type: string) {
    this.isOpen.set(type);
  }

  close() {
    this.isOpen.set(null);
  }

  onConfirm() {
    this.lastConfirmed = true;
    this.close();
  }
}
