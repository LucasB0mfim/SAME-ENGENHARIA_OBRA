import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

export interface DynamicField {
  label: string;
  name: string;
  type: 'title' | 'text' | 'image' | 'date' | 'tel' | 'email' | 'name';
}

@Component({
  selector: 'app-dynamic-display',
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './dynamic-display.component.html',
  styleUrl: './dynamic-display.component.scss'
})
export class DynamicDisplayComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() fields: DynamicField[] = [];

  isBottomSheetOpen: boolean = false;
  selectedItem: any = null;

  constructor() { }

  /**
   * Abre o Bottom Sheet com o item selecionado
   */
  openBottomSheet(item: any): void {
    this.selectedItem = item;
    this.isBottomSheetOpen = true;
    document.body.classList.add('bottom-sheet-open');
  }

  /**
   * Fecha o Bottom Sheet
   */
  closeBottomSheet(): void {
    this.isBottomSheetOpen = false;
    this.selectedItem = null;
    document.body.classList.remove('bottom-sheet-open');
  }

  /**
   * Método placeholder para baixar QR Code
   * A lógica será implementada depois
   */
  downloadQRCode(event: Event): void {
    event.stopPropagation();
    console.log('Download QR Code:', this.selectedItem);
    // TODO: Implementar lógica de download
    // Acesse o QR Code via: this.selectedItem.qrCode
  }

  /**
   * Método placeholder para compartilhar QR Code
   * A lógica será implementada depois
   */
  shareQRCode(event: Event): void {
    event.stopPropagation();
    console.log('Share QR Code:', this.selectedItem);
    // TODO: Implementar lógica de compartilhamento
    // Acesse o QR Code via: this.selectedItem.qrCode
  }

  /**
   * TrackBy function para otimizar renderização do *ngFor
   * Previne re-renderização desnecessária de cards
   */
  trackByIndex(index: number, item: any): number {
    return index;
  }

  /**
   * Retorna o nome do campo que é do tipo 'title'
   * Usado para alt text das imagens
   */
  getTitleField(): string {
    const titleField = this.fields.find(f => f.type === 'title');
    return titleField ? titleField.name : '';
  }
}
