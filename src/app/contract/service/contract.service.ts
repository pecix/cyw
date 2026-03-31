import { Injectable, Signal } from '@angular/core';
import { Contract } from '../contract';

@Injectable({
  providedIn: 'root'
})
export abstract class ContractService {
  abstract readonly contracts: Signal<Contract[]>;

  abstract addContract(contractData: Omit<Contract, 'id' | 'createdAt'>): void;

  abstract getContractById(id: string): Contract | undefined;
}
