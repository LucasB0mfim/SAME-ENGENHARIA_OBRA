import { Routes } from "@angular/router";
import { authGuard } from "../../core/guard/auth.guard";

import { CheckinComponent } from "./pages/checkin/checkin.component";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { EquipamentListComponent } from "./pages/list/list.component";
import { RegisterEquipamentComponent } from "./pages/register/register.component";

export const EQUIPAMENT_ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterEquipamentComponent,
    canActivate: [authGuard]
  },
  {
    path: 'checkin',
    component: CheckinComponent,
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard]
  },
  {
    path: 'list',
    component: EquipamentListComponent,
    canActivate: [authGuard]
  }
];
