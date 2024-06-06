import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../persona/persona.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOption } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelect } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Rol } from '../rol/rol'; 
import { RolService } from '../rol/rol.service';
import { Carrera } from '../../Services/carreraService/carrera'; 
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { Periodo } from '../periodo/periodo';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-creacion',
  templateUrl: './admin-creacion.component.html',
  styleUrls: ['./admin-creacion.component.css'],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatOption,
    MatDividerModule,
    MatSelect,
    MatOptionModule,
    CommonModule
  ],
})
export class AdminCreacionComponent implements OnInit {
  searchForm: FormGroup;
  personaForm: FormGroup;
  roles: Rol[] = [];
  carreras: Carrera[] = [];
  panelOpenState = false;
  periodos: Periodo[] = [];
  contratos: TipoContrato[] = [];
  grados: GradoOcupacional[] = [];
  titulos: TituloProfecional[] = [];

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private snackBar: MatSnackBar,
    private RolService: RolService,
  ) {
    this.searchForm = this.fb.group({
      cedula: ['', Validators.required],
    });

    this.personaForm = this.fb.group({
      nombre1: [{ value: '', disabled: true }],
      nombre2: [{ value: '', disabled: true }],
      apellido1: [{ value: '', disabled: true }],
      apellido2: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }],
      correo: [{ value: '', disabled: true }],
      edad: [{ value: '', disabled: true }],
      fecha_vinculacion: [{ value: '', disabled: true }],
      tipo_contrato: [{ value: '', disabled: true }],
      titulo_profesional: [{ value: '', disabled: true }],
      grado_ocupacional: [{ value: '', disabled: true }],
      nombre_usuario: [{ value: '', disabled: true }],
      rol: ['', Validators.required],
      carrera: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  buscarPersona() {
    const cedula = this.searchForm.get('cedula')?.value;
    if (cedula) {
      this.personaService.getPersonaByCedula(cedula).subscribe(
        (persona) => {
          if (persona) {
            this.personaForm.patchValue(persona);
            this.snackBar.open('Persona encontrada', 'X', {
              duration: 3000,
            });

            // Obtener el usuario por el id de persona
            this.personaService.getUsuarioByPersonaId(persona.id_persona).subscribe((usuario) => {
              if (usuario) {
                this.personaForm.patchValue({ nombre_usuario: usuario.usuario });
              }

              // Cargar roles y carreras después de encontrar el usuario
              this.cargarRolesYCarreras();
            });
          } else {
            this.snackBar.open('Persona no encontrada', 'X', {
              duration: 3000,
            });
          }
        },
        (error) => {
          this.snackBar.open('Error al buscar persona', 'X', {
            duration: 3000,
          });
        }
      );
    }
  }

  cargarRolesYCarreras() {
    // Cargar roles
    this.RolService.getRoles().subscribe((rol) => {
      this.roles = rol;

    });

    // Cargar carreras
    this.personaService.getCarreras().subscribe((carrera) => {
      this.carreras = carrera;

    });
  }
}
