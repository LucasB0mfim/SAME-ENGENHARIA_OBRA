import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ApproverService } from '../../../core/services/approver.service';
import { finalize, forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-order-oc',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './purchase-order-oc.component.html',
  styleUrl: './purchase-order-oc.component.scss'
})
export class PurchaseOrderOcComponent implements OnInit {
  requests: any[] = [];
  selectCard: string | null = null;
  listedCards = new Map<string, string>();

  isLoading: boolean = false;
  isApproving: boolean = false;

  searchTerm: string = '';

  constructor(
    private readonly _approverService: ApproverService
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  toggleCard(oc: string): void {
    if (this.selectCard === oc) {
      this.selectCard = null;
    } else {
      this.selectCard = oc;
    }
  }

  loadRequests(): void {
    this._approverService.findByOC()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => this.requests = res.result,
        error: (err) => console.error(err)
      });
  }

  approve(req: any): void {
    this.isApproving = true;

    const request = {
      id: req.OC,
      movimento: req.MOVIMENTO
    }

    this._approverService.approve(request)
      .pipe(finalize(() => {
        this.isApproving = false;
        this.loadRequests();
      }))
      .subscribe({
        next: (res) => this.selectCard = null,
        error: (err) => console.error(err)
      });
  }

  approveGroup(): void {
    this.isApproving = true;

    const requests = Array.from(this.listedCards.entries()).map(([oc, movimento]) =>
      this._approverService.approve({ id: oc, movimento })
    );

    forkJoin(requests)
      .pipe(finalize(() => {
        this.isApproving = false;
        this.listedCards.clear();
        this.loadRequests();
      }))
      .subscribe({
        next: (res) => this.selectCard = null,
        error: (err) => console.error(err)
      })
  }

  listCard(card: any, event: Event): void {
    event.stopPropagation();
    if (this.listedCards.has(card.OC)) {
      this.listedCards.delete(card.OC);
    } else {
      this.listedCards.set(card.OC, card.MOVIMENTO);
    }
  }

  isSelected(card: any): boolean {
    if (this.listedCards.has(card.OC)) {
      return true;
    } else {
      return false;
    }
  }

  get filteredRequests(): any[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.requests;

    return this.requests.filter(req =>
      req.OC?.toLowerCase().includes(term) ||
      req.FORNECEDOR?.toLowerCase().includes(term) ||
      req.CENTRO_CUSTO?.toLowerCase().includes(term)
    );
  }

  totalPrice(items: any[]): number {
    return items.reduce((acc: number, item: any) => {
      return acc + (+item.QUANTIDADE * +item.PRECO_UNITARIO);
    }, 0);
  }

  itemPrice(item: any): number {
    return +item.QUANTIDADE * +item.PRECO_UNITARIO || 0;
  }
}
