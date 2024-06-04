import { NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { LoginComponent } from './views/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginService } from './Services/loginService/login.service';
import { AsignaturaService } from './Services/asignaturaService/asignatura.service';
import { ActividadService } from './Services/actividadService/actividad.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SidebarComponent } from './sidebar/sidebar.component';
//MATERIAL
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

//MATERIAL//
import { DistributivoService } from './views/tabla/distributivo.service';
import { FormComponent as ActividadFormComponert } from './views/actividad/form.component';
import { DocenteService } from './Services/docenteService/docente.service';
import { RegistroComponent } from './views/registro/registro.component';
import { MainComponent } from './views/main/main.component';
import { TablaComponent } from './views/tabla/tabla.component';
import { AdminCreacionComponent } from './views/admin-creacion/admin-creacion.component';


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
   { path: 'Admin-Creacion', component: AdminCreacionComponent },


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

  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSnackBarModule,

  ],
  providers: [LoginService, provideAnimationsAsync(), DistributivoService, DocenteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
