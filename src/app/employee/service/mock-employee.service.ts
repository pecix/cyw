import { Injectable, signal } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeHistoryEntry } from '../employee';

@Injectable({
  providedIn: 'root'
})
export class MockEmployeeService extends EmployeeService {
  private initialEmployees: Employee[] = [
    {
      firstName: 'Jan',
      lastName: 'Kowalski',
      pesel: '80010112345',
      birthDate: '1980-01-01',
      street: 'Kwiatowa',
      houseNumber: '1',
      zipCode: '00-001',
      city: 'Warszawa',
      createdAt: new Date().toISOString()
    },
    {
      firstName: 'Anna',
      lastName: 'Nowak',
      pesel: '90020254321',
      birthDate: '1990-02-02',
      street: 'Słoneczna',
      houseNumber: '5A',
      zipCode: '31-002',
      city: 'Kraków',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  private employeesSignal = signal<Employee[]>(this.initialEmployees);

  override readonly employees = this.employeesSignal.asReadonly();

  override addOrUpdateEmployee(employeeData: Omit<Employee, 'createdAt' | 'history'>) {
    this.employeesSignal.update(employees => {
      const existingIndex = employees.findIndex(e => e.pesel === employeeData.pesel);
      
      if (existingIndex !== -1) {
        const existing = employees[existingIndex];
        const diffs: EmployeeHistoryEntry[] = [];
        const now = new Date().toISOString();

        if (employeeData.bankAccount !== undefined && existing.bankAccount !== employeeData.bankAccount) {
          diffs.push({
            date: now,
            field: 'Konto bankowe',
            oldValue: existing.bankAccount || 'Brak',
            newValue: employeeData.bankAccount || 'Brak'
          });
        }

        const oldAddress = `${existing.street} ${existing.houseNumber}${existing.apartmentNumber ? '/' + existing.apartmentNumber : ''}, ${existing.zipCode} ${existing.city}`;
        const newAddress = `${employeeData.street} ${employeeData.houseNumber}${employeeData.apartmentNumber ? '/' + employeeData.apartmentNumber : ''}, ${employeeData.zipCode} ${employeeData.city}`;

        if (oldAddress !== newAddress) {
          diffs.push({
            date: now,
            field: 'Adres korespondencyjny',
            oldValue: oldAddress,
            newValue: newAddress
          });
        }

        const updatedEmployees = [...employees];
        updatedEmployees[existingIndex] = {
          ...existing,
          ...employeeData,
          history: [...(existing.history || []), ...diffs]
        };
        return updatedEmployees;
      } else {
        const newEmployee: Employee = {
          ...employeeData,
          createdAt: new Date().toISOString()
        };
        return [newEmployee, ...employees];
      }
    });
  }

  override getEmployeeByPesel(pesel: string): Employee | undefined {
    return this.employeesSignal().find(e => e.pesel === pesel);
  }
}
