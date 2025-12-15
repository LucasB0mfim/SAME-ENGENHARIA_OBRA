import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

import { LoginComponent } from './pages/login/login.component';

import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NewTaskComponent } from './components/task/new-task/new-task.component';

import { RentalComponent } from './components/equipament/rental/rental.component';
import { CancelComponent } from './pages/transport/cancel-transport/cancel.component';
import { RequestComponent } from './pages/transport/request-transport/request.component';

import { DisciplinaryMeasureComponent } from './pages/operational/disciplinary-measure/disciplinary-measure.component';
import { CheckinComponent } from './pages/equipament/checkin/checkin.component';
import { RegisterEquipamentComponent } from './pages/equipament/register/register.component';
import { CheckoutComponent } from './pages/equipament/checkout/checkout.component';
import { EquipamentListComponent } from './pages/equipament/equipament-list/equipament-list.component';
import { AgentComponent } from './pages/real-estate/agent/agent.component';

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
      { path: 'task/new', component: NewTaskComponent },
      { path: 'transport/request', component: RequestComponent },
      { path: 'transport/cancel', component: CancelComponent },
      { path: 'operational/disciplinary-measure', component: DisciplinaryMeasureComponent },
      { path: 'equipament/register', component: RegisterEquipamentComponent },
      { path: 'equipament/checkin', component: CheckinComponent },
      { path: 'equipament/checkout', component: CheckoutComponent },
      { path: 'equipament/rental', component: RentalComponent },
      { path: 'equipament/list', component: EquipamentListComponent },
      { path: 'real-estate/lead', component: AgentComponent },
    ]
  }
];
