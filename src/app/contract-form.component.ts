import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>Nowa Umowa Cywilnoprawna</h2>

      <!-- Stepper -->
      <div class="d-flex mb-4">
        <div [class.fw-bold]="currentStep() === 1" class="me-3">1. Dane osobowe</div>
        <div [class.fw-bold]="currentStep() === 2" class="me-3">2. Dane adresowe</div>
        <div [class.fw-bold]="currentStep() === 3">3. Parametry umowy</div>
      </div>

      <form [formGroup]="contractForm">
        <!-- Step 1: Personal Data -->
        <div *ngIf="currentStep() === 1" formGroupName="personalData">
          <h3>Dane osobowe</h3>
          <div class="mb-3">
            <label class="form-label">Imię</label>
            <input formControlName="firstName" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Nazwisko</label>
            <input formControlName="lastName" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">PESEL</label>
            <input formControlName="pesel" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Data urodzenia</label>
            <input type="date" formControlName="birthDate" class="form-control" />
          </div>
        </div>

        <!-- Step 2: Address Data -->
        <div *ngIf="currentStep() === 2" formGroupName="addressData">
          <h3>Dane adresowe</h3>
          <div class="mb-3">
            <label class="form-label">Ulica</label>
            <input formControlName="street" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Nr domu / lokalu</label>
            <input formControlName="houseNumber" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Kod pocztowy</label>
            <input formControlName="zipCode" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Miejscowość</label>
            <input formControlName="city" class="form-control" />
          </div>
        </div>

        <!-- Step 3: Contract Parameters -->
        <div *ngIf="currentStep() === 3" formGroupName="contractParams">
          <h3>Parametry umowy</h3>
          <div class="mb-3">
            <label class="form-label">Rodzaj umowy</label>
            <select formControlName="contractType" class="form-select">
              <option value="zlecenie">Umowa zlecenie</option>
              <option value="dzielo">Umowa o dzieło</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Stawka brutto (PLN)</label>
            <input type="number" formControlName="rate" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Data rozpoczęcia</label>
            <input type="date" formControlName="startDate" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Data zakończenia</label>
            <input type="date" formControlName="endDate" class="form-control" />
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-4">
          <button type="button" class="btn btn-secondary me-2" (click)="prevStep()" *ngIf="currentStep() > 1">
            Wstecz
          </button>
          <button type="button" class="btn btn-primary" (click)="nextStep()" *ngIf="currentStep() < 3">
            Dalej
          </button>
          <button type="button" class="btn btn-success" (click)="submit()" *ngIf="currentStep() === 3">
            Zapisz umowę
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .fw-bold { font-weight: bold; text-decoration: underline; color: #007bff; }
    .container { max-width: 600px; }
  `]
})
export class ContractFormComponent {
  currentStep = signal(1);
  contractForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
  }

  nextStep() {
    if (this.currentStep() < 3) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  submit() {
    if (this.contractForm.valid) {
      console.log('Formularz wysłany:', this.contractForm.value);
      alert('Umowa została zapisana pomyślnie!');
    } else {
      alert('Proszę poprawnie wypełnić wszystkie pola we wszystkich krokach.');
    }
  }
}
