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
      contractType: 'zlecenie',
      rate: 5000,
      startDate: '2026-04-01',
      endDate: '2026-12-31',
      createdAt: new Date().toISOString()
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
      contractType: 'dzielo',
      rate: 8500,
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
