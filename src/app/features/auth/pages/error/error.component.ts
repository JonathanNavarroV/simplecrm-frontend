import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goLogin() {
    this.authService.login();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
