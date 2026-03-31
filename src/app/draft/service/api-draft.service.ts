import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DraftService } from '../../draft/service/draft.service';
import { ContractDraft } from '../draft';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiDraftService extends DraftService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/drafts';

  private draftsSignal = signal<ContractDraft[]>([]);

  override readonly drafts = this.draftsSignal.asReadonly();

  constructor() {
    super();
    this.loadDrafts();
  }

  private loadDrafts() {
    this.http.get<ContractDraft[]>(this.apiUrl)
      .subscribe({
        next: (data) => this.draftsSignal.set(data),
        error: (err) => console.error('Failed to load drafts', err)
      });
  }

  override saveDraft(id: string, formData: any, currentStep: number): void {
    const draft: ContractDraft = {
      id,
      lastUpdated: new Date().toISOString(),
      currentStep,
      formData
    };

    const existing = this.draftsSignal().find(d => d.id === id);

    if (existing) {
      this.http.put<ContractDraft>(`${this.apiUrl}/${id}`, draft)
        .subscribe({
          next: (updated) => this.draftsSignal.update(list => list.map(d => d.id === id ? updated : d)),
          error: (err) => console.error('Failed to update draft', err)
        });
    } else {
      this.http.post<ContractDraft>(this.apiUrl, draft)
        .subscribe({
          next: (newDraft) => this.draftsSignal.update(list => [newDraft, ...list]),
          error: (err) => console.error('Failed to save new draft', err)
        });
    }
  }

  override getDraftById(id: string): ContractDraft | undefined {
    return this.draftsSignal().find(d => d.id === id);
  }

  override deleteDraft(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe({
        next: () => this.draftsSignal.update(list => list.filter(d => d.id !== id)),
        error: (err) => console.error('Failed to delete draft', err)
      });
  }
}
