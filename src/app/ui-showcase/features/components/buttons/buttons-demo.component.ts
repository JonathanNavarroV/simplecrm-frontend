import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-buttons-demo',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './buttons-demo.component.html',
  styleUrls: ['./buttons-demo.component.css'],
})
export class ButtonsDemoComponent {
  // Demo puro: sin acciones.
}
