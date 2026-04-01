import { Injectable, Signal } from '@angular/core';
import { Employee } from '../employee';

@Injectable({
  providedIn: 'root'
})
export abstract class EmployeeService {
  abstract readonly employees: Signal<Employee[]>;

  abstract addOrUpdateEmployee(employeeData: Omit<Employee, 'createdAt'>): void;

  abstract getEmployeeByPesel(pesel: string): Employee | undefined;
}
