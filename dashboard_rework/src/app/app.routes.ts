import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) // Lazy load the standalone DashboardComponent
  }
];

export { routes };
