import { Routes } from "@angular/router";
import { roleGuard } from "../../core/guard/role.guard";
import { ApproverContractComponent } from "./pages/approver-contract/approver-contract.component";
import { ApproverIdComponent } from "./pages/approver-id/approver-id.component";
import { ApproverOcComponent } from "./pages/approver-oc/approver-oc.component";
import { PurchaseOrderOcComponent } from "./pages/purchase-order-oc/purchase-order-oc.component";

export const APPROVER_ROUTES: Routes = [
  {
    path: 'id',
    component: ApproverIdComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['DIRETOR', 'TI'] }
  },
  {
    path: 'contract',
    component: ApproverContractComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['DIRETOR', 'TI'] }
  },
  {
    path: 'oc',
    component: ApproverOcComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['DIRETOR', 'TI'] }
  },
  {
    path: 'purchase-order',
    component: PurchaseOrderOcComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['DIRETOR', 'TI'] }
  },
];
