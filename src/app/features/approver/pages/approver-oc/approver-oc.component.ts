import { forkJoin, finalize } from 'rxjs';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApproverService } from '../../../../core/services/approver.service';

@Component({
  selector: 'app-approver-oc',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './approver-oc.component.html',
  styleUrl: './approver-oc.component.scss'
})
export class ApproverOcComponent implements OnInit {
  requests: any[] = [];
  expandedId: string | null = null;

  isLoading: boolean = false;
  approvingOc: string | null = null;
  feedback: { status: string; message: string; ids?: string[] } | null = null;

  selectedOcs: Set<string> = new Set();
  isBatchApproving: boolean = false;

  constructor(
    private approverService: ApproverService
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.selectedOcs = new Set();

    this.approverService.findByOC()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.requests = res.result;
        },
        error: (err) => {
          this.setFeedback('error', err.error.message);
        },
      });
  }

  toggle(oc: string): void {
    if (this.approvingOc) return;
    this.expandedId = this.expandedId === oc ? null : oc;
  }

  approve(id: string, movimento: string, event: Event): void {
    event.stopPropagation();
    if (this.approvingOc) return;

    this.approvingOc = id;

    this.approverService.approve({ id, movimento })
      .pipe(finalize(() => (
        this.loadRequests(),
        this.approvingOc = null
      )))
      .subscribe({
        next: (res) => {
          this.expandedId = null;
          this.setFeedback('success', res.message, [id]);
        },
        error: (err) => {
          console.error(err);
          this.setFeedback('error', 'Não foi possível aprovar a solicitação.');
        },
      });
  }

  approveGroup(): void {
    if (this.isBatchApproving || this.selectedOcs.size < 2) return;

    this.isBatchApproving = true;

    const approvals$ = Array.from(this.selectedOcs).map(oc => {
      const req = this.requests.find(r => r.OC === oc);
      return this.approverService.approve({ id: oc, movimento: req.MOVIMENTO });
    });

    forkJoin(approvals$)
      .pipe(finalize(() => {
        this.isBatchApproving = false;
        this.loadRequests();
      }))
      .subscribe({
        next: (responses) => {
          this.expandedId = null;
          this.setFeedback('success', `${responses.length} solicitações aprovadas com sucesso!`, Array.from(this.selectedOcs));
        },
        error: (err) => {
          console.error(err);
          this.setFeedback('error', 'Não foi possível aprovar as solicitações.');
        },
      });
  }

  toggleSelection(oc: string, event: Event): void {
    event.stopPropagation();
    if (this.approvingOc || this.isBatchApproving) return;
    this.selectedOcs.has(oc) ? this.selectedOcs.delete(oc) : this.selectedOcs.add(oc);
    this.selectedOcs = new Set(this.selectedOcs);
  }

  isSelected(oc: string): boolean {
    return this.selectedOcs.has(oc);
  }

  get selectedCount(): number {
    return this.selectedOcs.size;
  }

  setFeedback(status: string, message: string, ids?: string[]): void {
    this.feedback = { status, message, ids };
  }

  copyFeedbackIds(): void {
    if (!this.feedback?.ids) return;
    navigator.clipboard.writeText(this.feedback.ids.join('\n'));
  }

  closeFeedback(): void {
    this.feedback = null;
  }

  formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  getTotalValue(items: any[]): string {
    const total = items.reduce((sum, item) => sum + (+item.QUANTIDADE * +item.PRECO_UNITARIO), 0);
    return this.formatBRL(total);
  }

  getItemTotal(item: any): string {
    return this.formatBRL(+item.QUANTIDADE * +item.PRECO_UNITARIO);
  }
}
