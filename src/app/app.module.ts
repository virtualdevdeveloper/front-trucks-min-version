import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CargasComponent } from './components/cargas/cargas.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { RubrosComponent } from './components/rubros/rubros.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './layouts/layout/layout.component';
import { DateFormatPipe } from './utils/pipes/date-format.pipe';
import { CustomfilterPipe } from './utils/pipes/customfilter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormatDateMensajePipe } from './utils/pipes/format-date-mensaje.pipe';
import { CustomFechaPagoPipe } from './utils/pipes/custom-fecha-pago.pipe';
import { CustomEsPagoPipe } from './utils/pipes/custom-es-pago.pipe';
import { FormatRolePipe } from './utils/pipes/format-role.pipe';
import { TruncateEmailPipe } from './utils/pipes/truncate-email.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CargasComponent,
    NotificacionesComponent,
    PagosComponent,
    ProductosComponent,
    RubrosComponent,
    DashboardComponent,
    UsuariosComponent,
    LayoutComponent,
    DateFormatPipe,
    CustomfilterPipe,
    FormatDateMensajePipe,
    CustomFechaPagoPipe,
    CustomEsPagoPipe,
    FormatRolePipe,
    TruncateEmailPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
