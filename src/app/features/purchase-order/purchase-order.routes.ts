import { Routes } from "@angular/router";
import { roleGuard } from "../../core/guard/role.guard";

import { PurchaseOrderOcComponent } from "./pages/purchase-order-oc/purchase-order-oc.component";
import { PurchaseOrderIdComponent } from "./pages/purchase-order-id/purchase-order-id.component";
import { PurchaseOrderContractComponent } from "./pages/purchase-order-contract/purchase-order-contract.component";

export const PURCHASE_ORDER_ROUTES: Routes = [
  {
    path: 'id',
    component: PurchaseOrderIdComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['DIRETOR', 'TI'] }
  },
  {
    path: 'contract',
    component: PurchaseOrderContractComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['DIRETOR', 'TI'] }
  },
  {
    path: 'oc',
    component: PurchaseOrderOcComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['DIRETOR', 'TI'] }
  }
];
