import { Routes } from "@angular/router";
import { roleGuard } from "../../core/guard/role.guard";
import { TaskApprovedComponent } from "./pages/task/task-approved/task-approved.component";
import { TaskPendingComponent } from "./pages/task/task-pending/task-pending.component";
import { TaskRegisterComponent } from "./pages/task/task-register/task-register.component";
import { DisciplinaryMeasureComponent } from "./pages/disciplinary-measure/disciplinary-measure.component";
import { authGuard } from "../../core/guard/auth.guard";

export const OPERATIONAL_ROUTES: Routes = [
  {
    path: 'disciplinary-measure',
    component: DisciplinaryMeasureComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['ENGENHEIRO', 'DIRETOR', 'TI', 'RECURSOS HUMANOS'] }
  },
  {
    path: 'task/register',
    component: TaskRegisterComponent,
    canActivate: [roleGuard],
    data: { allowedRoles: ['ENGENHEIRO', 'DIRETOR', 'TI', 'RECURSOS HUMANOS'] }
  },
  {
    path: 'task/pending',
    component: TaskPendingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'task/approved',
    component: TaskApprovedComponent,
    canActivate: [authGuard]
  }
];
