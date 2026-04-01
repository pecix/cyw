import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ContractService } from './contract/service/contract.service';
import { MockContractService } from './contract/service/mock-contract.service';
import { ApiContractService } from './contract/service/api-contract.service';
import { DraftService } from './draft/service/draft.service';
import { MockDraftService } from './draft/service/mock-draft.service';
import { ApiDraftService } from './draft/service/api-draft.service';
import { EmployeeService } from './employee/service/employee.service';
import { MockEmployeeService } from './employee/service/mock-employee.service';
import { ApiEmployeeService } from './employee/service/api-employee.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    {
      provide: ContractService,
      useClass: environment.useMock ? MockContractService : ApiContractService
    },
    {
      provide: DraftService,
      useClass: environment.useMock ? MockDraftService : ApiDraftService
    },
    {
      provide: EmployeeService,
      useClass: environment.useMock ? MockEmployeeService : ApiEmployeeService
    }
  ]
};
