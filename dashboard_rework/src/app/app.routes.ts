import { Routes } from '@angular/router';
import {EditDashboardComponent} from './components/dashboardComponents/edit_dashboard/edit-dashboard.component';
import {ListDashboardsComponent} from './components/dashboardComponents/list-dashboards/list-dashboards.component';

// Use dynamic imports to enable lazy loading
const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/authenticationComponents/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard/:name',
    loadComponent: () => import('./components/dashboardComponents/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/authenticationComponents/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/mainComponents/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboardList',
    loadComponent: ()  => import('./components/dashboardComponents/list-dashboards/list-dashboards.component').then(m => m.ListDashboardsComponent)
  },
  {
    path: 'editDashboard/:name',
    loadComponent: () => import('./components/dashboardComponents/edit_dashboard/edit-dashboard.component').then(m => m.EditDashboardComponent)
  },
  {
    path: 'addDashboard',
    loadComponent: () => import('./components/dashboardComponents/create_dashboard/create-dashboard.component').then(m => m.CreateDashboardComponent)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

export { routes };
