import { Component, inject, input, computed, effect, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from './service/employee.service';
import { ContractService } from '../contract/service/contract.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeHistoryEntry } from './employee';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, ReactiveFormsModule],
  template: `
    @if (employee(); as data) {
    <div class="row g-4 fade-in">
      <div class="col-12 mb-2">
        @if (auth.userRole() !== 'EMPLOYEE') {
          <button class="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold shadow-sm" (click)="goBack()">
            <i class="bi bi-arrow-left me-2"></i>Wróć
          </button>
        }
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
              <div class="col-md-6 col-sm-12 mb-3">
                <div class="text-muted text-uppercase fw-bold small mb-2 d-flex justify-content-between align-items-center">
                  <span>Adres korespondencyjny</span>
                  @if (!isEditingAddress()) {
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1" (click)="toggleEditAddress()">
                      <i class="bi bi-pencil me-1"></i>Edytuj adres
                    </button>
                  }
                </div>
                
                @if (isEditingAddress()) {
                  <form [formGroup]="addressForm" class="mt-2 bg-white p-3 rounded-4 shadow-sm border border-primary border-opacity-25 fade-in">
                    <div class="row g-2">
                       <div class="col-md-8">
                         <input formControlName="street" class="form-control form-control-sm bg-light" placeholder="Ulica" [class.is-invalid]="addressForm.get('street')?.invalid && addressForm.get('street')?.touched">
                       </div>
                       <div class="col-md-2">
                         <input formControlName="houseNumber" class="form-control form-control-sm bg-light" placeholder="Nr" [class.is-invalid]="addressForm.get('houseNumber')?.invalid && addressForm.get('houseNumber')?.touched">
                       </div>
                       <div class="col-md-2">
                         <input formControlName="apartmentNumber" class="form-control form-control-sm bg-light" placeholder="Lok.">
                       </div>
                       <div class="col-md-4">
                         <input formControlName="zipCode" class="form-control form-control-sm bg-light" placeholder="Kod pocztowy" [class.is-invalid]="addressForm.get('zipCode')?.invalid && addressForm.get('zipCode')?.touched">
                       </div>
                       <div class="col-md-8">
                         <input formControlName="city" class="form-control form-control-sm bg-light" placeholder="Miejscowość" [class.is-invalid]="addressForm.get('city')?.invalid && addressForm.get('city')?.touched">
                       </div>
                       <div class="col-12 mt-3 d-flex gap-2 justify-content-end">
                         <button type="button" class="btn btn-sm btn-light rounded-pill px-3" (click)="toggleEditAddress()">Anuluj</button>
                         <button type="button" class="btn btn-sm btn-primary rounded-pill px-4 shadow-sm" (click)="saveAddress()" [disabled]="addressForm.invalid">
                            <i class="bi bi-save me-1"></i>Zapisz adres
                         </button>
                       </div>
                    </div>
                  </form>
                } @else {
                  <div class="fs-6 text-dark mt-1">
                    <i class="bi bi-geo-alt text-muted me-2"></i>ul. {{ data.street }} {{ data.houseNumber }}{{ data.apartmentNumber ? '/' + data.apartmentNumber : '' }}, 
                    {{ data.zipCode }} {{ data.city }}
                  </div>
                }

                <div class="text-muted text-uppercase fw-bold small mb-2 mt-4 d-flex justify-content-between align-items-center border-top pt-3">
                  <span>Konto bankowe</span>
                  @if (!isEditingBank()) {
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1" (click)="toggleEditBank()">
                      <i class="bi bi-pencil me-1"></i>Edytuj konto
                    </button>
                  }
                </div>

                @if (isEditingBank()) {
                  <form [formGroup]="bankForm" class="mt-2 bg-white p-3 rounded-4 shadow-sm border border-primary border-opacity-25 fade-in">
                    <div class="row g-2">
                       <div class="col-12">
                         <label class="form-label small fw-bold text-secondary mb-1">Numer konta <span class="fw-normal text-muted fst-italic">(opcjonalnie)</span></label>
                         <input formControlName="bankAccount" class="form-control form-control-sm bg-light font-monospace" maxlength="26" placeholder="Wpisz 26 cyfr bez spacji" [class.is-invalid]="bankForm.get('bankAccount')?.invalid && bankForm.get('bankAccount')?.touched">
                         @if (bankForm.get('bankAccount')?.invalid) {
                             <div class="invalid-feedback" style="font-size: 0.75rem;">Podaj dokładnie 26 cyfr.</div>
                         }
                       </div>
                       <div class="col-12 mt-3 d-flex gap-2 justify-content-end">
                         <button type="button" class="btn btn-sm btn-light rounded-pill px-3" (click)="toggleEditBank()">Anuluj</button>
                         <button type="button" class="btn btn-sm btn-primary rounded-pill px-4 shadow-sm" (click)="saveBank()" [disabled]="bankForm.invalid">
                            <i class="bi bi-save me-1"></i>Zapisz konto
                         </button>
                       </div>
                    </div>
                  </form>
                } @else {
                  @if (data.bankAccount) {
                    <div class="fs-6 text-dark mt-2 font-monospace">
                      <i class="bi bi-bank2 text-muted me-2"></i>{{ formatBankAccount(data.bankAccount) }}
                    </div>
                  } @else {
                     <div class="fs-6 text-muted mt-2 fst-italic small">
                       <i class="bi bi-bank2 me-2"></i>Brak uzupełnionego numeru konta
                     </div>
                  }
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <!-- Contracts List -->
        <div class="card shadow border-0 rounded-4 h-100">
          <div class="card-body p-sm-5 p-4">
            <h4 class="fw-bold text-secondary mb-4 border-bottom pb-3"><i class="bi bi-file-earmark-text text-primary me-2"></i>Umowy</h4>
            
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
      
      <div class="col-12">
        <!-- History List -->
        <div class="card shadow border-0 rounded-4 h-100">
          <div class="card-body p-sm-5 p-4">
            <h4 class="fw-bold text-secondary mb-4 border-bottom pb-3"><i class="bi bi-clock-history text-primary me-2"></i>Historia zmian</h4>
            
            <div class="timeline px-2">
              @for (entry of getSortedHistory(data.history); track entry.date + entry.field) {
                <div class="timeline-item p-3 mb-3 border" style="border-color: #dee2e6 !important;">
                   <div class="d-flex justify-content-between align-items-center mb-1">
                     <span class="badge bg-light text-primary border border-primary border-opacity-25 rounded-pill"><i class="bi bi-calendar3 me-1"></i>{{ entry.date | date:'dd.MM.yyyy HH:mm' }}</span>
                   </div>
                   <div class="fw-bold text-dark mt-2 mb-1 fs-6">{{ entry.field }}</div>
                   <div class="d-flex align-items-center bg-light rounded-3 p-2 small">
                      <div class="text-muted text-decoration-line-through text-truncate flex-grow-1" style="max-width: 45%;" [title]="entry.oldValue">
                        @if(entry.field === 'Konto bankowe') {
                          {{ formatBankAccount(entry.oldValue) }}
                        } @else {
                          {{ entry.oldValue }}
                        }
                      </div>
                      <i class="bi bi-arrow-right-circle-fill text-success mx-2"></i>
                      <div class="text-dark fw-semibold text-truncate flex-grow-1 text-end" style="max-width: 45%;" [title]="entry.newValue">
                        @if(entry.field === 'Konto bankowe') {
                          {{ formatBankAccount(entry.newValue) }}
                        } @else {
                          {{ entry.newValue }}
                        }
                      </div>
                   </div>
                </div>
              } @empty {
                <div class="text-center py-5 text-muted">
                  <i class="bi bi-clock fs-1 d-block mb-3 text-secondary opacity-50"></i>
                  Brak zmian do wyświetlenia.
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
    .dashed { border-top-style: dashed !important; border-top-color: #dee2e6 !important; }
    .form-control:focus { box-shadow: 0 0 0 0.15rem rgba(13,110,253,.25); }
  `]
})
export class EmployeeDetailsComponent {
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private contractService = inject(ContractService);
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);

  readonly pesel = input<string>();

  isEditingAddress = signal(false);
  isEditingBank = signal(false);
  addressForm!: FormGroup;
  bankForm!: FormGroup;

  constructor() {
    effect(() => {
      const emp = this.employee();
      if (emp && !this.addressForm) {
        this.initForms(emp);
      }
    });
  }

  employee = computed(() => {
    const currentPesel = this.pesel();
    return currentPesel ? this.employeeService.getEmployeeByPesel(currentPesel) : undefined;
  });

  employeeContracts = computed(() => {
    const currentPesel = this.pesel();
    if (!currentPesel) return [];
    return this.contractService.contracts().filter(c => c.pesel === currentPesel);
  });

  initForms(emp: any) {
    this.addressForm = this.fb.group({
      street: [emp.street, Validators.required],
      houseNumber: [emp.houseNumber, Validators.required],
      apartmentNumber: [emp.apartmentNumber],
      zipCode: [emp.zipCode, [Validators.required, Validators.pattern(/^[0-9]{2}-[0-9]{3}$/)]],
      city: [emp.city, Validators.required]
    });
    this.bankForm = this.fb.group({
      bankAccount: [emp.bankAccount || '', [Validators.pattern(/^[0-9]{26}$/)]]
    });
  }

  toggleEditAddress() {
    if (!this.isEditingAddress() && this.employee()) {
      this.initForms(this.employee());
    }
    this.isEditingAddress.set(!this.isEditingAddress());
  }

  toggleEditBank() {
    if (!this.isEditingBank() && this.employee()) {
      this.initForms(this.employee());
    }
    this.isEditingBank.set(!this.isEditingBank());
  }

  saveAddress() {
    if (this.addressForm.valid) {
      const emp = this.employee();
      if (emp) {
        this.employeeService.addOrUpdateEmployee({
          ...emp,
          ...this.addressForm.value
        });
        this.isEditingAddress.set(false);
      }
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  saveBank() {
    if (this.bankForm.valid) {
      const emp = this.employee();
      if (emp) {
        const formValue = this.bankForm.value;
        const normalizedBankAccount = formValue.bankAccount && formValue.bankAccount.trim() !== '' ? formValue.bankAccount : undefined;

        this.employeeService.addOrUpdateEmployee({
          ...emp,
          bankAccount: normalizedBankAccount
        });

        this.isEditingBank.set(false);
      }
    } else {
      this.bankForm.markAllAsTouched();
    }
  }

  formatBankAccount(account: string | undefined): string {
    if (!account || account.length !== 26) return account || '';
    return account.replace(/(.{2})(.{4})(.{4})(.{4})(.{4})(.{4})(.{4})/, '$1 $2 $3 $4 $5 $6 $7');
  }

  getSortedHistory(history: EmployeeHistoryEntry[] | undefined): EmployeeHistoryEntry[] {
    if (!history) return [];
    return [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  goBack() {
    this.router.navigate(['/pracownicy']);
  }

  viewContract(id: string) {
    this.router.navigate(['/umowy', id]);
  }
}
