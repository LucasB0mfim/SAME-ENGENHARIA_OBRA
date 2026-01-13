import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  DynamicDisplayComponent,
  DynamicField,
  ActionEvent,
  ModalType
} from '../../../components/dynamic-display/dynamic-display.component';

import { EquipmentService } from '../../../core/services/equipment.service';

// ========================================
// INTERFACES
// ========================================

interface Equipment {
  id: string;
  nome: string;
  origem: string;
  destino: string;
  foto?: string;
  qr_code?: string;
  criado_em: string;
  atualizado_em: string;
}

@Component({
  selector: 'app-equipament-list',
  standalone: true,
  imports: [
    CommonModule,
    DynamicDisplayComponent,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EquipamentListComponent implements OnInit {
  // ========================================
  // PROPRIEDADES
  // ========================================

  apiData: Equipment[] = [];

  // Estados de UI
  isEmpty = false;
  isLoading = true;

  modalState: ModalType = ModalType.IDLE;
  modalMessage = '';

  // Configuração dos campos
  readonly fields: DynamicField[] = [
    // Campos visíveis no card
    {
      label: 'Equipamento',
      name: 'nome',
      type: 'title',
      style: 'card'
    },
    {
      label: 'Destino',
      name: 'destino',
      type: 'text',
      style: 'card'
    },
    {
      label: 'Última atualização',
      name: 'atualizado_em',
      type: 'date',
      style: 'card'
    },

    // Campos visíveis no bottom sheet
    {
      label: 'Nome',
      name: 'nome',
      type: 'title',
      style: 'bottomSheet'
    },
    {
      label: 'Origem',
      name: 'origem',
      type: 'title',
      style: 'bottomSheet'
    },
    {
      label: 'Destino',
      name: 'destino',
      type: 'title',
      style: 'bottomSheet'
    },
    {
      label: 'Dia do cadastro',
      name: 'criado_em',
      type: 'date',
      style: 'bottomSheet'
    },
    {
      label: 'Última Atualização',
      name: 'atualizado_em',
      type: 'date',
      style: 'bottomSheet'
    },

    // Botões de ação
    {
      name: 'Baixar QR Code',
      type: 'button',
      style: 'bottomSheet',
      action: 'downloadQRCode'
    },
    {
      name: 'Copiar ID',
      type: 'button',
      style: 'bottomSheet',
      action: 'copyID'
    }
  ];

  constructor(
    private readonly router: Router,
    private readonly equipmentService: EquipmentService
  ) { }

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    this.loadEquipments();
  }

  // ========================================
  // MÉTODOS DE CARREGAMENTO DE DADOS
  // ========================================

  private loadEquipments(): void {
    this.equipmentService
      .findAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.apiData = res.result;
          this.isEmpty = this.apiData.length === 0;
        },
        error: (error) => {
          console.error('Erro ao carregar equipamentos:', error);
          this.isEmpty = true;
        }
      });
  }

  // ========================================
  // HANDLERS DE EVENTOS
  // ========================================

  onActionClick(event: ActionEvent<Equipment>): void {
    switch (event.action) {
      case 'downloadQRCode':
        this.downloadQRCode(event.item);
        break;
      case 'copyID':
        this.copyID(event.item);
        break;
      default:
        console.warn(`Ação desconhecida: ${event.action}`);
    }
  }

  onNavigationBack(): void {
    this.router.navigate(['/dashboard/home']);
  }

  onModalClose(): void {
    this.modalState = ModalType.IDLE;
    this.modalMessage = '';
  }

  // ========================================
  // LÓGICA DE NEGÓCIO
  // ========================================

  private async downloadQRCode(equipment: Equipment): Promise<void> {
    if (!equipment.qr_code) {
      alert('Equipamento sem QR Code!');
      return;
    }

    try {
      const response = await fetch(equipment.qr_code);

      if (!response.ok) {
        throw new Error('Erro ao buscar o QR Code');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `QRCODE_${equipment.nome}.png`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download do QR Code:', error);
      alert('Não foi possível fazer o download do QR Code.');
    }
  }

  private copyID(equipment: Equipment): void {
    if (!equipment.id) {
      alert('Equipamento sem ID!');
      return;
    }

    this.modalState = ModalType.LOADING;
    this.modalMessage = 'Processando solicitação...';

    navigator.clipboard.writeText(equipment.id)
      .then(() => {
        this.showSuccessModal('ID do equipamento copiado com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao copiar ID:', error);
        this.showErrorModal('Não foi possível copiar o ID do equipamento');
      });
  }

  // ========================================
  // MÉTODOS AUXILIARES
  // ========================================

  private showSuccessModal(message: string): void {
    this.modalState = ModalType.SUCCESS;
    this.modalMessage = message;
  }

  private showErrorModal(message: string): void {
    this.modalState = ModalType.ERROR;
    this.modalMessage = message;
  }
}
