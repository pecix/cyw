import { Signal } from '@angular/core';
import { ContractDraft } from '../draft';

export abstract class DraftService {
  abstract readonly drafts: Signal<ContractDraft[]>;

  abstract saveDraft(id: string, formData: any, currentStep: number): void;
  abstract getDraftById(id: string): ContractDraft | undefined;
  abstract deleteDraft(id: string): void;
}
