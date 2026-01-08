import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalButton } from './modal.component';

export interface ModalStackItem {
  title?: string;
  template?: TemplateRef<any>;
  buttons?: ModalButton[];
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class ModalStackService {
  private stack: ModalStackItem[] = [];
  private currentSubject = new BehaviorSubject<ModalStackItem | null>(null);
  private stackSubject = new BehaviorSubject<ModalStackItem[]>([]);

  readonly current$ = this.currentSubject.asObservable();
  readonly stack$ = this.stackSubject.asObservable();

  open(item: ModalStackItem) {
    this.stack.push(item);
    this.stackSubject.next([...this.stack]);
    this.currentSubject.next(item);
  }

  back() {
    this.stack.pop();
    const top = this.stack.length ? this.stack[this.stack.length - 1] : null;
    this.stackSubject.next([...this.stack]);
    this.currentSubject.next(top);
  }

  closeAll() {
    this.stack = [];
    this.stackSubject.next([]);
    this.currentSubject.next(null);
  }

  getStack() {
    return [...this.stack];
  }
}
