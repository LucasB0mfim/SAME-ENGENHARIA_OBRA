import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

export interface DynamicField {
  label: string;
  name: string;
  type: 'title' | 'text' | 'date';
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

  selectedItem: any = null;
  isBottomSheetOpen: boolean = false;

  constructor() { }

  openBottomSheet(item: any): void {
    this.selectedItem = item;
    this.isBottomSheetOpen = true;
    document.body.classList.add('bottom-sheet-open');
  }

  closeBottomSheet(): void {
    this.isBottomSheetOpen = false;
    this.selectedItem = null;
    document.body.classList.remove('bottom-sheet-open');
  }

  downloadQRCode(event: Event): void {

  }

  async shareQRCode(): Promise<void> {

    if (!this.selectedItem?.qr_code) {
      alert("Equipamento sem QR Code!");
      return;
    }

    try {
      const response = await fetch(this.selectedItem.qr_code);
      const blob = await response.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });

      await navigator.share({
        title: 'QR Code',
        text: 'Compartilhar QR Code',
        files: [file]
      });

    } catch (error) {
      alert("Não foi possível compartilhar QR Code. Tente fazer o download!");
      console.error("Erro ao compartilhar QR Code: ", error);
    }
  }
}
