import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cyw');
  protected readonly isMenuOpen = signal(false);
  protected readonly auth = inject(AuthService);
  private router = inject(Router);

  protected readonly showNavbarOptions = computed(() => {
    // If not mock, always show
    if (!environment.useMock) return true;
    // In mock, show only if HR
    return this.auth.userRole() === 'HR';
  });

  logoutMock() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
