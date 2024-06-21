import { NgModule, ChangeDetectionStrategy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersonaComponent } from './views/persona/persona.component';
import { UsuarioComponent } from './views/usuario/usuario.component';
import { AsignaturaComponent } from './views/asignatura/asignatura.component';
import { ActividadComponent } from './views/actividad/actividad.component';
import { CarreraComponent } from './views/carrera/carrera.component';
import { PeriodoComponent } from './views/periodo/periodo.component';
import { CicloComponent } from './views/ciclo/ciclo.component';
import { JornadaComponent } from './views/jornada/jornada.component';
import { RolComponent } from './views/rol/rol.component';
import { GradoOcupacionalComponent } from './views/grado-ocupacional/grado-ocupacional.component';
import { TipoActividadComponent } from './views/tipo-actividad/tipo-actividad.component';
import { DistributivoComponent } from './views/distributivo/distributivo.component';
import { TituloProfesionalComponent } from './views/titulo-profesional/titulo-profesional.component';
import { TipoContratoComponent } from './views/tipo-contrato/tipo-contrato.component';
import { DistributivoActividadComponent } from './views/distributivo-actividad/distributivo-actividad.component';
import { DistributivoAsignaturaComponent } from './views/distributivo-asignatura/distributivo-asignatura.component';
import { UsuarioRolComponent } from './views/usuario-rol/usuario-rol.component';
import { MatrizPropuestaComponent } from './views/matriz-propuesta/matriz-propuesta.component';
import { LoginComponent } from './views/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginService } from './Services/loginService/login.service';
import { AsignaturaService } from './Services/asignaturaService/asignatura.service';
import { ActividadService } from './Services/actividadService/actividad.service';
import { DistributivoAsignaturaService } from './Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { JornadaService } from './Services/jornadaService/jornada.service';
import { CicloService } from './Services/cicloService/ciclo.service';
import { PeriodoService } from './Services/periodoService/periodo.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MainComponent } from './views/main/main.component';
import { TablaComponent } from './views/vista-Distributivos/tabla.component';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOption } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelect } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

import { DistributivoService } from './Services/distributivoService/distributivo.service'; 
import { FormComponent as ActividadFormComponert } from './views/actividad/form.component';
import { DocenteService } from './Services/docenteService/docente.service';
import { FormComponent } from './views/actividad/form.component';
import { tipo_actividadService } from './Services/tipo_actividadService/tipo_actividad.service';
import { AdminCreacionComponent } from './views/asignar-Rol/admin-creacion.component'; 
import { ChangeDetectorRef } from '@angular/core';
import { DistributivoActividadService } from './Services/distributivoActividadService/distributivo_actividad.service';
import { RegistroComponent } from './views/registro_usuario/registro.component';
import { ReportesComponent } from './views/reportes/reportes/reportes.component';
import { SidebarDocenteComponent } from './sidebarDocente/sidebar-docente/sidebar-docente.component';
import { SidebarCoordinadorComponent } from './sidebarCoordinador/sidebar-coordinador/sidebar-coordinador.component';
import { authGuard } from './guards/auth.guard';
import { MainDocenteComponent } from './views/mainDocente/main-docente/main-docente.component';
import { MainCoordiandorComponent } from './views/mainCoordinador/main-coordiandor/main-coordiandor.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { MainAdminComponent } from './views/main-admin/main-admin.component';
import { CoordinadorComponent } from './views/coordinador/coordinador.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CarreraModalComponent } from './views/carrera/carrera-modal.component';
import { PersonaListModalComponent } from './views/ModalPersona/persona-list-modal.component';
import { PersonaModalComponent } from './views/ModalPersona/persona-modal.component';
import { DirectorReporteComponent } from './views/director-reporte/director-reporte.component'; 
import { MatrizDistributivoComponent } from './views/matriz-distributivo/matriz-distributivo.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { EditarActividadesComponent } from './views/coordinador/editar-actividades/editar-actividades.component';
import { EditarAsignaturaComponent } from './views/coordinador/editar-asignatura/editar-asignatura.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'mainDocente', component: MainDocenteComponent },
  { path: 'mainCoordinador', component: MainCoordiandorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  { path: 'asignatura', component: AsignaturaComponent },
  { path: 'actividad', component: ActividadComponent },
  { path: 'tabla', component: TablaComponent},
  { path: 'persona', component: PersonaComponent },
  { path: 'actividad/form', component: ActividadFormComponert },
  { path: 'actividad/form/:id', component: ActividadFormComponert },
  { path: 'registro', component: RegistroComponent },
  { path: 'matriz-propuesta', component: MatrizPropuestaComponent },
  { path: 'tipo_actividad', component: TipoActividadComponent },
  { path: 'editar-asignatura', component: EditarAsignaturaComponent},
  { path: 'editar-actividad', component: EditarActividadesComponent},
  { path: 'admin_Creacion', component: AdminCreacionComponent},
  { path: 'distributivo', component: DistributivoComponent},
  { path: 'main-admin', component: MainAdminComponent},
  { path: 'reportes', component: ReportesComponent},
  { path: 'coordinador', component: CoordinadorComponent},
  { path: 'director-reporte', component: DirectorReporteComponent},
  { path: 'carrera', component: CarreraComponent},
  { path: 'matriz-distributivo', component: MatrizDistributivoComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    PersonaComponent,
    UsuarioComponent,
    AsignaturaComponent,
    ActividadComponent,
    CarreraComponent,
    PeriodoComponent,
    CicloComponent,
    JornadaComponent,
    RolComponent,
    GradoOcupacionalComponent,
    TipoActividadComponent,
    //DistributivoComponent,
    TituloProfesionalComponent,
    TipoContratoComponent,
    DistributivoActividadComponent,
    DistributivoAsignaturaComponent,
    UsuarioRolComponent,
    LoginComponent,
    SidebarComponent,
    MainComponent,
    //TablaComponent,
    RegistroComponent,
    MatrizPropuestaComponent,
    FormComponent,
    ReportesComponent,
    SidebarDocenteComponent,
    SidebarCoordinadorComponent,
    MainDocenteComponent,
    MainCoordiandorComponent,
    SidebarAdminComponent,
    MainAdminComponent,
    CoordinadorComponent,
    CarreraModalComponent,
    AdminCreacionComponent,
    TablaComponent,
    PersonaListModalComponent,
    PersonaModalComponent,
    DirectorReporteComponent,
    MatrizDistributivoComponent,
    EditarActividadesComponent,
    EditarAsignaturaComponent
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatOption,
    MatOptionModule,
    MatSelect,
    MatDividerModule,
    MatOption,
    MatSnackBarModule,
    MatDatepickerModule,
    NgxUiLoaderModule
  ],
  
  providers: [LoginService, provideAnimationsAsync(), 
    DocenteService, 
    AsignaturaService, 
    DistributivoAsignaturaService,
    JornadaService,
    CicloService,
    PeriodoService,
    ActividadService,
    tipo_actividadService,
    DistributivoActividadService,
    provideNativeDateAdapter(),
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
