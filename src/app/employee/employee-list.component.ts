import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from './service/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="row g-4 fade-in">
      <div class="col-12">
        <div class="card shadow border-0 rounded-4 h-100">
          <div class="card-body p-sm-5 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="fw-bold text-primary mb-0"><i class="bi bi-people-fill me-2"></i>Pracownicy</h2>
              <span class="badge bg-primary rounded-pill px-3 py-2 fs-6">{{ employees().length }} łącznie</span>
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th scope="col" class="border-0 rounded-start-3 ps-4">Imię i nazwisko</th>
                    <th scope="col" class="border-0">PESEL</th>
                    <th scope="col" class="border-0">Data urodzenia</th>
                    <th scope="col" class="border-0">Adres</th>
                    <th scope="col" class="border-0 text-end rounded-end-3 pe-4">Akcje</th>
                  </tr>
                </thead>
                <tbody class="border-top-0">
                  @for (employee of employees(); track employee.pesel) {
                  <tr>
                    <td class="ps-4">
                      <div class="d-flex align-items-center">
                        <div class="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                          <i class="bi bi-person-circle fs-4"></i>
                        </div>
                        <div>
                          <div class="fw-bold">{{ employee.firstName }} {{ employee.lastName }}</div>
                          <div class="text-muted small">Dodano: {{ employee.createdAt | date:'dd.MM.yyyy' }}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="font-monospace text-muted">{{ employee.pesel }}</span></td>
                    <td>{{ employee.birthDate | date:'dd.MM.yyyy' }}</td>
                    <td>
                      <div class="text-truncate" style="max-width: 200px;" title="{{ employee.street }} {{ employee.houseNumber }}{{ employee.apartmentNumber ? '/' + employee.apartmentNumber : '' }}, {{ employee.zipCode }} {{ employee.city }}">
                        ul. {{ employee.street }} {{ employee.houseNumber }}{{ employee.apartmentNumber ? '/' + employee.apartmentNumber : '' }}<br>
                        <small class="text-muted">{{ employee.zipCode }} {{ employee.city }}</small>
                      </div>
                    </td>
                    <td class="text-end pe-4">
                      <button class="btn btn-sm btn-outline-primary rounded-pill px-3" (click)="viewDetails(employee.pesel)">
                        Szczegóły
                      </button>
                    </td>
                  </tr>
                  } @empty {
                  <tr>
                    <td colspan="5" class="text-center py-5 text-muted">
                      <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                      Brak pracowników w systemie.<br>Dodaj nową umowę, aby utworzyć profil pracownika.
                    </td>
                  </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .table > :not(caption) > * > * { padding: 1rem 0.5rem; }
    .table tbody tr { transition: all 0.2s ease; cursor: default; }
    .table tbody tr:hover { background-color: rgba(13, 110, 253, 0.02); transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
  `]
})
export class EmployeeListComponent {
  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  readonly employees = this.employeeService.employees;

  viewDetails(pesel: string) {
    this.router.navigate(['/pracownicy', pesel]);
  }
}
