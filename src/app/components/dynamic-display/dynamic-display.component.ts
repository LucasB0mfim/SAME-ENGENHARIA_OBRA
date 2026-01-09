import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';

export interface DynamicField {
  label?: string;
  name: string;
  type: 'title' | 'text' | 'date' | 'button';
  style: 'card' | 'bottomSheet';
  action?: 'shareQRCode' | 'copyID' | 'acceptTask' | 'rejectTask';
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
  @Input() data: any[] = [];
  @Input() title: string = '';
  @Input() prevPage: string = '';
  @Input() iconCard: string = 'person';
  @Input() isLoading: boolean = false;
  @Input() isEmpty: boolean = false;

  @Input() fields: DynamicField[] = [];
  @Input() clickHandle: CardClickConfig = { type: 'none' };

  @Input() errorMessage: string = '';
  @Input() successMessage: string = '';

  @Output() formSubmit = new EventEmitter<FormData>();

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

  onNavigation(): void {
    if (this.prevPage.length > 0) {
      this.router.navigate([this.prevPage]);
    } else {
      this.router.navigate([`/dashboard/home`]);
    }
  }

  async onClick(action?: string): Promise<void> {
    if (action === 'shareQRCode') {
      this.shareQRCode();
    } else if (action === 'copyID') {
      this.downloadQRCode();
    } else if (action === 'acceptTask') {
      this.updateConsert('APROVADO');
    } else if (action === 'rejectTask') {
      this.updateConsert('RECUSADO');
    }
  }

  private async shareQRCode(): Promise<void> {
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

  private downloadQRCode(): void {
    console.log("download");
  }

  private updateConsert(consent: string): void {
    const formData = new FormData();
    formData.append('id', this.selectedItem.id);
    formData.append('consent', consent);

    this.formSubmit.emit(formData);
    this.closeBottomSheet();
  }
}
