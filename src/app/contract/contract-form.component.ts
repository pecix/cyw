import { Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from './service/contract.service';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DraftService } from '../draft/service/draft.service';
import { EmployeeService } from '../employee/service/employee.service';

interface AddressItem {
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  zipCode: string;
  city: string;
  source: string;
}

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="container-fluid fade-in" style="max-width: 1200px;">
      <div class="row g-4">
        <!-- Sidebar Navigation -->
        <div class="col-lg-3 col-md-4">
          <div class="card shadow border-0 rounded-4 sticky-top" style="top: 2rem; z-index: 10;">
            <div class="card-body p-sm-4 p-3">
              <h5 class="fw-bold text-primary mb-4 d-none d-md-block">Tworzenie Umowy</h5>
              
              <div class="list-group list-group-flush form-stepper">
                @for (step of steps; track step.id) {
                  <button type="button" 
                          class="list-group-item list-group-item-action d-flex align-items-center rounded-3 border-0 py-3 mb-2"
                          [class.active]="currentStep() === step.id"
                          (click)="goToStep(step.id)">
                    
                    <div class="step-icon me-3 bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                         [class.bg-primary]="currentStep() === step.id" [class.text-primary]="currentStep() === step.id"
                         [class.bg-success]="isStepValidMap()[step.id] && currentStep() !== step.id" [class.text-success]="isStepValidMap()[step.id] && currentStep() !== step.id"
                         [class.bg-secondary]="!isStepValidMap()[step.id] && currentStep() !== step.id" [class.text-secondary]="!isStepValidMap()[step.id] && currentStep() !== step.id"
                         style="width: 40px; height: 40px; min-width: 40px;">
                      
                      @if (isStepValidMap()[step.id] && currentStep() !== step.id) {
                        <i class="bi bi-check-lg fs-5"></i>
                      } @else {
                        <i class="bi" [class]="step.icon"></i>
                      }
                    </div>
                    
                    <div class="flex-grow-1 text-start d-md-block d-none">
                      <div class="fw-semibold text-truncate" style="font-size: 0.95rem;">{{ step.name }}</div>
                      <small class="text-opacity-75" [class.text-white]="currentStep() === step.id" [class.text-muted]="currentStep() !== step.id">
                        Krok {{ step.id }} z {{ steps.length }}
                      </small>
                    </div>
                  </button>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="col-lg-9 col-md-8">
          <div class="card shadow-lg border-0 rounded-4 h-100">
            <div class="card-body p-sm-5 p-4 position-relative">
              
              <div class="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <h2 class="fw-bold text-primary mb-0">{{ currentStepName() }}</h2>
                @if (isStepValidMap()[currentStep()]) {
                  <span class="badge bg-success rounded-pill px-3 py-2 fs-6"><i class="bi bi-check-circle me-1"></i> Wypełnione</span>
                }
              </div>

              <form [formGroup]="contractForm">
                <!-- STEP 1: Dane osobowe -->
                @if (currentStep() === 1) {
                <div formGroupName="personalData" class="fade-in">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <div class="form-floating text-muted">
                        <input formControlName="firstName" class="form-control bg-light border-0" id="firstName" placeholder="Imię" [class.is-invalid]="invalidFields().firstName" />
                        <label for="firstName">Imię</label>
                        <div class="invalid-feedback">Imię jest wymagane</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating text-muted">
                        <input formControlName="lastName" class="form-control bg-light border-0" id="lastName" placeholder="Nazwisko" [class.is-invalid]="invalidFields().lastName" />
                        <label for="lastName">Nazwisko</label>
                        <div class="invalid-feedback">Nazwisko jest wymagane</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating text-muted">
                        <input formControlName="pesel" class="form-control bg-light border-0" id="pesel" placeholder="PESEL" [class.is-invalid]="invalidFields().pesel" />
                        <label for="pesel">PESEL</label>
                        <div class="invalid-feedback">Wymagany jest 11-cyfrowy PESEL</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating text-muted">
                        <input type="date" formControlName="birthDate" class="form-control bg-light border-0" id="birthDate" placeholder="Data urodzenia" [class.is-invalid]="invalidFields().birthDate" />
                        <label for="birthDate">Data urodzenia</label>
                        <div class="invalid-feedback">Data urodzenia jest wymagana</div>
                      </div>
                    </div>
                  </div>
                </div>
                }

                <!-- STEP 2: Dane adresowe -->
                @if (currentStep() === 2) {
                <div class="fade-in">
                  @if (availableAddresses().length > 0) {
                  <div class="d-flex justify-content-end mb-3">
                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm" (click)="showAddressSelector.set(!showAddressSelector())">
                      <i class="bi me-1" [class.bi-clock-history]="!showAddressSelector()" [class.bi-x-lg]="showAddressSelector()"></i>
                      {{ showAddressSelector() ? 'Anuluj wybór' : 'Wybierz poprzedni adres z historii' }}
                    </button>
                  </div>
                  
                  @if (showAddressSelector()) {
                    <div class="row g-3 mb-4 fade-in">
                       <div class="col-12">
                          <label class="form-label text-muted small fw-bold mb-2">Znalezione adresy powiązane z tym pracownikiem:</label>
                          <div class="list-group list-group-flush border rounded-3 overflow-hidden shadow-sm">
                            @for (addr of availableAddresses(); track addr.street + addr.houseNumber + addr.zipCode + addr.city) {
                              <button type="button" class="list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center" (click)="selectAddress(addr)">
                                <div>
                                  <div class="fw-semibold text-dark mb-1">
                                    <i class="bi bi-geo-alt text-primary opacity-75 me-2"></i>ul. {{ addr.street }} {{ addr.houseNumber }}{{ addr.apartmentNumber ? '/' + addr.apartmentNumber : '' }}
                                  </div>
                                  <small class="text-muted ms-4">{{ addr.zipCode }} {{ addr.city }}</small>
                                </div>
                                <span class="badge bg-light text-primary border border-primary border-opacity-25 rounded-pill shadow-sm px-3 py-2" style="font-size: 0.75rem;">
                                  {{ addr.source }}
                                </span>
                              </button>
                            }
                          </div>
                      </div>
                    </div>
                  }
                  }

                <div formGroupName="addressData" class="fade-in">
                  <div class="row g-4">
                    <div class="col-md-8">
                      <div class="form-floating text-muted">
                        <input formControlName="street" class="form-control bg-light border-0" id="street" placeholder="Ulica" [class.is-invalid]="invalidFields().street" />
                        <label for="street">Ulica</label>
                        <div class="invalid-feedback">Ulica jest wymagana</div>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="form-floating text-muted">
                        <input formControlName="houseNumber" class="form-control bg-light border-0" id="houseNumber" placeholder="Nr domu" [class.is-invalid]="invalidFields().houseNumber" />
                        <label for="houseNumber">Nr domu</label>
                        <div class="invalid-feedback">Numer jest wymagany</div>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="form-floating text-muted">
                        <input formControlName="apartmentNumber" class="form-control bg-light border-0" id="apartmentNumber" placeholder="Nr lokalu" />
                        <label for="apartmentNumber">Nr lokalu</label>
                        <div class="form-text mt-1 text-muted" style="font-size: 0.75rem;">Opcjonalne</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating text-muted">
                        <input formControlName="zipCode" class="form-control bg-light border-0" id="zipCode" placeholder="Kod pocztowy" [class.is-invalid]="invalidFields().zipCode" />
                        <label for="zipCode">Kod pocztowy</label>
                        <div class="invalid-feedback">Wymagany format XX-XXX</div>
                      </div>
                    </div>
                    <div class="col-md-8">
                      <div class="form-floating text-muted">
                        <input formControlName="city" class="form-control bg-light border-0" id="city" placeholder="Miejscowość" [class.is-invalid]="invalidFields().city" />
                        <label for="city">Miejscowość</label>
                        <div class="invalid-feedback">Miejscowość jest wymagana</div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                }

                <!-- STEP 3: Parametry umowy -->
                @if (currentStep() === 3) {
                <div formGroupName="contractParams" class="fade-in">
                  <div class="row g-4">
                    <div class="col-md-12">
                      <div class="form-floating text-muted">
                        <select formControlName="contractType" class="form-select bg-light border-0" id="contractType" [class.is-invalid]="invalidFields().contractType">
                          <option value="zlecenie">Umowa zlecenie</option>
                          <option value="dzielo">Umowa o dzieło</option>
                          <option value="czas_okreslony">Umowa na czas określony</option>
                          <option value="czas_nieokreslony">Umowa na czas nieokreślony</option>
                          <option value="zastepstwo">Umowa na zastępstwo</option>
                          <option value="kontrakt">Kontrakt</option>
                        </select>
                        <label for="contractType">Rodzaj umowy</label>
                        <div class="invalid-feedback">Rodzaj umowy jest wymagany</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating text-muted">
                        <input type="date" formControlName="conclusionDate" class="form-control bg-light border-0" id="conclusionDate" placeholder="Data zawarcia" [class.is-invalid]="invalidFields().conclusionDate" />
                        <label for="conclusionDate">Data zawarcia umowy</label>
                        <div class="invalid-feedback">Data zawarcia jest wymagana</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating text-muted">
                        <input type="date" formControlName="startDate" class="form-control bg-light border-0" id="startDate" placeholder="Data rozpoczęcia" [class.is-invalid]="invalidFields().startDate" />
                        <label for="startDate">Data rozpoczęcia</label>
                        <div class="invalid-feedback">Data rozpoczęcia jest wymagana</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating text-muted">
                        <input type="date" formControlName="endDate" class="form-control bg-light border-0" id="endDate" placeholder="Data zakończenia" [class.is-invalid]="invalidFields().endDate" />
                        <label for="endDate">Data zakończenia</label>
                        <div class="invalid-feedback">Data zakończenia jest wymagana</div>
                      </div>
                    </div>
                  </div>
                </div>
                }

                <!-- STEP 4: Warunki umowy -->
                @if (currentStep() === 4) {
                <div formGroupName="contractConditions" class="fade-in">
                  <div class="row g-4">
                    <div class="col-md-12">
                      <div class="form-floating text-muted">
                        <input formControlName="position" class="form-control bg-light border-0" id="position" placeholder="Stanowisko" [class.is-invalid]="invalidFields().position" />
                        <label for="position">Stanowisko</label>
                        <div class="invalid-feedback">Stanowisko jest wymagane</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating text-muted">
                        <input formControlName="workingTime" class="form-control bg-light border-0" id="workingTime" placeholder="Wymiar etatu (np. 1/1, 1/2)" [class.is-invalid]="invalidFields().workingTime" />
                        <label for="workingTime">Wymiar etatu (np. 1/1, 1/2)</label>
                        <div class="invalid-feedback">Wymiar etatu jest wymagany</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating text-muted">
                        <input formControlName="workplace" class="form-control bg-light border-0" id="workplace" placeholder="Miejsce pracy" [class.is-invalid]="invalidFields().workplace" />
                        <label for="workplace">Miejsce pracy</label>
                        <div class="invalid-feedback">Miejsce pracy jest wymagane</div>
                      </div>
                    </div>
                  </div>
                </div>
                }

                <!-- STEP 5: Dane wynagrodzenia -->
                @if (currentStep() === 5) {
                <div formGroupName="remunerationData" class="fade-in">
                  <div class="row g-4">
                    <div class="col-md-4">
                      <div class="form-floating text-muted">
                        <input type="number" formControlName="rate" class="form-control bg-light border-0" id="rate" placeholder="Stawka brutto (PLN)" [class.is-invalid]="invalidFields().rate" />
                        <label for="rate">Stawka brutto (PLN)</label>
                        <div class="invalid-feedback">Stawka jest wymagana i dodatnia</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating text-muted">
                        <input type="number" formControlName="seniorityAllowance" class="form-control bg-light border-0" id="seniorityAllowance" placeholder="Dodatek stażowy (%)" [class.is-invalid]="invalidFields().seniorityAllowance" />
                        <label for="seniorityAllowance">Dodatek stażowy (%)</label>
                        <div class="invalid-feedback">Wartość musi być między 0 a 100</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating text-muted">
                        <input type="number" formControlName="functionalAllowance" class="form-control bg-light border-0" id="functionalAllowance" placeholder="Dodatek funkcyjny" [class.is-invalid]="invalidFields().functionalAllowance" />
                        <label for="functionalAllowance">Dodatek funkcyjny (PLN)</label>
                        <div class="invalid-feedback">Wartość musi być dodatnia</div>
                      </div>
                    </div>
                  </div>
                </div>
                }

                <!-- STEP 6: Podsumowanie -->
                @if (currentStep() === 6) {
                <div class="fade-in">
                  <div class="alert alert-info border-0 rounded-4 mb-4 d-flex">
                    <i class="bi bi-info-circle-fill fs-4 me-3 mt-1"></i>
                    <div>
                      <h5 class="fw-bold mb-1">Prawie gotowe!</h5>
                      <p class="mb-0">Zweryfikuj wprowadzone dane. Upewnij się, że wszystkie wartości są poprawne, a następnie zapisz umowę w systemie.</p>
                      @if (!contractForm.valid) {
                        <p class="text-danger mt-3 fw-semibold"><i class="bi bi-exclamation-triangle me-1"></i> Niektóre z poprzednich kroków zawierają braki. Sprawdź listę po lewej stronie formularza.</p>
                      }
                    </div>
                  </div>

                  <div class="row g-4">
                    <div class="col-md-6">
                      <div class="p-3 bg-light rounded-4 h-100">
                        <div class="fw-bold text-secondary mb-2 border-bottom pb-2">Dane Wykonawcy</div>
                        <div class="small">
                          <strong>{{ contractForm.value.personalData?.firstName }} {{ contractForm.value.personalData?.lastName }}</strong><br>
                          PESEL: {{ contractForm.value.personalData?.pesel }}<br>
                          Data ur.: {{ contractForm.value.personalData?.birthDate | date:'dd.MM.yyyy' }}<br>
                          Adres: {{ contractForm.value.addressData?.street }} {{ contractForm.value.addressData?.houseNumber }} {{ contractForm.value.addressData?.apartmentNumber ? '/' + contractForm.value.addressData?.apartmentNumber : '' }}<br>
                          {{ contractForm.value.addressData?.zipCode }} {{ contractForm.value.addressData?.city }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="p-3 bg-light rounded-4 h-100">
                        <div class="fw-bold text-secondary mb-2 border-bottom pb-2">Warunki Zatrudnienia</div>
                        <div class="small">
                          Stanowisko: <strong>{{ contractForm.value.contractConditions?.position }}</strong> ({{ contractForm.value.contractConditions?.workingTime }})<br>
                          Miejsce pracy: {{ contractForm.value.contractConditions?.workplace }}<br>
                          Typ: <strong>{{ getTypeName(contractForm.value.contractParams?.contractType) }}</strong><br>
                          Okres: {{ contractForm.value.contractParams?.startDate | date:'dd.MM.yyyy' }} - {{ contractForm.value.contractParams?.endDate | date:'dd.MM.yyyy' }}<br>
                          Data zawarcia: {{ contractForm.value.contractParams?.conclusionDate | date:'dd.MM.yyyy' }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-4 p-4 text-center">
                        <div class="text-success text-uppercase fw-bold small mb-1">Wynagrodzenie i Finanse</div>
                        <div class="display-6 fw-bold text-success mb-2">{{ contractForm.value.remunerationData?.rate | currency:'PLN':'symbol':'1.2-2' }}</div>
                        <div class="fs-5 text-muted mb-3">
                          + {{ contractForm.value.remunerationData?.seniorityAllowance }}% dodatku stażowego<br>
                          + {{ contractForm.value.remunerationData?.functionalAllowance | currency:'PLN':'symbol':'1.2-2' }} dodatku funkcyjnego
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                }

                <div class="d-flex justify-content-between mt-5 pt-4 border-top">
                  <button type="button" class="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold shadow-sm text-dark btn-mobile" 
                          (click)="prevStep()" [class.invisible]="currentStep() === 1">
                    <i class="bi bi-chevron-left me-2"></i>Wstecz
                  </button>
                  
                  @if (currentStep() < 6) {
                  <button type="button" class="btn btn-primary px-5 py-2 rounded-pill fw-semibold shadow-sm btn-mobile" 
                          (click)="nextStep()">
                    Dalej<i class="bi bi-chevron-right ms-2"></i>
                  </button>
                  }
                  
                  @if (currentStep() === 6) {
                  <button type="button" class="btn btn-success px-5 py-2 rounded-pill fw-semibold shadow-sm btn-mobile shadow" 
                          (click)="submit()" [disabled]="!contractForm.valid">
                    <i class="bi bi-download me-2"></i>Zapisz umowę
                  </button>
                  }
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control:focus, .form-select:focus {
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
      border-color: #86b7fe;
      background-color: #fff !important;
    }
    .form-floating > label {
      color: #6c757d;
    }
    .form-stepper .list-group-item.active {
      background-color: #0d6efd;
      color: white;
      box-shadow: 0 4px 6px rgba(13, 110, 253, 0.2);
    }
    .form-stepper .list-group-item.active .text-primary {
      color: white !important;
    }
    .form-stepper .list-group-item:not(.active):hover {
      background-color: #f8f9fa;
    }
    .fade-in {
      animation: fadeIn 0.4s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 576px) {
      .btn-mobile { width: 48%; padding-left: 0 !important; padding-right: 0 !important; }
    }
  `]
})
export class ContractFormComponent {
  currentStep = signal(1);
  contractForm: FormGroup;

  steps = [
    { id: 1, name: 'Dane osobowe', icon: 'bi-person', groupKey: 'personalData' },
    { id: 2, name: 'Dane adresowe', icon: 'bi-house', groupKey: 'addressData' },
    { id: 3, name: 'Parametry umowy', icon: 'bi-file-earmark-text', groupKey: 'contractParams' },
    { id: 4, name: 'Warunki umowy', icon: 'bi-briefcase', groupKey: 'contractConditions' },
    { id: 5, name: 'Dane wynagrodzenia', icon: 'bi-cash-coin', groupKey: 'remunerationData' },
    { id: 6, name: 'Podsumowanie', icon: 'bi-check2-all', groupKey: null }
  ];

  formEvents: any;
  touchedTrigger = signal(0);
  currentDraftId: string | null = null;
  showAddressSelector = signal(false);

  availableAddresses = computed(() => {
    this.formEvents();
    const peselControl = this.contractForm?.get('personalData.pesel');
    if (!peselControl) return [];
    const pesel = peselControl.value;
    if (!pesel || pesel.length !== 11) return [];

    const employee = this.employeeService.getEmployeeByPesel(pesel);
    const contracts = this.contractService.contracts().filter(c => c.pesel === pesel);
    const addresses: AddressItem[] = [];

    if (employee) {
      addresses.push({
         street: employee.street,
         houseNumber: employee.houseNumber,
         apartmentNumber: employee.apartmentNumber,
         zipCode: employee.zipCode,
         city: employee.city,
         source: 'Obecny adres'
      });

      employee.history?.filter(h => h.field === 'Adres korespondencyjny').forEach(h => {
         [h.oldValue, h.newValue].forEach(val => {
            if (val) {
               const parsed = this.parseAddressString(val as string);
               if (parsed && parsed.street && parsed.city) {
                  addresses.push({ ...parsed as any, source: `Z historii zmian` });
               }
            }
         });
      });
    }

    contracts.forEach(c => {
       addresses.push({
          street: c.street,
          houseNumber: c.houseNumber,
          apartmentNumber: c.apartmentNumber,
          zipCode: c.zipCode,
          city: c.city,
          source: `Poprzednia umowa (${c.position})`
       });
    });

    const unique = new Map<string, AddressItem>();
    addresses.forEach(a => {
       const key = `${a.street?.trim().toLowerCase()}|${a.houseNumber?.trim().toLowerCase()}|${a.apartmentNumber?.trim().toLowerCase() || ''}|${a.zipCode?.trim().toLowerCase()}|${a.city?.trim().toLowerCase()}`;
       if (a.street && a.city && !unique.has(key)) {
          unique.set(key, a);
       }
    });

    return Array.from(unique.values());
  });

  parseAddressString(addressStr: string): Partial<AddressItem> | null {
    try {
       const str = addressStr.replace('ul. ', '').trim();
       const parts = str.split(', ');
       if (parts.length !== 2) return null;
       const streetAndNumber = parts[0];
       const zipAndCity = parts[1];

       const zipCode = zipAndCity.substring(0, 6);
       const city = zipAndCity.substring(7);

       const lastSpaceIdx = streetAndNumber.lastIndexOf(' ');
       const street = streetAndNumber.substring(0, lastSpaceIdx);
       const numbers = streetAndNumber.substring(lastSpaceIdx + 1);

       let houseNumber = numbers;
       let apartmentNumber = undefined;
       if (numbers.includes('/')) {
          const nParts = numbers.split('/');
          houseNumber = nParts[0];
          apartmentNumber = nParts[1];
       }
       return { street, houseNumber, apartmentNumber, zipCode, city };
    } catch(e) {
       return null;
    }
  }

  selectAddress(address: AddressItem) {
    this.contractForm.get('addressData')?.patchValue({
        street: address.street,
        houseNumber: address.houseNumber,
        apartmentNumber: address.apartmentNumber || '',
        zipCode: address.zipCode,
        city: address.city
    });
    this.showAddressSelector.set(false);
  }

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private draftService: DraftService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.contractForm = this.fb.group({
      personalData: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        pesel: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
        birthDate: ['', Validators.required],
      }),
      addressData: this.fb.group({
        street: ['', Validators.required],
        houseNumber: ['', Validators.required],
        apartmentNumber: [''],
        zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{2}-[0-9]{3}$/)]],
        city: ['', Validators.required],
      }),
      contractParams: this.fb.group({
        contractType: ['zlecenie', Validators.required],
        conclusionDate: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
      }),
      contractConditions: this.fb.group({
        position: ['', Validators.required],
        workingTime: ['', Validators.required],
        workplace: ['', Validators.required],
      }),
      remunerationData: this.fb.group({
        rate: [null as any, [Validators.required, Validators.min(0)]],
        seniorityAllowance: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        functionalAllowance: [0, [Validators.required, Validators.min(0)]],
      })
    });

    this.formEvents = toSignal(this.contractForm.valueChanges);

    this.contractForm.get('personalData.pesel')?.valueChanges.subscribe(pesel => {
      const birthDate = this.extractBirthDateFromPesel(pesel);
      if (birthDate) {
        this.contractForm.get('personalData.birthDate')?.setValue(birthDate, { emitEvent: false });
      }
      
      if (pesel && pesel.length === 11) {
        const employee = this.employeeService.getEmployeeByPesel(pesel);
        if (employee) {
          const fnControl = this.contractForm.get('personalData.firstName');
          const lnControl = this.contractForm.get('personalData.lastName');
          if (!fnControl?.value) {
            fnControl?.setValue(employee.firstName, { emitEvent: false });
          }
          if (!lnControl?.value) {
            lnControl?.setValue(employee.lastName, { emitEvent: false });
          }
        }
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['draftId']) {
        this.loadDraft(params['draftId']);
      }
    });
  }

  private loadDraft(draftId: string) {
    const draft = this.draftService.getDraftById(draftId);
    if (draft) {
      this.currentDraftId = draft.id;
      this.contractForm.patchValue(draft.formData, { emitEvent: false });
      this.currentStep.set(draft.currentStep);
    }
  }

  private saveCurrentDraft() {
    if (!this.currentDraftId) {
      this.currentDraftId = 'draft-' + Math.random().toString(36).substr(2, 9);
    }
    this.draftService.saveDraft(this.currentDraftId, this.contractForm.value, this.currentStep());
  }

  currentStepName = computed(() => {
    return this.steps.find(s => s.id === this.currentStep())?.name || '';
  });

  isStepValidMap = computed(() => {
    this.formEvents();
    const map: Record<number, boolean> = {};
    for (const step of this.steps) {
      if (step.groupKey) {
        map[step.id] = this.contractForm.get(step.groupKey)?.valid ?? false;
      } else {
        map[step.id] = this.contractForm.valid;
      }
    }
    return map;
  });

  invalidFields = computed(() => {
    this.formEvents();
    this.touchedTrigger();

    const isControlInvalid = (path: string) => {
      const c = this.contractForm.get(path);
      return c ? c.invalid && (c.dirty || c.touched) : false;
    };

    return {
      firstName: isControlInvalid('personalData.firstName'),
      lastName: isControlInvalid('personalData.lastName'),
      pesel: isControlInvalid('personalData.pesel'),
      birthDate: isControlInvalid('personalData.birthDate'),

      street: isControlInvalid('addressData.street'),
      houseNumber: isControlInvalid('addressData.houseNumber'),
      zipCode: isControlInvalid('addressData.zipCode'),
      city: isControlInvalid('addressData.city'),

      contractType: isControlInvalid('contractParams.contractType'),
      conclusionDate: isControlInvalid('contractParams.conclusionDate'),
      startDate: isControlInvalid('contractParams.startDate'),
      endDate: isControlInvalid('contractParams.endDate'),

      position: isControlInvalid('contractConditions.position'),
      workingTime: isControlInvalid('contractConditions.workingTime'),
      workplace: isControlInvalid('contractConditions.workplace'),

      rate: isControlInvalid('remunerationData.rate'),
      seniorityAllowance: isControlInvalid('remunerationData.seniorityAllowance'),
      functionalAllowance: isControlInvalid('remunerationData.functionalAllowance'),
    };
  });

  markGroupTouched(groupName: string | null) {
    if (!groupName) return;
    const group = this.contractForm.get(groupName) as FormGroup;
    if (group) {
      Object.keys(group.controls).forEach(key => {
        const control = group.get(key);
        control?.markAsTouched();
      });
      this.touchedTrigger.update(v => v + 1);
    }
  }

  goToStep(stepId: number) {
    const currentGroup = this.steps.find(s => s.id === this.currentStep())?.groupKey;
    if (currentGroup) {
      this.markGroupTouched(currentGroup);
    }
    this.currentStep.set(stepId);
    this.saveCurrentDraft();
  }

  nextStep() {
    const currentStepDef = this.steps.find(s => s.id === this.currentStep());
    if (currentStepDef?.groupKey) {
      this.markGroupTouched(currentStepDef.groupKey);

      if (this.isStepValidMap()[this.currentStep()]) {
        this.currentStep.update(s => Math.min(s + 1, 6));
        this.saveCurrentDraft();
      }
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
      this.saveCurrentDraft();
    }
  }

  submit() {
    this.contractForm.markAllAsTouched();
    this.touchedTrigger.update(v => v + 1);

    if (this.contractForm.valid) {
      const formValue = this.contractForm.value;
      const contractData = {
        ...formValue.personalData,
        ...formValue.addressData,
        ...formValue.contractParams,
        ...formValue.contractConditions,
        ...formValue.remunerationData
      };
      
      this.employeeService.addOrUpdateEmployee({
        ...formValue.personalData,
        ...formValue.addressData
      });
      
      this.contractService.addContract(contractData);

      if (this.currentDraftId) {
        this.draftService.deleteDraft(this.currentDraftId);
      }

      this.router.navigate(['/umowy']);
    } else {
      const firstInvalidStep = this.steps.find(s => !this.isStepValidMap()[s.id] && s.id !== 6);
      if (firstInvalidStep) {
        this.currentStep.set(firstInvalidStep.id);
      }
    }
  }

  getTypeName(type: string): string {
    const types: Record<string, string> = {
      'zlecenie': 'Umowa zlecenia',
      'dzielo': 'Umowa o dzieło',
      'czas_okreslony': 'Umowa na czas określony',
      'czas_nieokreslony': 'Umowa na czas nieokreślony',
      'zastepstwo': 'Umowa na zastępstwo',
      'kontrakt': 'Kontrakt'
    };
    return types[type] || type;
  }

  private extractBirthDateFromPesel(pesel: string): string | null {
    if (!pesel || pesel.length !== 11 || !/^\d{11}$/.test(pesel)) return null;

    let year = parseInt(pesel.substring(0, 2), 10);
    let month = parseInt(pesel.substring(2, 4), 10);
    const day = parseInt(pesel.substring(4, 6), 10);

    let century = 1900;
    if (month > 80 && month <= 92) {
      century = 1800;
      month -= 80;
    } else if (month > 60 && month <= 72) {
      century = 2200;
      month -= 60;
    } else if (month > 40 && month <= 52) {
      century = 2100;
      month -= 40;
    } else if (month > 20 && month <= 32) {
      century = 2000;
      month -= 20;
    } else if (month > 12) {
      return null; // Invalid month encoding
    }

    year += century;

    // Validate if the numeric date parts form a valid real-world date
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      // Format to YYYY-MM-DD for the HTML5 date input
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    return null;
  }
}
