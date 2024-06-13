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
import { forkJoin, tap } from 'rxjs';
import { Persona } from '../../Services/docenteService/persona';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { AuthService } from '../../auth.service';
import { UsuarioRol } from '../usuario-rol/UsuarioRol';

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
  persona: any;
  usuario: any;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private snackBar: MatSnackBar,
    private rolService: RolService,
    private carreraService: CarreraService,
    private authService: AuthService
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
      rol: [{ value: '', disabled: true }, Validators.required],
      carrera: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {}

  buscarPersona() {
    const cedula = this.searchForm.get('cedula')?.value;
    if (cedula) {
      this.personaService.getPersonaByCedula(cedula).subscribe(
        (persona) => {
          if (persona) {
            this.persona = persona;
            this.personaForm.patchValue(persona);
            this.snackBar.open('Persona encontrada', 'X', {
              duration: 3000,
            });

            this.personaService.getUsuarioByPersonaId(persona.id_persona).subscribe((usuario) => {
              if (usuario) {
                this.usuario = usuario;
                this.personaForm.patchValue({ nombre_usuario: usuario.usuario });
              }

              this.cargarRolesYCarreras();
            });

            forkJoin([
              this.personaService.getGradoById(persona.id_grado_ocp).pipe(
                tap(grado => {
                  this.personaForm.patchValue({ grado_ocupacional: grado.nombre_grado_ocp });
                })
              ),
              this.personaService.getTituloById(persona.id_titulo_profesional).pipe(
                tap(titulo => {
                  this.personaForm.patchValue({ titulo_profesional: titulo.nombre_titulo });
                })
              ),
              this.personaService.getContratoById(persona.id_tipo_contrato).pipe(
                tap(contrato => {
                  this.personaForm.patchValue({ tipo_contrato: contrato.nombre_contrato });
                })
              )
            ]).subscribe();

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
    this.rolService.getRoles().subscribe((rol) => {
      this.roles = rol;
      this.personaForm.controls['rol'].enable();
    });

    this.carreraService.getCarrera().subscribe((carrera) => {
      this.carreras = carrera;
    });
  }

  onRoleChange(roleId: number) {
    const selectedRole = this.roles.find(role => role.id_rol === roleId);
    if (selectedRole && selectedRole.nombre_rol === 'Director') {
      this.personaForm.controls['carrera'].enable();
    } else {
      this.personaForm.controls['carrera'].disable();
    }
  }

  guardar() {
    const rolId = this.personaForm.get('rol')?.value;
    const carreraId = this.personaForm.get('carrera')?.value;

    const usuarioRol: UsuarioRol = {
      id_usuario: this.usuario.id_usuario,
      id_rol: rolId
    };

    this.personaService.createUsuarioRol(usuarioRol).subscribe(() => {
      if (rolId && carreraId) {
        this.usuario.id_carrera = carreraId;
        this.personaService.updateUsuario(this.usuario.id_usuario, this.usuario).subscribe(() => {
          this.snackBar.open('Usuario actualizado con carrera', 'X', {
            duration: 3000,
          });
        });
      } else {
        this.snackBar.open('Usuario actualizado', 'X', {
          duration: 3000,
        });
      }
    });
  }
}