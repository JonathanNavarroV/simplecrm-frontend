import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalComponent } from './modal.component';
import { ModalStackService, ModalStackItem } from './modal-stack.service';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <ng-container *ngIf="current$ | async as item">
      <app-modal
        [title]="item.title || ''"
        [buttons]="item.buttons"
        [showBack]="((stack$ | async)?.length || 0) > 1"
        (back)="modalStack.back()"
        (closed)="modalStack.back()"
        (action)="handleAction($event)"
      >
        <ng-container *ngIf="item.template">
          <ng-container
            *ngTemplateOutlet="item.template; context: { data: item.data }"
          ></ng-container>
        </ng-container>
      </app-modal>
    </ng-container>
  `,
})
export class ModalHostComponent {
  current$: Observable<ModalStackItem | null>;
  stack$: Observable<ModalStackItem[]>;

  constructor(public modalStack: ModalStackService) {
    this.current$ = this.modalStack.current$;
    this.stack$ = this.modalStack.stack$;
  }

  handleAction(ev: string) {
    console.log('ModalHost acción recibida:', ev);
    this.modalStack.back();
  }
}
