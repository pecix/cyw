import { Injectable, Signal } from '@angular/core';

export interface Contract {
  id: string;
  firstName: string;
  lastName: string;
  pesel: string;
  birthDate: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  contractType: string;
  rate: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export abstract class ContractService {
  abstract readonly contracts: Signal<Contract[]>;

  abstract addContract(contractData: Omit<Contract, 'id' | 'createdAt'>): void;

  abstract getContractById(id: string): Contract | undefined;
}
