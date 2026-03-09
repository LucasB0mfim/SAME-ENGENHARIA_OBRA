import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ApproverService } from '../../../core/services/approver.service';

export interface ApproverItem {
  MATERIAL: string;
  QUANTIDADE: string | number;
  UNIDADE: string;
}

export interface ApproverRequest {
  OC: string;
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
  selector: 'app-approver-oc',
  imports: [CommonModule],
  templateUrl: './approver-oc.component.html',
  styleUrl: './approver-oc.component.scss'
})
export class ApproverOcComponent implements OnInit {
  requests: ApproverRequest[] = [];
  expandedId: string | null = null;

  /** Exibe o overlay de tela cheia no carregamento inicial */
  isLoading = false;

  /** OC do card cuja aprovação está em andamento */
  approvingOc: string | null = null;

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

    this.approverService.findByContract().subscribe({
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

  toggle(oc: string): void {
    if (this.approvingOc) return;
    this.expandedId = this.expandedId === oc ? null : oc;
  }

  goBack(): void {
    this.location.back();
  }

  approve(id: string, movimento: string, event: Event): void {
    event.stopPropagation();
    if (this.approvingOc) return;

    this.approvingOc = id;
    const request = {
      id: id,
      movimento: movimento,
    };

    this.approverService.approve(request).subscribe({
      next: (response: { success: boolean; message: string }) => {
        this.approvingOc = null;
        this.expandedId = null;
        this.feedback = {
          status: 'success',
          message: response?.message ?? 'Solicitação aprovada com sucesso!',
        };
        this.loadRequests();
      },
      error: (err) => {
        console.error(`Erro ao aprovar solicitação ${id}:`, err);
        this.approvingOc = null;
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
