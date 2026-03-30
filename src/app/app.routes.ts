import { Routes } from '@angular/router';
import { ContractFormComponent } from './contract/contract-form.component';
import { HomeComponent } from './home.component';
import { ContractListComponent } from './contract/contract-list.component';
import { ContractDetailsComponent } from './contract/contract-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'nowa-umowa', component: ContractFormComponent },
  { path: 'umowy', component: ContractListComponent },
  { path: 'umowy/:id', component: ContractDetailsComponent }
];
