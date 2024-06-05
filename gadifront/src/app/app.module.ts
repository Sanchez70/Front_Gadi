import { NgModule } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';
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
import { TablaComponent } from './views/tabla/tabla.component';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';


import { DistributivoService } from './views/tabla/distributivo.service';
import { FormComponent as ActividadFormComponert } from './views/actividad/form.component';
import { DocenteService } from './Services/docenteService/docente.service';
import { FormComponent } from './views/actividad/form.component';
import { tipo_actividadService } from './Services/tipo_actividadService/tipo_actividad.service';
import { AdminCreacionComponent } from './views/admin-creacion/admin-creacion.component';
import { DistributivoActividadService } from './Services/distributivoActividadService/distributivo_actividad.service';
import { RegistroComponent } from './views/registro_usuario/registro.component';
import { ReportesComponent } from './views/reportes/reportes/reportes.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'sidebar', component: SidebarComponent },
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
  { path: 'admin_Creacion', component: AdminCreacionComponent},
  { path: 'distributivo', component: DistributivoComponent},
  { path: 'reportes', component: ReportesComponent}

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
    DistributivoComponent,
    TituloProfesionalComponent,
    TipoContratoComponent,
    DistributivoActividadComponent,
    DistributivoAsignaturaComponent,
    UsuarioRolComponent,
    LoginComponent,
    SidebarComponent,
    MainComponent,
    TablaComponent,
    RegistroComponent,
    MatrizPropuestaComponent,
    FormComponent,
    ReportesComponent
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
    MatInputModule
  ],
  providers: [LoginService, provideAnimationsAsync(), 
    DistributivoService, 
    DocenteService, 
    AsignaturaService, 
    DistributivoAsignaturaService,
    JornadaService,
    CicloService,
    PeriodoService,
    ActividadService,
    tipo_actividadService,
    DistributivoActividadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
