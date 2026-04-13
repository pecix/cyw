import { Injectable, signal } from '@angular/core';
import { ContractService } from './contract.service';
import { Contract } from '../contract';

@Injectable({
  providedIn: 'root'
})
export class MockContractService extends ContractService {
  private initialContracts: Contract[] = [
    {
      id: '1',
      firstName: 'Jan',
      lastName: 'Kowalski',
      pesel: '80010112345',
      birthDate: '1980-01-01',
      street: 'Kwiatowa',
      houseNumber: '1',
      zipCode: '00-001',
      city: 'Warszawa',
      contractType: 'okres_probny',
      conclusionDate: '2026-03-31',
      legalBasis: 'rozporzadzenie_rm',
      department: 'Informatyki',
      position: 'Referent',
      workingTime: 1.0,
      workplace: 'Warszawa',
      rateCategory: 'IX',
      rate: 5000,
      seniorityAllowance: 10,
      functionalAllowanceCategory: '2',
      functionalAllowance: 500,
      startDate: '2026-04-01',
      endDate: '2026-12-31',
      createdAt: new Date().toISOString()
    },
    {
      id: '1a',
      firstName: 'Jan',
      lastName: 'Kowalski',
      pesel: '80010112345',
      birthDate: '1980-01-01',
      street: 'Kwiatowa',
      houseNumber: '1',
      zipCode: '00-001',
      city: 'Warszawa',
      contractType: 'czas_okreslony',
      conclusionDate: '2025-01-01',
      legalBasis: 'rozporzadzenie_rm',
      department: 'Kadrowy',
      position: 'Referent',
      workingTime: 1.0,
      workplace: 'Warszawa',
      rateCategory: 'I',
      rate: 4500,
      seniorityAllowance: 10,
      functionalAllowanceCategory: '1',
      functionalAllowance: 200,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      createdAt: new Date(Date.now() - 100000000).toISOString()
    },
    {
      id: '2',
      firstName: 'Anna',
      lastName: 'Nowak',
      pesel: '90020254321',
      birthDate: '1990-02-02',
      street: 'Słoneczna',
      houseNumber: '5A',
      zipCode: '31-002',
      city: 'Kraków',
      contractType: 'czas_okreslony',
      conclusionDate: '2026-04-05',
      legalBasis: 'rozporzadzenie_ms',
      department: 'Finansowy',
      position: 'Technik',
      workingTime: 0.5,
      workplace: 'Zdalnie',
      rateCategory: 'XX',
      rate: 8500,
      seniorityAllowance: 0,
      functionalAllowanceCategory: 'none',
      functionalAllowance: 0,
      startDate: '2026-05-01',
      endDate: '2026-08-31',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  private contractsSignal = signal<Contract[]>(this.initialContracts);

  override readonly contracts = this.contractsSignal.asReadonly();

  override addContract(contractData: Omit<Contract, 'id' | 'createdAt'>) {
    const newContract: Contract = {
      ...contractData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    this.contractsSignal.update(contracts => [newContract, ...contracts]);
  }

  override getContractById(id: string): Contract | undefined {
    return this.contractsSignal().find(c => c.id === id);
  }
}
