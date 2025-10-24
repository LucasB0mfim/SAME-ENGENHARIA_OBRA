import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

import { LoginComponent } from './components/login/login.component';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NewTaskComponent } from './components/task/new-task/new-task.component';
import { ManageTaskComponent } from './components/task/manage-task/manage-task.component';

import { EquipmentRentalComponent } from './components/equipment-rental/equipment-rental.component';
import { CancelTransportComponent } from './components/transport/cancel-transport/cancel-transport.component';
import { RequestTransportComponent } from './components/transport/request-transport/request-transport.component';
import { DisciplinaryMeasureComponent } from './components/operational/disciplinary-measure/disciplinary-measure.component';

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
      { path: 'equipment-rental', component: EquipmentRentalComponent },
      { path: 'request-transport', component: RequestTransportComponent },
      { path: 'cancel-transport', component: CancelTransportComponent },
      { path: 'disciplinary-measure', component: DisciplinaryMeasureComponent }
    ]
  }
];
