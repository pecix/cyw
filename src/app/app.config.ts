import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ContractService } from './contract/service/contract.service';
import { MockContractService } from './contract/service/mock-contract.service';
import { ApiContractService } from './contract/service/api-contract.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    {
      provide: ContractService,
      useClass: environment.useMock ? MockContractService : ApiContractService
    }
  ]
};
