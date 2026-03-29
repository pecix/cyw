import { Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from './contract.service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container py-5">
      <div class="card shadow-lg border-0 rounded-4">
        <div class="card-body p-sm-5 p-4">
          <h2 class="text-center mb-5 fw-bold text-primary">Nowa Umowa Cywilnoprawna</h2>

          <!-- Stepper -->
          <div class="position-relative mb-5 d-none d-sm-block">
            <div class="progress" style="height: 4px;">
              <div class="progress-bar bg-primary" role="progressbar" 
                   [style.width]="(currentStep() - 1) * 50 + '%'" 
                   aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="d-flex justify-content-between position-absolute top-50 start-0 w-100 translate-middle-y">
              <div class="step-item text-center">
                <div class="step-circle" [class.active]="currentStep() >= 1">1</div>
                <div class="step-label mt-2 fw-semibold" [class.text-primary]="currentStep() >= 1">Dane osobowe</div>
              </div>
              <div class="step-item text-center">
                <div class="step-circle" [class.active]="currentStep() >= 2">2</div>
                <div class="step-label mt-2 fw-semibold" [class.text-primary]="currentStep() >= 2">Dane adresowe</div>
              </div>
              <div class="step-item text-center">
                <div class="step-circle" [class.active]="currentStep() >= 3">3</div>
                <div class="step-label mt-2 fw-semibold" [class.text-primary]="currentStep() >= 3">Parametry umowy</div>
              </div>
            </div>
          </div>
          
          <!-- Mobile Stepper -->
          <div class="d-block d-sm-none mb-4 text-center">
            <span class="badge bg-primary rounded-pill px-3 py-2 fs-6">Krok {{ currentStep() }} z 3</span>
          </div>

          <form [formGroup]="contractForm" class="mt-sm-5 mt-3 pt-sm-3">
            <!-- Step 1: Personal Data -->
            @if (currentStep() === 1) {
            <div formGroupName="personalData" class="fade-in">
              <h4 class="mb-4 text-secondary"><i class="bi bi-person me-2"></i>Dane osobowe</h4>
              <div class="row g-3">
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

            <!-- Step 2: Address Data -->
            @if (currentStep() === 2) {
            <div formGroupName="addressData" class="fade-in">
              <h4 class="mb-4 text-secondary"><i class="bi bi-house me-2"></i>Dane adresowe</h4>
              <div class="row g-3">
                <div class="col-md-8">
                  <div class="form-floating text-muted">
                    <input formControlName="street" class="form-control bg-light border-0" id="street" placeholder="Ulica" [class.is-invalid]="invalidFields().street" />
                    <label for="street">Ulica</label>
                    <div class="invalid-feedback">Ulica jest wymagana</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating text-muted">
                    <input formControlName="houseNumber" class="form-control bg-light border-0" id="houseNumber" placeholder="Nr domu / lokalu" [class.is-invalid]="invalidFields().houseNumber" />
                    <label for="houseNumber">Nr domu / lokalu</label>
                    <div class="invalid-feedback">Numer jest wymagany</div>
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
            }

            <!-- Step 3: Contract Parameters -->
            @if (currentStep() === 3) {
            <div formGroupName="contractParams" class="fade-in">
              <h4 class="mb-4 text-secondary"><i class="bi bi-file-earmark-text me-2"></i>Parametry umowy</h4>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-floating text-muted">
                    <select formControlName="contractType" class="form-select bg-light border-0" id="contractType" [class.is-invalid]="invalidFields().contractType">
                      <option value="zlecenie">Umowa zlecenie</option>
                      <option value="dzielo">Umowa o dzieło</option>
                    </select>
                    <label for="contractType">Rodzaj umowy</label>
                    <div class="invalid-feedback">Rodzaj umowy jest wymagany</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating text-muted">
                    <input type="number" formControlName="rate" class="form-control bg-light border-0" id="rate" placeholder="Stawka brutto (PLN)" [class.is-invalid]="invalidFields().rate" />
                    <label for="rate">Stawka brutto (PLN)</label>
                    <div class="invalid-feedback">Stawka jest wymagana i musi być dodatnia</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating text-muted">
                    <input type="date" formControlName="startDate" class="form-control bg-light border-0" id="startDate" placeholder="Data rozpoczęcia" [class.is-invalid]="invalidFields().startDate" />
                    <label for="startDate">Data rozpoczęcia</label>
                    <div class="invalid-feedback">Data rozpoczęcia jest wymagana</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating text-muted">
                    <input type="date" formControlName="endDate" class="form-control bg-light border-0" id="endDate" placeholder="Data zakończenia" [class.is-invalid]="invalidFields().endDate" />
                    <label for="endDate">Data zakończenia</label>
                    <div class="invalid-feedback">Data zakończenia jest wymagana</div>
                  </div>
                </div>
              </div>
            </div>
            }

            <!-- Navigation Buttons -->
            <div class="d-flex justify-content-between mt-5 pt-3 border-top">
              <button type="button" class="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold shadow-sm text-dark btn-mobile" (click)="prevStep()" [class.invisible]="currentStep() === 1">
                Wstecz
              </button>
              
              @if (currentStep() < 3) {
              <button type="button" class="btn btn-primary px-5 py-2 rounded-pill fw-semibold shadow-sm btn-mobile" (click)="nextStep()">
                Dalej
              </button>
              }
              
              @if (currentStep() === 3) {
              <button type="button" class="btn btn-success px-5 py-2 rounded-pill fw-semibold shadow-sm btn-mobile" (click)="submit()">
                Zapisz umowę
              </button>
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; }
    .form-control:focus, .form-select:focus {
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
      border-color: #86b7fe;
      background-color: #fff !important;
    }
    .form-floating > label {
      color: #6c757d;
    }
    .step-item {
      width: 120px;
      z-index: 2;
    }
    .step-circle {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      background-color: #e9ecef;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #6c757d;
      transition: all 0.3s ease;
      border: 3px solid #fff;
      box-shadow: 0 0 0 2px #e9ecef;
    }
    .step-circle.active {
      background-color: #0d6efd;
      color: #fff;
      box-shadow: 0 0 0 2px #0d6efd;
    }
    .step-label {
      font-size: 0.85rem;
      color: #6c757d;
      transition: all 0.3s ease;
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
  
  formEvents: any;
  touchedTrigger = signal(0);

  constructor(private fb: FormBuilder, private contractService: ContractService, private router: Router) {
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
        zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{2}-[0-9]{3}$/)]],
        city: ['', Validators.required],
      }),
      contractParams: this.fb.group({
        contractType: ['zlecenie', Validators.required],
        rate: [0, [Validators.required, Validators.min(0)]],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
      })
    });

    this.formEvents = toSignal(this.contractForm.valueChanges);
  }

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
      rate: isControlInvalid('contractParams.rate'),
      startDate: isControlInvalid('contractParams.startDate'),
      endDate: isControlInvalid('contractParams.endDate'),
    };
  });

  stepValidity = computed(() => {
    this.formEvents();
    return {
      1: this.contractForm.get('personalData')?.valid ?? false,
      2: this.contractForm.get('addressData')?.valid ?? false,
      3: this.contractForm.get('contractParams')?.valid ?? false
    };
  });

  markGroupTouched(groupName: string) {
    const group = this.contractForm.get(groupName) as FormGroup;
    if (group) {
      Object.keys(group.controls).forEach(key => {
        const control = group.get(key);
        control?.markAsTouched();
      });
      this.touchedTrigger.update(v => v + 1);
    }
  }

  nextStep() {
    let groupName = '';
    const step = this.currentStep();
    if (step === 1) groupName = 'personalData';
    if (step === 2) groupName = 'addressData';
    
    if (groupName) {
      this.markGroupTouched(groupName);
    }
    
    const validMap = this.stepValidity() as any;
    if (step < 3 && validMap[step]) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  submit() {
    this.markGroupTouched('contractParams');
    if (this.contractForm.valid) {
      const formValue = this.contractForm.value;
      const contractData = {
        ...formValue.personalData,
        ...formValue.addressData,
        ...formValue.contractParams
      };
      this.contractService.addContract(contractData);
      
      this.router.navigate(['/umowy']);
    }
  }
}
