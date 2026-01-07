import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';

export interface DynamicField {
  label: string;
  name: string;
  type: 'title' | 'text' | 'date' | 'bottomSheet' | 'button';
}

export interface CardClickConfig {
  type: 'bottomSheet' | 'navigation' | 'none';
  route?: string;
}

@Component({
  selector: 'app-dynamic-display',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './dynamic-display.component.html',
  styleUrl: './dynamic-display.component.scss'
})
export class DynamicDisplayComponent {
  @Input() title: string = '';
  @Input() iconCard: string = 'person';
  @Input() prevPage: string = '';
  @Input() data: any[] = [];
  @Input() fields: DynamicField[] = [];
  @Input() clickHandle: CardClickConfig = { type: 'none' };

  selectedItem: any = {};
  isBottomSheetOpen: boolean = false;
  bottomSheet: boolean = false;

  constructor(private router: Router) { }

  onCardClick(item: any): void {
    if (this.clickHandle.type === 'bottomSheet') {
      this.openBottomSheet(item);
    } else if (this.clickHandle.type === 'navigation' && this.clickHandle.route) {
      const chapa = item.chapa
      this.router.navigate([`dashboard/time-sheet/${chapa}`]);
    }
  }

  openBottomSheet(item: any): void {
    if (this.clickHandle.type === 'bottomSheet' && !this.bottomSheet) {
      this.isBottomSheetOpen = true;
      this.selectedItem = item;
      document.body.classList.add('bottom-sheet-open');
    }
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

  onNavigation(): void {
    if (this.prevPage.length > 0) {
      this.router.navigate([this.prevPage]);
    } else {
      this.router.navigate([`/dashboard/home`]);
    }
  }
}
