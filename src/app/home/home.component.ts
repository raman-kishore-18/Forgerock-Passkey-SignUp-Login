import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.checkSession().subscribe((session) => {
      if (session) {
        console.log('User already logged in. Redirecting to dashboard.');
        this.router.navigate(['home']);
      } else {
        console.log('User not logged in. Redirecting to login.');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  goToSignUp() {
    this.router.navigate(['signup']);
  }
}
