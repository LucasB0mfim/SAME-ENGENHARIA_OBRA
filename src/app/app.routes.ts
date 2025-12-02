import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

import { LoginComponent } from './pages/login/login.component';

import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NewTaskComponent } from './components/task/new-task/new-task.component';
import { ManageTaskComponent } from './components/task/manage-task/manage-task.component';

import { RentalComponent } from './components/equipament/rental/rental.component';
import { CancelTransportComponent } from './pages/transport/cancel-transport/cancel-transport.component';
import { RequestTransportComponent } from './pages/transport/request-transport/request-transport.component';
import { DisciplinaryMeasureComponent } from './components/operational/disciplinary-measure/disciplinary-measure.component';
import { CheckinComponent } from './components/equipament/checkin/checkin.component';
import { RegisterEquipamentComponent } from './components/equipament/register/register.component';

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
      { path: 'new-task', component: NewTaskComponent },
      { path: 'manage-task', component: ManageTaskComponent },
      { path: 'rental', component: RentalComponent },
      { path: 'transport/request', component: RequestTransportComponent },
      { path: 'transport/cancel', component: CancelTransportComponent },
      { path: 'disciplinary-measure', component: DisciplinaryMeasureComponent },
      { path: 'equipament/register', component: RegisterEquipamentComponent },
      { path: 'equipament/checkin', component: CheckinComponent },
    ]
  }
];
