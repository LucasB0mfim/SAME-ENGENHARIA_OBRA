import { Component } from "@angular/core";
import { finalize } from "rxjs";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

import { ToastComponent } from "../../../../shared/components/toast/toast.component";
import { PurchaseOrderBaseComponent } from "../../base/purchase-order-base.component";
import { LoadingComponent } from "../../../../shared/components/loading/loading.component";
import { ApproverService } from "../../../../core/services/approver.service";

@Component({
  selector: 'app-purchase-order-id',
  imports: [CommonModule, MatIconModule, FormsModule, RouterLink, LoadingComponent, ToastComponent],
  templateUrl: './purchase-order-id.component.html',
  styleUrl: './purchase-order-id.component.scss'
})
export class PurchaseOrderIdComponent extends PurchaseOrderBaseComponent {

  get idKey(): string { return 'ID'; }

  constructor(approverService: ApproverService) {
    super(approverService);
  }

  loadRequests(): void {
    this.isLoading = true;
    this.approverService.findByID()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => this.requests = res.result,
        error: (err) => console.error(err)
      });
  }
}