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
  username: string = '';

  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit() {
    this.authService.checkSession().subscribe((session) => {
      if (session.isActive) {
        console.log('User already logged in. Redirecting to dashboard.');
        this.authService.isLoggedIn = true;
        this.authService.getUserInfo(session.session?.username).subscribe((userInfo) => {
          console.log('User info:', userInfo);
          this.username = userInfo?.username || '';
        })
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
