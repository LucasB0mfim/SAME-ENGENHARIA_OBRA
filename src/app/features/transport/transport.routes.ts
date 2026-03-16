import { Routes } from "@angular/router";
import { authGuard } from "../../core/guard/auth.guard";
import { RequestComponent } from "./pages/request-transport/request.component";
import { CancelComponent } from "./pages/cancel-transport/cancel.component";

export const TRANSPORT_ROUTES: Routes = [
  {
    path: 'request',
    component: RequestComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cancel',
    component: CancelComponent,
    canActivate: [authGuard]
  }
];
