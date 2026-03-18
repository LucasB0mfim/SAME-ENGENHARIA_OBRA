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
  selector: 'app-purchase-order-oc',
  imports: [CommonModule, MatIconModule, FormsModule, RouterLink, LoadingComponent, ToastComponent],
  templateUrl: './purchase-order-oc.component.html',
  styleUrl: './purchase-order-oc.component.scss'
})
export class PurchaseOrderOcComponent extends PurchaseOrderBaseComponent {

  get idKey(): string { return 'OC'; }

  constructor(approverService: ApproverService) {
    super(approverService);
  }

  loadRequests(): void {
    this.isLoading = true;
    this.approverService.findByOC()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => this.requests = res.result,
        error: (err) => console.error(err)
      });
  }
}