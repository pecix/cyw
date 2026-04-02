import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-mock-login',
  standalone: true,
  template: `
    <div class="container mt-5 pt-5 fade-in">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5 text-center">
              <div class="mb-4 text-primary">
                <i class="bi bi-shield-lock" style="font-size: 3.5rem;"></i>
              </div>
              <h3 class="fw-bold mb-4 mb-2 text-dark">Logowanie</h3>
              <p class="text-muted mb-4">Wybierz rolę, z jaką chcesz pracować w aplikacji.</p>
              
              <div class="d-grid gap-3">
                <button class="btn btn-outline-primary btn-lg rounded-pill shadow-sm py-3 fw-semibold text-start px-4 d-flex align-items-center" (click)="loginAsEmployee()">
                  <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-primary fs-5"></i>
                  </div>
                  <div>
                    <div class="mb-0 lh-1">Pracownik</div>
                    <small class="text-muted fw-normal" style="font-size: 0.75rem;">Widok pojedynczego profilu pracownika</small>
                  </div>
                </button>
                
                <button class="btn btn-outline-secondary btn-lg rounded-pill shadow-sm py-3 fw-semibold text-start px-4 d-flex align-items-center" (click)="loginAsHr()">
                  <div class="bg-secondary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-briefcase text-secondary fs-5"></i>
                  </div>
                  <div>
                    <div class="mb-0 lh-1">Kadrowiec</div>
                    <small class="text-muted fw-normal" style="font-size: 0.75rem;">Dostęp do całego systemu wprowadzania</small>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .btn-outline-primary:hover .text-primary { color: white !important; }
    .btn-outline-secondary:hover .text-secondary { color: white !important; }
    .btn-outline-primary:hover .text-muted, .btn-outline-secondary:hover .text-muted { color: rgba(255,255,255,0.8) !important; }
  `]
})
export class MockLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  loginAsEmployee() {
    this.auth.login('EMPLOYEE');
    this.router.navigate(['/pracownicy', '80010112345']);
  }

  loginAsHr() {
    this.auth.login('HR');
    this.router.navigate(['/home']);
  }
}
