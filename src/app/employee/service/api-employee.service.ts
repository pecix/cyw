import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from './employee.service';
import { Employee } from '../employee';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiEmployeeService extends EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/employees';

  private employeesSignal = signal<Employee[]>([]);

  override readonly employees = this.employeesSignal.asReadonly();

  constructor() {
    super();
    this.loadEmployees();
  }

  private loadEmployees() {
    this.http.get<Employee[]>(this.apiUrl)
      .subscribe(data => this.employeesSignal.set(data));
  }

  override addOrUpdateEmployee(employeeData: Omit<Employee, 'createdAt' | 'history'>) {
    this.http.post<Employee>(this.apiUrl, employeeData)
      .subscribe(savedEmployee => {
        this.employeesSignal.update(employees => {
          const existingIndex = employees.findIndex(e => e.pesel === savedEmployee.pesel);
          if (existingIndex !== -1) {
            const updatedEmployees = [...employees];
            updatedEmployees[existingIndex] = savedEmployee;
            return updatedEmployees;
          }
          return [savedEmployee, ...employees];
        });
      });
  }

  override getEmployeeByPesel(pesel: string): Employee | undefined {
    return this.employeesSignal().find(e => e.pesel === pesel);
  }
}
