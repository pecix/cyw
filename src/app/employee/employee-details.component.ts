import { Component, inject, input, computed } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from './service/employee.service';
import { ContractService } from '../contract/service/contract.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  template: `
    @if (employee(); as data) {
    <div class="row g-4 fade-in">
      <div class="col-12 mb-2">
        <button class="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold shadow-sm" (click)="goBack()">
          <i class="bi bi-arrow-left me-2"></i>Wróć do listy pracowników
        </button>
      </div>

      <!-- Employee Header -->
      <div class="col-12 mt-0">
        <div class="card shadow border-0 rounded-4 overflow-hidden">
          <div class="bg-primary pt-5 pb-3 px-sm-5 px-4 position-relative">
            <h1 class="text-white fw-bold mb-0 position-relative z-1">{{ data.firstName }} {{ data.lastName }}</h1>
            <p class="text-white-50 fs-5 mt-1 mb-2 position-relative z-1">Profil pracownika</p>
            <i class="bi bi-person-vcard position-absolute text-white opacity-25" style="font-size: 8rem; right: 2rem; top: -1rem;"></i>
          </div>
          <div class="card-body p-sm-5 p-4 bg-light">
            <div class="row g-4">
              <div class="col-md-3 col-sm-6">
                <div class="text-muted text-uppercase fw-bold small mb-1">PESEL</div>
                <div class="font-monospace fs-5 text-dark">{{ data.pesel }}</div>
              </div>
              <div class="col-md-3 col-sm-6">
                <div class="text-muted text-uppercase fw-bold small mb-1">Data urodzenia</div>
                <div class="fs-5 text-dark">{{ data.birthDate | date:'dd.MM.yyyy' }}</div>
              </div>
              <div class="col-md-6 col-sm-12">
                <div class="text-muted text-uppercase fw-bold small mb-1">Adres korespondencyjny</div>
                <div class="fs-6 text-dark">
                  ul. {{ data.street }} {{ data.houseNumber }}{{ data.apartmentNumber ? '/' + data.apartmentNumber : '' }}, 
                  {{ data.zipCode }} {{ data.city }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contracts List -->
      <div class="col-12">
        <div class="card shadow border-0 rounded-4 h-100">
          <div class="card-body p-sm-5 p-4">
            <h4 class="fw-bold text-secondary mb-4 border-bottom pb-3"><i class="bi bi-file-earmark-text text-primary me-2"></i>Związane umowy</h4>
            
            <div class="list-group list-group-flush">
              @for (contract of employeeContracts(); track contract.id) {
                <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 border-0 rounded-3 mb-2 shadow-sm bg-light" (click)="viewContract(contract.id)">
                  <div>
                    <div class="fw-bold mb-1">{{ contract.position }}</div>
                    <small class="text-muted">
                      Od {{ contract.startDate | date:'dd.MM.yyyy' }} do {{ contract.endDate | date:'dd.MM.yyyy' }} 
                      &bull; Stawka: <span class="fw-semibold text-success">{{ contract.rate | currency:'PLN':'symbol':'1.2-2' }}</span>
                    </small>
                  </div>
                  <i class="bi bi-chevron-right text-muted"></i>
                </button>
              } @empty {
                <div class="text-center py-4 text-muted">
                  <i class="bi bi-folder-x fs-2 d-block mb-2"></i>
                  Brak powiązanych umów z tym pracownikiem.
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    } @else {
    <div class="card shadow border-0 rounded-4 p-5 text-center mt-5 fade-in">
      <i class="bi bi-search text-muted fs-1 mb-3"></i>
      <h3 class="fw-bold text-secondary">Nie znaleziono pracownika</h3>
      <p class="text-muted">Pracownik o podanym numerze PESEL nie istnieje w bazie danych.</p>
      <button class="btn btn-primary px-4 py-2 rounded-pill mt-3" (click)="goBack()">Powrót do widoku głównego</button>
    </div>
    }
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .list-group-item-action:hover {
      transform: translateX(5px);
      transition: transform 0.2s ease;
      background-color: #f8f9fa !important;
    }
  `]
})
export class EmployeeDetailsComponent {
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private contractService = inject(ContractService);

  readonly pesel = input<string>();

  employee = computed(() => {
    const currentPesel = this.pesel();
    return currentPesel ? this.employeeService.getEmployeeByPesel(currentPesel) : undefined;
  });

  employeeContracts = computed(() => {
    const currentPesel = this.pesel();
    if (!currentPesel) return [];
    return this.contractService.contracts().filter(c => c.pesel === currentPesel);
  });

  goBack() {
    this.router.navigate(['/pracownicy']);
  }

  viewContract(id: string) {
    this.router.navigate(['/umowy', id]);
  }
}
