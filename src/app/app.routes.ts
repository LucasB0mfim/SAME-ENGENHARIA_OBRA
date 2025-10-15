import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

import { LoginComponent } from './components/login/login.component';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


import { NewTaskComponent } from './components/task/new-task/new-task.component';
import { ManageTaskComponent } from './components/task/manage-task/manage-task.component';

import { EquipmentRentalComponent } from './components/equipment-rental/equipment-rental.component';
import { CancelTransportComponent } from './components/cancel-transport/cancel-transport.component';

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
      { path: 'cancel-transport', component: CancelTransportComponent }
    ]
  }
];
