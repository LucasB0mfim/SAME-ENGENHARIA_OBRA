import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { roleGuard } from './core/guard/role.guard';

import { LoginComponent } from './pages/login/login.component';

import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { CancelComponent } from './pages/transport/cancel-transport/cancel.component';
import { RequestComponent } from './pages/transport/request-transport/request.component';

import { DisciplinaryMeasureComponent } from './pages/operational/disciplinary-measure/disciplinary-measure.component';
import { EquipamentListComponent } from './pages/equipament/list/list.component';
import { CheckinComponent } from './pages/equipament/checkin/checkin.component';
import { RegisterEquipamentComponent } from './pages/equipament/register/register.component';
import { CheckoutComponent } from './pages/equipament/checkout/checkout.component';
import { EmployeesComponent } from './pages/operational/employees/employees.component';

import { TaskPendingComponent } from './pages/operational/task/task-pending/task-pending.component';
import { TaskHistoryComponent } from './pages/operational/task/task-history/task-history.component';
import { TaskRegisterComponent } from './pages/operational/task/task-register/task-register.component';
import { ApproverIdComponent } from './pages/approver/approver-id/approver-id.component';
import { ApproverContractComponent } from './pages/approver/approver-contract/approver-contract.component';
import { ApproverOcComponent } from './pages/approver/approver-oc/approver-oc.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'transport/request', component: RequestComponent },
      { path: 'transport/cancel', component: CancelComponent },
      {
        path: 'operational/disciplinary-measure',
        component: DisciplinaryMeasureComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['ENGENHEIRO', 'DIRETOR', 'TI', 'RECURSOS HUMANOS'] }
      },
      {
        path: 'operational/task/register',
        component: TaskRegisterComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['ENGENHEIRO', 'DIRETOR', 'TI', 'RECURSOS HUMANOS'] }
      },
      { path: 'operational/task/pending', component: TaskPendingComponent },
      { path: 'operational/task/history', component: TaskHistoryComponent },
      {
        path: 'operational/employees',
        component: EmployeesComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['ENGENHEIRO', 'DIRETOR', 'TI', 'RECURSOS HUMANOS'] }
      },
      { path: 'equipament/register', component: RegisterEquipamentComponent },
      { path: 'equipament/checkin', component: CheckinComponent },
      { path: 'equipament/checkout', component: CheckoutComponent },
      { path: 'equipament/list', component: EquipamentListComponent },

      {
        path: 'approver/id',
        component: ApproverIdComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['DIRETOR', 'TI'] }
      },
      {
        path: 'approver/contract',
        component: ApproverContractComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['DIRETOR', 'TI'] }
      },
      {
        path: 'approver/oc',
        component: ApproverOcComponent,
        canActivate: [roleGuard],
        data: { allowedRoles: ['DIRETOR', 'TI'] }
      },
    ]
  }
];
