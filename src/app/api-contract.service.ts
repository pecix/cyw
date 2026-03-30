import { Injectable, signal, Signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contract, ContractService } from './contract.service';
import { environment } from '../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiContractService extends ContractService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/contracts';

  private contractsSignal = signal<Contract[]>([]);

  // Expose as readonly signal
  override readonly contracts = this.contractsSignal.asReadonly();

  constructor() {
    super();
    this.loadContracts();
  }

  private loadContracts() {
    this.http.get<Contract[]>(this.apiUrl)
      .subscribe(data => this.contractsSignal.set(data));
  }

  override addContract(contractData: Omit<Contract, 'id' | 'createdAt'>) {
    this.http.post<Contract>(this.apiUrl, contractData)
      .subscribe(newContract => {
        this.contractsSignal.update(contracts => [newContract, ...contracts]);
      });
  }

  override getContractById(id: string): Contract | undefined {
    return this.contractsSignal().find(c => c.id === id);
  }
}
