import { Component, inject } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly userService = inject(UserService);

  fetchUser(): void {
    this.userService.getUserByRun(19241027).subscribe({
      next: (user) => console.log('User recibido:', user),
      error: (err) => console.error('Error al obtener usuario:', err),
    });
  }
}
