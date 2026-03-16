import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { roleGuard } from './core/guard/role.guard';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'transport', loadChildren: () => import('./features/transport/transport.routes').then(r => r.TRANSPORT_ROUTES) },
      { path: 'operational', loadChildren: () => import('./features/operational/operational.routes').then(r => r.OPERATIONAL_ROUTES) },
      { path: 'equipament', loadChildren: () => import('./features/equipament/equipament.routes').then(r => r.EQUIPAMENT_ROUTES) },
      { path: 'approver', loadChildren: () => import('./features/approver/approver.routes').then(r => r.APPROVER_ROUTES) },

    ]
  }
];
