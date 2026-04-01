import { Component, inject, input, computed } from '@angular/core';
import { DatePipe, CurrencyPipe, NgClass, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ContractService } from './service/contract.service';
import { Contract } from './contract';

@Component({
  selector: 'app-contract-details',
  standalone: true,
  imports: [NgClass, DatePipe, CurrencyPipe],
  template: `
    @if (contract(); as data) {
    <div class="row g-4 fade-in">
      <div class="col-12 mb-2 d-flex justify-content-between align-items-center d-print-none">
        <button class="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold shadow" (click)="goBack()">
          <i class="bi bi-arrow-left me-2"></i>Wróć do listy umów
        </button>
        <button class="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow" (click)="printContract()">
          <i class="bi bi-printer me-2"></i>Drukuj umowę
        </button>
      </div>

      <div class="col-12 mt-0">
        <div class="card shadow border-0 rounded-4 overflow-hidden">
          <div class="bg-primary pt-5 pb-3 px-sm-5 px-4 position-relative">
            <h1 class="text-white fw-bold mb-0 position-relative z-1">{{ data.firstName }} {{ data.lastName }}</h1>
            <p class="text-white-50 fs-5 mt-1 mb-2 position-relative z-1">Podpisana umowa z pracownikiem</p>
            <i class="bi bi-person-circle position-absolute text-white opacity-25" style="font-size: 8rem; right: 2rem; top: -1rem;"></i>
          </div>
          <div class="card-body p-sm-5 p-4 bg-light">
            <div class="row">
              <div class="col-md-4 mb-3 mb-md-0">
                <div class="text-muted text-uppercase fw-bold small">Data dodania</div>
                <div class="fs-5">{{ data.createdAt | date:'dd.MM.yyyy' }}</div>
              </div>
              <div class="col-md-4 mb-3 mb-md-0">
                <div class="text-muted text-uppercase fw-bold small">Rodzaj umowy</div>
                <div class="fs-5">
                  <span class="badge" [ngClass]="getBadgeClass(data.contractType)">
                    {{ getTypeName(data.contractType) }}
                  </span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-muted text-uppercase fw-bold small">Stawka brutto</div>
                <div class="fs-4 fw-bold text-success">{{ data.rate | currency:'PLN':'symbol':'1.2-2' }}</div>
              </div>
              <div class="col-12 mt-4 pt-3 border-top">
                <div class="row">
                  <div class="col-md-4 mb-3 mb-md-0">
                    <div class="text-muted text-uppercase fw-bold small">Stanowisko</div>
                    <div class="fs-5">{{ data.position }}</div>
                  </div>
                  <div class="col-md-4 mb-3 mb-md-0">
                    <div class="text-muted text-uppercase fw-bold small">Dodatek funkcyjny</div>
                    <div class="fs-5">{{ data.functionalAllowance | currency:'PLN':'symbol':'1.2-2' }}</div>
                  </div>
                  <div class="col-md-4">
                    <div class="text-muted text-uppercase fw-bold small">Dodatek stażowy</div>
                    <div class="fs-5">{{ data.seniorityAllowance }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow border-0 rounded-4 h-100">
          <div class="card-body p-sm-5 p-4">
            <h4 class="fw-bold text-secondary mb-4 border-bottom pb-3"><i class="bi bi-person-vcard text-primary me-2"></i>Dane osobowe i adresowe</h4>
            
            <dl class="row">
              <dt class="col-sm-4 text-muted fw-semibold">PESEL</dt>
              <dd class="col-sm-8">{{ data.pesel }}</dd>
              
              <dt class="col-sm-4 text-muted fw-semibold mt-3 mt-sm-0">Data urodzenia</dt>
              <dd class="col-sm-8">{{ data.birthDate | date:'dd.MM.yyyy' }}</dd>
              
              <div class="col-12 my-2"><hr class="text-muted opacity-25"></div>

              <dt class="col-sm-4 text-muted fw-semibold text-truncate">Adres korespondencyjny</dt>
              <dd class="col-sm-8">
                ul. {{ data.street }} {{ data.houseNumber }} {{ data.apartmentNumber ? '/' + data.apartmentNumber : '' }}<br>
                {{ data.zipCode }} {{ data.city }}
              </dd>
              
              <div class="col-12 my-2"><hr class="text-muted opacity-25"></div>
            </dl>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow border-0 rounded-4 h-100">
          <div class="card-body p-sm-5 p-4">
            <h4 class="fw-bold text-secondary mb-4 border-bottom pb-3"><i class="bi bi-file-earmark-check text-success me-2"></i>Szczegóły kontraktu</h4>
            
            <dl class="row">
              <dt class="col-sm-5 text-muted fw-semibold">Data zawarcia</dt>
              <dd class="col-sm-7 fw-bold">{{ data.conclusionDate | date:'dd.MM.yyyy' }}</dd>

              <dt class="col-sm-5 text-muted fw-semibold mt-3 mt-sm-0">Wymiar etatu</dt>
              <dd class="col-sm-7">{{ data.workingTime }}</dd>

              <dt class="col-sm-5 text-muted fw-semibold mt-3 mt-sm-0">Miejsce pracy</dt>
              <dd class="col-sm-7">{{ data.workplace }}</dd>

              <div class="col-12 my-2"><hr class="text-muted opacity-25"></div>

              <dt class="col-sm-5 text-muted fw-semibold mt-3 mt-sm-0">Data rozpoczęcia</dt>
              <dd class="col-sm-7 fw-bold">{{ data.startDate | date:'dd.MM.yyyy' }}</dd>
              
              <dt class="col-sm-5 text-muted fw-semibold mt-3 mt-sm-0">Data zakończenia</dt>
              <dd class="col-sm-7 fw-bold">{{ data.endDate | date:'dd.MM.yyyy' }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    } @else if (contract() === undefined) {
    <div class="card shadow border-0 rounded-4 p-5 text-center mt-5 fade-in">
      <i class="bi bi-search text-muted fs-1 mb-3"></i>
      <h3 class="fw-bold text-secondary">Nie znaleziono umowy</h3>
      <p class="text-muted">Umowa o podanym identyfikatorze nie istnieje w systemie.</p>
      <button class="btn btn-primary px-4 py-2 rounded-pill mt-3" (click)="goBack()">Powrót do listy</button>
    </div>
    }
  `,
  styles: [`
    .fade-in {
      animation: fadeIn 0.4s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media print {
      :host {
        display: block;
        width: 100%;
      }
      .card {
        border: none !important;
        box-shadow: none !important;
      }
      .bg-primary {
        background-color: var(--bs-primary) !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .bg-light {
        background-color: var(--bs-light) !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .badge {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `]
})
export class ContractDetailsComponent {
  private router = inject(Router);
  private contractService = inject(ContractService);
  private location = inject(Location);

  readonly id = input<string>();

  contract = computed(() => {
    const currentId = this.id();
    return currentId ? this.contractService.getContractById(currentId) : undefined;
  });

  goBack() {
    this.location.back();
  }

  printContract() {
    window.print();
  }

  getTypeName(type: string): string {
    const types: Record<string, string> = {
      'zlecenie': 'Zlecenie',
      'dzielo': 'O Dzieło',
      'czas_okreslony': 'Czas Określony',
      'czas_nieokreslony': 'Czas Nieokreślony',
      'zastepstwo': 'Zastępstwo',
      'kontrakt': 'Kontrakt'
    };
    return types[type] || type;
  }

  getBadgeClass(type: string): string {
    const classes: Record<string, string> = {
      'zlecenie': 'bg-info text-dark',
      'dzielo': 'bg-success',
      'czas_okreslony': 'bg-primary',
      'czas_nieokreslony': 'bg-secondary',
      'zastepstwo': 'bg-warning text-dark',
      'kontrakt': 'bg-danger'
    };
    return classes[type] || 'bg-light text-dark';
  }
}
