import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface DynamicField {
  label: string;
  name: string;
  type: 'title' | 'text' | 'date';
}

export interface CardClickConfig {
  type: 'bottomSheet' | 'navigation' | 'custom';
  route?: string;
  customHandler?: (item: any) => void;
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
  @Input() clickConfig: CardClickConfig = { type: 'bottomSheet' };
  @Input() showBottomSheet: boolean = true;

  selectedItem: any = {};
  isBottomSheetOpen: boolean = false;

  constructor(private router: Router) { }

  onCardClick(item: any): void {
    switch(this.clickConfig.type) {
      case 'bottomSheet':
        this.openBottomSheet(item);
        break;

      case 'navigation':
        if (this.clickConfig.route) {
          // this.router.navigate([this.clickConfig.route, item.id]);
          this.router.navigate([this.clickConfig.route]);
        }
        break;

      case 'custom':
        if (this.clickConfig.customHandler) {
          this.clickConfig.customHandler(item);
        }
        break;
    }
  }

  openBottomSheet(item: any): void {
    if (!this.showBottomSheet) return;

    this.isBottomSheetOpen = true;
    this.selectedItem = item;
    document.body.classList.add('bottom-sheet-open');
  }

  closeBottomSheet(): void {
    this.isBottomSheetOpen = false;
    this.selectedItem = null;
    document.body.classList.remove('bottom-sheet-open');
  }

  downloadQRCode(): void {
    alert("Em desenvolvimento... Tente compartilhar!")
    return;
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
