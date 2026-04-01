import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DraftService } from './service/draft.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-draft-list',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="card shadow-lg border-0 rounded-4 fade-in">
      <div class="card-body p-sm-5 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold text-primary mb-0"><i class="bi bi-pencil-square me-2"></i>Szkice umów</h2>
          <span class="badge bg-primary rounded-pill px-3 py-2 fs-6">{{ drafts().length }} łącznie</span>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th scope="col">Ostatnia edycja</th>
                <th scope="col">Identyfikator</th>
                <th scope="col">Dane wariantu</th>
                <th scope="col">Postęp kroków</th>
                <th scope="col" class="text-end">Akcje</th>
              </tr>
            </thead>
            <tbody>
              @for (draft of drafts(); track draft.id) {
              <tr class="contract-row">
                <td class="text-muted"><small>{{ draft.lastUpdated | date:'dd.MM.yyyy HH:mm' }}</small></td>
                <td><small class="text-monospace text-muted">{{ draft.id }}</small></td>
                <td>
                  <div class="fw-semibold">{{ draft.formData?.personalData?.firstName || 'Brak danych' }} {{ draft.formData?.personalData?.lastName || '' }}</div>
                  @if (draft.formData?.personalData?.pesel) {
                    <div class="text-muted small">PESEL: {{ draft.formData.personalData.pesel }}</div>
                  }
                </td>
                <td>
                  <span class="badge" [class.bg-warning]="draft.currentStep < 6" [class.bg-success]="draft.currentStep === 6" [class.text-dark]="draft.currentStep < 6">
                    Krok {{ draft.currentStep }} z 6
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" (click)="resumeDraft(draft.id)">
                    <i class="bi bi-play-fill me-1"></i>Wznów
                  </button>
                  <button class="btn btn-sm btn-outline-danger rounded-circle" (click)="deleteDraft(draft.id)" title="Usuń szkic">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="bi bi-file-earmark-x fs-1 d-block mb-3 opacity-50"></i>
                  Nie masz żadnych niedokończonych szkiców.
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.4s ease-in-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .table > :not(caption) > * > * { padding: 1rem 0.75rem; }
    .contract-row { transition: background-color 0.2s; }
    .contract-row:hover { background-color: var(--bs-light) !important; }
  `]
})
export class DraftListComponent {
  private draftService = inject(DraftService);
  private router = inject(Router);

  drafts = this.draftService.drafts;

  resumeDraft(id: string) {
    this.router.navigate(['/nowa-umowa'], { queryParams: { draftId: id } });
  }

  deleteDraft(id: string) {
    if (confirm('Czy na pewno chcesz usunąć ten szkic? Operacji nie można cofnąć.')) {
      this.draftService.deleteDraft(id);
    }
  }
}
