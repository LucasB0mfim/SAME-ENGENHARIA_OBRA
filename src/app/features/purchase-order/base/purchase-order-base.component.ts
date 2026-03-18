import { Directive, OnInit } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { FeedbackType } from '../../../shared/components/toast/toast.component';
import { ApproverService } from '../../../core/services/approver.service';

@Directive()
export abstract class PurchaseOrderBaseComponent implements OnInit {

  requests: any[] = [];
  selectCard: string | null = null;
  listedCards = new Map<string, string>();

  isLoading = false;
  isApproving = false;
  isFiltered = false;

  searchTerm = '';
  dateFilter: { start: string, end: string } = { start: '', end: '' };

  feedback: { visible: boolean, type: FeedbackType, message: string } = {
    visible: false,
    type: 'success',
    message: ''
  };

  // ─── Obrigatório implementar ──────────────────────────────
  abstract get idKey(): string;
  abstract loadRequests(): void;

  constructor(protected readonly approverService: ApproverService) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  // ─── Lógica compartilhada ─────────────────────────────────
  toggleCard(id: string): void {
    this.selectCard = this.selectCard === id ? null : id;
  }

  listCard(card: any, event: Event): void {
    event.stopPropagation();
    const key = card[this.idKey];
    if (this.listedCards.has(key)) {
      this.listedCards.delete(key);
    } else {
      this.listedCards.set(key, card.MOVIMENTO);
    }
  }

  isSelected(card: any): boolean {
    return this.listedCards.has(card[this.idKey]);
  }

  approve(req: any): void {
    this.isApproving = true;
    this.approverService.approve({ id: req[this.idKey], movimento: req.MOVIMENTO })
      .pipe(finalize(() => { this.isApproving = false; this.loadRequests(); }))
      .subscribe({
        next: () => { this.selectCard = null; this.showFeedback('success', 'Solicitação aprovada com sucesso!'); },
        error: () => this.showFeedback('error', 'Erro ao aprovar. Tente novamente mais tarde.')
      });
  }

  approveGroup(): void {
    this.isApproving = true;
    const requests = Array.from(this.listedCards.entries()).map(([id, movimento]) =>
      this.approverService.approve({ id, movimento })
    );
    forkJoin(requests)
      .pipe(finalize(() => { this.isApproving = false; this.listedCards.clear(); this.loadRequests(); }))
      .subscribe({
        next: () => { this.selectCard = null; this.showFeedback('success', 'Solicitações aprovadas com sucesso!'); },
        error: () => this.showFeedback('error', 'Erro ao aprovar. Tente novamente mais tarde.')
      });
  }

  clearGroup(): void {
    this.listedCards.clear();
  }

  toggleFilter(): void {
    this.isFiltered = !this.isFiltered;
  }

  clearFilter(): void {
    this.dateFilter = { start: '', end: '' };
    this.isFiltered = false;
  }

  showFeedback(type: FeedbackType, message: string): void {
    this.feedback = { visible: true, type, message };
  }

  closeFeedback(): void {
    this.feedback.visible = false;
  }

  totalPrice(items: any[]): number {
    return items.reduce((acc: number, item: any) =>
      acc + (+item.QUANTIDADE * +item.PRECO_UNITARIO), 0);
  }

  itemPrice(item: any): number {
    return +item.QUANTIDADE * +item.PRECO_UNITARIO || 0;
  }

  get filteredRequests(): any[] {
    let result = this.requests;

    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter(req =>
        req[this.idKey]?.toLowerCase().includes(term) ||
        req.FORNECEDOR?.toLowerCase().includes(term) ||
        req.CENTRO_CUSTO?.toLowerCase().includes(term) ||
        req.USUARIO_CRIACAO?.toLowerCase().includes(term)
      );
    }

    if (this.dateFilter.start) {
      const start = new Date(this.dateFilter.start);
      result = result.filter(req => new Date(req.DATA_EMISSAO) >= start);
    }

    if (this.dateFilter.end) {
      const end = new Date(this.dateFilter.end);
      result = result.filter(req => new Date(req.DATA_EMISSAO) <= end);
    }

    return result;
  }
}