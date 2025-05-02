import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';


export const routes: Routes = [
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    { path: 'register', component: RegistrationComponent }
  ];
