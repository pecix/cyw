import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiContractService } from './api-contract.service';
import { Contract } from '../contract';
import { environment } from '../../../environments/environment';

describe('ApiContractService', () => {
  let service: ApiContractService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/contracts';

  const mockContracts: Contract[] = [
    {
      id: '1',
      firstName: 'Jan',
      lastName: 'Kowalski',
      pesel: '12345678901',
      birthDate: '1980-01-01',
      street: 'Polna',
      houseNumber: '1',
      zipCode: '00-001',
      city: 'Warszawa',
      contractType: 'zlecenie',
      rate: 5000,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      createdAt: '2026-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApiContractService
      ]
    });
    service = TestBed.inject(ApiContractService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created and load initial contracts', () => {
    // Because ApiContractService calls loadContracts in constructor,
    // we need to handle that request immediately.
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockContracts);

    expect(service).toBeTruthy();
    expect(service.contracts()).toEqual(mockContracts);
  });

  it('should add a new contract', () => {
    // Handle initial load first
    const initialReq = httpMock.expectOne(apiUrl);
    initialReq.flush(mockContracts);

    const newContractData: Omit<Contract, 'id' | 'createdAt'> = {
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
      endDate: '2026-08-31'
    };

    const createdContract: Contract = {
      ...newContractData,
      id: '123',
      createdAt: new Date().toISOString()
    };

    service.addContract(newContractData);

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newContractData);
    req.flush(createdContract);

    const contracts = service.contracts();
    expect(contracts[0]).toEqual(createdContract);
    expect(contracts.length).toBe(2);
  });

  it('should get contract by id', () => {
    // Handle initial load first
    const initialReq = httpMock.expectOne(apiUrl);
    initialReq.flush(mockContracts);

    const contract = service.getContractById('1');
    expect(contract).toBeDefined();
    expect(contract?.id).toBe('1');
  });
});
