import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CargasComponent } from './components/cargas/cargas.component';
import { ProductosComponent } from './components/productos/productos.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cargas', component: CargasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'notificaciones', component: NotificacionesComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'usuarios', component: UsuariosComponent },
  // { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
