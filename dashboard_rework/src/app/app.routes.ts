import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; // Adjust the path as necessary
import { RegisterComponent } from './register/register.component'; // Adjust the path as necessary
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent // Directly reference the AppComponent (or you might want to redirect)
  },
  {
    path: 'dashboard',
    component: DashboardComponent // Directly reference the DashboardComponent
  },
  {
    path: 'register',
    component: RegisterComponent // Directly reference the RegisterComponent
  },
  {
    path: 'home',
    component: HomeComponent // Directly reference the AppComponent (or you might want to redirect)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

export { routes };
