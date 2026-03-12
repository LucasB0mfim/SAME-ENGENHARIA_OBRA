import { forkJoin, finalize } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApproverService } from '../../../core/services/approver.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-approver-id',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './approver-id.component.html',
  styleUrl: './approver-id.component.scss',
})
export class ApproverIdComponent implements OnInit {
  requests: any[] = [];
  isLoading: boolean = false;
  expandedId: string | null = null;
  approvingId: string | null = null;
  feedback: { status: string; message: string; ids?: string[] } | null = null;

  selectedIds: Set<string> = new Set();
  isBatchApproving: boolean = false;

  constructor(
    private approverService: ApproverService
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.selectedIds = new Set();
    this.approverService.findByID()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.requests = res.result;
        },
        error: (err) => {
          this.setFeedback('error', err?.error?.message);
        }
      });
  }

  approve(id: string, movimento: string, event: Event): void {
    event.stopPropagation();
    if (this.approvingId) return;

    this.approvingId = id;

    this.approverService.approve({ id, movimento })
      .pipe(finalize(() => (
        this.approvingId = null,
        this.loadRequests()
      )))
      .subscribe({
        next: (res) => {
          this.expandedId = null;
          this.setFeedback('success', res?.message, [id]);
        },
        error: (err) => {
          this.setFeedback('error', err?.error?.message);
        }
      });
  }

  approveGroup(): void {
    if (this.isBatchApproving || this.selectedIds.size < 2) return;

    this.isBatchApproving = true;

    const approvals$ = Array.from(this.selectedIds).map(id => {
      const req = this.requests.find(r => r.ID === id);
      return this.approverService.approve({ id, movimento: req.MOVIMENTO });
    });

    forkJoin(approvals$)
      .pipe(finalize(() => {
        this.isBatchApproving = false;
        this.loadRequests();
      }))
      .subscribe({
        next: (responses) => {
          this.expandedId = null;
          this.setFeedback('success', `${responses.length} solicitações aprovadas com sucesso!`, Array.from(this.selectedIds));
        },
        error: (err) => {
          this.setFeedback('error', err?.error?.message ?? 'Não foi possível aprovar as solicitações.');
        }
      });
  }

  toggleSelection(id: string, event: Event): void {
    event.stopPropagation();
    if (this.approvingId || this.isBatchApproving) return;
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
    this.selectedIds = new Set(this.selectedIds);
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  setFeedback(status: string, message: string, ids?: string[]): void {
    this.feedback = { status, message, ids };
  }

  copyFeedbackIds(): void {
    if (!this.feedback?.ids) return;
    navigator.clipboard.writeText(this.feedback.ids.join('\n'));
  }

  toggle(id: string): void {
    if (this.approvingId) return;
    this.expandedId = this.expandedId === id ? null : id;
  }

  closeFeedback(): void {
    this.feedback = null;
  }
}