import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit() {
    this.authService.checkSession().subscribe((session) => {
      if (session) {
        console.log('User already logged in. Redirecting to dashboard.');
      } else {
        console.log('User not logged in. Redirecting to login.');
        this.router.navigate(['home']);
      }
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.authService.isLoggedIn = false;
      this.router.navigate(['']);
      console.log('User logged out successfully');
    } catch (error: any) {
      console.error('Logout failed:', error);
    }
  }
}
