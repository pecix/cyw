import { TestBed } from '@angular/core/testing';
import { MockContractService } from './mock-contract.service';
import { Contract } from '../contract';

describe('MockContractService', () => {
  let service: MockContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockContractService]
    });
    service = TestBed.inject(MockContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial contracts', () => {
    const contracts = service.contracts();
    expect(contracts.length).toBe(2);
    expect(contracts[0].firstName).toBe('Jan');
    expect(contracts[1].firstName).toBe('Anna');
  });

  it('should add a new contract', () => {
    const initialCount = service.contracts().length;
    const newContractData: Omit<Contract, 'id' | 'createdAt'> = {
      firstName: 'Piotr',
      lastName: 'Zieliński',
      pesel: '95030311111',
      birthDate: '1995-03-03',
      street: 'Polna',
      houseNumber: '10',
      zipCode: '00-002',
      city: 'Gdańsk',
      contractType: 'zlecenie',
      rate: 4500,
      startDate: '2026-06-01',
      endDate: '2026-12-31'
    };

    service.addContract(newContractData);

    const contracts = service.contracts();
    expect(contracts.length).toBe(initialCount + 1);
    expect(contracts[0].firstName).toBe('Piotr');
    expect(contracts[0].id).toBeDefined();
    expect(contracts[0].createdAt).toBeDefined();
  });

  it('should get contract by id', () => {
    const contract = service.getContractById('1');
    expect(contract).toBeDefined();
    expect(contract?.firstName).toBe('Jan');
  });

  it('should return undefined for non-existent contract id', () => {
    const contract = service.getContractById('non-existent');
    expect(contract).toBeUndefined();
  });
});
