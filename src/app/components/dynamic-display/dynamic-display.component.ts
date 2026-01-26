import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

// ========================================
// INTERFACES E TYPES
// ========================================

type BaseField = {
  style: 'card' | 'bottomSheet';
};

type DataField = BaseField & {
  type: 'title' | 'text' | 'date';
  label: string;
  name: string;
};

type ButtonField = BaseField & {
  type: 'button';
  name: string;
  action: string;
};

export type DynamicField = DataField | ButtonField;

export type ClickHandleType = 'bottomSheet' | 'navigation' | 'none';

export interface CardClickConfig {
  type: ClickHandleType;
}

export interface ActionEvent<T = any> {
  action: string;
  item: T;
}

export enum ModalType {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// ========================================
// COMPONENTE
// ========================================

@Component({
  selector: 'app-dynamic-display',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dynamic-display.component.html',
  styleUrl: './dynamic-display.component.scss'
})
export class DynamicDisplayComponent<T extends Record<string, any>> {
  // ========================================
  // INPUTS - Configuração e dados
  // ========================================

  @Input() data: T[] = [];
  @Input() fields: DynamicField[] = [];
  @Input() title = '';
  @Input() iconCard = 'person';
  @Input() imageBaseUrl = 'https://sameengenharia.com.br/api/equipament/file/';

  // Estados
  @Input() isLoading = false;
  @Input() isEmpty = false;
  @Input() modalState: ModalType = ModalType.IDLE;
  @Input() modalMessage = '';

  // Comportamento
  @Input() clickHandle: CardClickConfig = { type: 'none' };

  // ========================================
  // OUTPUTS - Eventos para o componente pai
  // ========================================

  @Output() cardClick = new EventEmitter<T>();
  @Output() actionClick = new EventEmitter<ActionEvent<T>>();
  @Output() navigationBack = new EventEmitter<void>();
  @Output() modalClose = new EventEmitter<void>();

  // ========================================
  // ESTADO INTERNO
  // ========================================

  selectedItem: T | null = null;
  isBottomSheetOpen = false;

  // Expor enum para o template
  readonly ModalType = ModalType;

  // ========================================
  // HANDLERS DE EVENTOS
  // ========================================

  onCardClick(item: T): void {
    switch (this.clickHandle.type) {
      case 'bottomSheet':
        this.openBottomSheet(item);
        break;
      case 'navigation':
        this.cardClick.emit(item);
        break;
      case 'none':
      default:
        // Não faz nada
        break;
    }
  }

  onActionClick(action: string): void {
    if (!this.selectedItem) return;

    this.actionClick.emit({
      action,
      item: this.selectedItem
    });

    this.closeBottomSheet();
  }

  onNavigationBack(): void {
    this.navigationBack.emit();
  }

  onModalClose(): void {
    this.modalClose.emit();
  }

  // ========================================
  // MÉTODOS DE CONTROLE DE BOTTOM SHEET
  // ========================================

  private openBottomSheet(item: T): void {
    this.selectedItem = item;
    this.isBottomSheetOpen = true;
  }

  closeBottomSheet(): void {
    this.isBottomSheetOpen = false;
    this.selectedItem = null;
  }

  closeModal(): void {
    this.onModalClose();
  }

  // ========================================
  // UTILITÁRIOS
  // ========================================

  trackByFn(index: number, item: any): any {
    return item?.id ?? index;
  }

  getImageUrl(photo: string): string {
    return this.imageBaseUrl + photo;
  }

  isDataField(field: DynamicField): field is DataField {
    return field.type !== 'button';
  }

  isButtonField(field: DynamicField): field is ButtonField {
    return field.type === 'button';
  }
}
