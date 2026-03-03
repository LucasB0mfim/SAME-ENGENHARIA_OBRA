import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ApproverService } from '../../../core/services/approver.service';

export interface ApproverItem {
  MATERIAL: string;
  QUANTIDADE: string | number;
  UNIDADE: string;
}

export interface ApproverRequest {
  ID: string;
  USUARIO_CRIACAO: string;
  CENTRO_CUSTO: string;
  DATA_EMISSAO: string | Date;
  MOVIMENTO: string;
  OBSERVACAO?: string;
  ITEMS: ApproverItem[];
}

export type FeedbackStatus = 'success' | 'error';

export interface FeedbackState {
  status: FeedbackStatus;
  message: string;
}

@Component({
  selector: 'app-approver-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approver-id.component.html',
  styleUrl: './approver-id.component.scss',
})
export class ApproverIdComponent implements OnInit {
  requests: ApproverRequest[] = [];
  expandedId: string | null = null;

  /** Exibe o overlay de tela cheia no carregamento inicial */
  isLoading = false;

  /** ID do card cuja aprovação está em andamento */
  approvingId: string | null = null;

  /** Estado do modal de feedback (sucesso / erro) */
  feedback: FeedbackState | null = null;

  constructor(
    private approverService: ApproverService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;

    this.approverService.findByID().subscribe({
      next: (response: { success: boolean; message: string; result: ApproverRequest[] }) => {
        this.requests = response.result;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar solicitações:', err);
        this.isLoading = false;
        this.feedback = {
          status: 'error',
          message: err?.error?.message ?? 'Não foi possível carregar as solicitações.',
        };
      },
    });
  }

  toggle(id: string): void {
    if (this.approvingId) return;
    this.expandedId = this.expandedId === id ? null : id;
  }

  goBack(): void {
    this.location.back();
  }

  approve(id: string, event: Event): void {
    event.stopPropagation();
    if (this.approvingId) return;

    this.approvingId = id;

    this.approverService.approveByID(id).subscribe({
      next: (response: { success: boolean; message: string }) => {
        this.requests = this.requests.filter((req) => req.ID !== id);
        if (this.expandedId === id) this.expandedId = null;
        this.approvingId = null;
        this.feedback = {
          status: 'success',
          message: response?.message ?? 'Solicitação aprovada com sucesso!',
        };
        this.loadRequests();
      },
      error: (err) => {
        console.error(`Erro ao aprovar solicitação ${id}:`, err);
        this.approvingId = null;
        this.feedback = {
          status: 'error',
          message: err?.error?.message ?? 'Não foi possível aprovar a solicitação.',
        };
      },
    });
  }

  closeFeedback(): void {
    this.feedback = null;
  }
}
