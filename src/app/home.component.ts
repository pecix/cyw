import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="row align-items-center py-5">
      <div class="col-md-6 mb-5 mb-md-0 fade-in-left">
        <h1 class="display-4 fw-bold text-dark mb-4">Portal Obsługi Pracowników Cywilnych</h1>
        <p class="lead text-secondary mb-5">
          Zarządzaj umowami zlecenie oraz umowami o dzieło w sposób zautomatyzowany. Nasz system powoli Ci sprawnie generować i procesować dokumenty krok po kroku.
        </p>
        <a routerLink="/nowa-umowa" class="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm fw-bold">
          Spisz nową umowę <i class="bi bi-arrow-right-circle ms-2"></i>
        </a>
      </div>
      <div class="col-md-6 text-center fade-in-right">
        <img src="assets/hero.png" alt="Contract Management" class="img-fluid rounded-4 shadow-lg border p-5 opacity-75" style="max-height: 450px; object-fit: cover;">
      </div>
    </div>
  `,
  styles: [`
    .fade-in-left {
      animation: fadeInLeft 0.6s ease-out;
    }
    .fade-in-right {
      animation: fadeInRight 0.6s ease-out;
    }
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class HomeComponent { }
