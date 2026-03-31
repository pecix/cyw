import { Injectable, signal } from '@angular/core';
import { DraftService } from './draft.service';
import { ContractDraft } from '../draft';

@Injectable({
  providedIn: 'root'
})
export class MockDraftService extends DraftService {
  private initialDrafts: ContractDraft[] = [
    {
      id: 'mock-draft-1',
      lastUpdated: new Date().toISOString(),
      currentStep: 3,
      formData: {
        personalData: {
          firstName: 'Jan',
          lastName: 'Przykładowy',
          pesel: '88082100000',
          birthDate: '1988-08-21'
        },
        addressData: {
          street: 'Testowa',
          houseNumber: '1',
          zipCode: '00-001',
          city: 'Warszawa'
        }
      }
    }
  ];

  private draftsSignal = signal<ContractDraft[]>(this.initialDrafts);

  override readonly drafts = this.draftsSignal.asReadonly();

  override saveDraft(id: string, formData: any, currentStep: number): void {
    const drafts = this.draftsSignal();
    const existingIndex = drafts.findIndex(d => d.id === id);

    const draft: ContractDraft = {
      id,
      lastUpdated: new Date().toISOString(),
      currentStep,
      formData
    };

    if (existingIndex > -1) {
      this.draftsSignal.update(list => list.map(d => d.id === id ? draft : d));
    } else {
      this.draftsSignal.update(list => [draft, ...list]);
    }
  }

  override getDraftById(id: string): ContractDraft | undefined {
    return this.draftsSignal().find(d => d.id === id);
  }

  override deleteDraft(id: string): void {
    this.draftsSignal.update(list => list.filter(d => d.id !== id));
  }
}
