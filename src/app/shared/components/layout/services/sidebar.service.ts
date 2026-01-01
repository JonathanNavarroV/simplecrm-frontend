import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private openOverlaySubject = new Subject<void>();
  readonly openOverlay$ = this.openOverlaySubject.asObservable();

  requestOpenOverlay() {
    this.openOverlaySubject.next();
  }
}
