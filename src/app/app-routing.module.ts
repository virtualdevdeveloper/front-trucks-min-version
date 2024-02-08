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
import { HasRoleGuard } from './utils/guards/has-role.guard';
import { CheckLoginGuard } from './utils/guards/check-login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [CheckLoginGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [HasRoleGuard], data: { role: 'ROLE_USER' } },
  { path: 'cargas', component: CargasComponent, canActivate: [HasRoleGuard], data: { role: 'ROLE_USER' } },
  { path: 'productos', component: ProductosComponent, canActivate: [HasRoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'notificaciones', component: NotificacionesComponent, canActivate: [HasRoleGuard], data: { role: 'ROLE_USER' } },
  { path: 'pagos', component: PagosComponent, canActivate: [HasRoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [HasRoleGuard], data: { role: 'ROLE_ADMIN' } },
  // { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
