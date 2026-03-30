import { Component, inject } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ContractService } from './service/contract.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  template: `
    <div class="card shadow-lg border-0 rounded-4 fade-in">
      <div class="card-body p-sm-5 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold text-primary mb-0"><i class="bi bi-file-text me-2"></i>Zarejestrowane umowy</h2>
          <span class="badge bg-primary rounded-pill px-3 py-2 fs-6">{{ contracts().length }} łącznie</span>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th scope="col">Data dodania</th>
                <th scope="col">Wykonawca</th>
                <th scope="col">Rodzaj umowy</th>
                <th scope="col">Okres trwania</th>
                <th scope="col" class="text-end">Stawka brutto</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              @for (contract of contracts(); track contract.id) {
              <tr (click)="viewDetails(contract.id)" class="contract-row">
                <td class="text-muted"><small>{{ contract.createdAt | date:'dd.MM.yyyy' }}</small></td>
                <td>
                  <div class="fw-bold">{{ contract.firstName }} {{ contract.lastName }}</div>
                  <div class="text-muted small">PESEL: {{ contract.pesel }}</div>
                </td>
                <td>
                  <span class="badge" [class.bg-info]="contract.contractType === 'zlecenie'" [class.text-dark]="contract.contractType === 'zlecenie'" [class.bg-success]="contract.contractType !== 'zlecenie'">
                    {{ contract.contractType === 'zlecenie' ? 'Zlecenie' : 'O Dzieło' }}
                  </span>
                </td>
                <td>
                  <small>{{ contract.startDate | date:'dd.MM.yyyy' }} - {{ contract.endDate | date:'dd.MM.yyyy' }}</small>
                </td>
                <td class="text-end fw-bold text-success">
                  {{ contract.rate | currency:'PLN':'symbol':'1.2-2' }}
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary rounded-pill px-3" (click)="viewDetails(contract.id); $event.stopPropagation()">
                    Szczegóły
                  </button>
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                  Brak zarejestrowanych umów
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in {
      animation: fadeIn 0.4s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .table > :not(caption) > * > * {
      padding: 1rem 0.75rem;
    }
    .contract-row { 
      cursor: pointer; 
      transition: background-color 0.2s; 
    }
    .contract-row:hover { 
      background-color: var(--bs-light) !important; 
    }
  `]
})
export class ContractListComponent {
  private contractService = inject(ContractService);
  private router = inject(Router);

  contracts = this.contractService.contracts;

  viewDetails(id: string) {
    this.router.navigate(['/umowy', id]);
  }
}
