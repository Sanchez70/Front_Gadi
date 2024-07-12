import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../Services/personaService/persona.service';
import { Rol } from '../rol/rol';
import { RolService } from '../rol/rol.service';
import { Carrera } from '../../Services/carreraService/carrera';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { Periodo } from '../periodo/periodo';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import { CommonModule } from '@angular/common';
import { Subscription, forkJoin, tap } from 'rxjs';
import { Persona } from '../../Services/docenteService/persona';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { AuthService } from '../../auth.service';
import { UsuarioRol } from '../usuario-rol/UsuarioRol';
import { Usuario } from '../../Services/loginService/usuario';
import Swal from 'sweetalert2';
import { PersonaListModalComponent } from '../ModalPersona/persona-list-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Rector } from '../../Services/rectorService/rector';
import { RectorService } from '../../Services/rectorService/rector.service';

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
@Component({
  selector: 'app-admin-creacion',
  templateUrl: './admin-creacion.component.html',
  styleUrls: ['./admin-creacion.component.css'],

})
export class AdminCreacionComponent implements OnInit {
  searchForm: FormGroup;
  personaForm: FormGroup;
  roles: Rol[] = [];
  carreras: Carrera[] = [];
  titulos: TituloProfecional[] = [];
  usuario: Usuario | null = null;
  panelOpenState = false;
  currentExplan: string = '';
  rector: Rector = new Rector();
  idPersona: number = 0;
  private sidebarSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private snackBar: MatSnackBar,
    private rolService: RolService,
    private carreraService: CarreraService,
    private rectorService: RectorService,
    private dialog: MatDialog,
    private authService: AuthService,
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
      titulo_profesional: [{ value: '' }],
      grado_ocupacional: [{ value: '', disabled: true }],
      nombre_usuario: [{ value: '', disabled: true }],
      rol: ['', Validators.required],
      carrera: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
  }

  buscarPersona() {
    if (this.searchForm.invalid) {
      Toast.fire({
        icon: "warning",
        title: "Ingrese una cedula válida",
        footer: "La cédula debe tener al menos 10 dígitos"
      });
      return;
    }
    const cedula = this.searchForm.get('cedula')?.value;
    if (cedula) {
      this.personaService.getPersonaByCedula(cedula).subscribe(
        (persona) => {
          if (persona) {
            this.personaForm.patchValue(persona);
            Toast.fire({
              icon: "success",
              title: "Datos cargados correctamente"
            });
            this.idPersona = persona.id_persona;
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
              // this.personaService.getTituloById(persona.id_titulo_profesional).pipe(
              //   tap(titulo => {
              //     this.personaForm.patchValue({ titulo_profesional: titulo.nombre_titulo });
              //   })
              // ),
              this.personaService.getContratoById(persona.id_tipo_contrato).pipe(
                tap(contrato => {
                  this.personaForm.patchValue({ tipo_contrato: contrato.nombre_contrato });
                })
              ),
              this.personaService.getTitulosProfecionalesByPersonaId(persona.id_persona).pipe(
                tap(titulos => {
                  this.titulos = titulos;
                })
              )
            ]).subscribe();

            this.personaService.getTitulosProfecionalesByPersonaId(persona.id_persona).subscribe(
              (titulos) => {
                this.titulos = titulos;
              }
            );

          } else {
            Toast.fire({
              icon: "error",
              title: "No se pudo encontrar a la persona con esa cedula",
            });
          }
        },
        (error) => {
          Toast.fire({
            icon: "error",
            title: "Hubo un error al buscar a la persona",
            footer: "Por favor, verifique si la cedula es la correcta"
          });
        }
      );
    }
  }

  cargarRolesYCarreras() {
    this.rolService.getRoles().subscribe((roles) => {
      this.roles = roles;
      this.personaForm.get('rol')?.enable();
    });

    this.carreraService.getCarrera().subscribe((carreras) => {
      this.carreras = carreras;
    });
  }

  onRolChange(event: any) {
    const selectedRol = this.roles.find(rol => rol.id_rol === event.value);
    if (selectedRol && selectedRol.nombre_rol === 'Director') {
      this.personaForm.get('carrera')?.enable();
    } else {
      this.personaForm.get('carrera')?.disable();
    }
  }

  guardarUsuario() {
    if (this.personaForm.invalid) {
      Toast.fire({
        icon: "warning",
        title: "Por favor, complete todos los campos",
      });
      return;
    }

    const rolId = this.personaForm.get('rol')?.value;
    const carreraId = this.personaForm.get('carrera')?.value;
    const usuarioId = this.usuario?.id_usuario;

    if (!rolId) {
      Toast.fire({
        icon: "warning",
        title: "No hay ningún rol seleccionado",
      });
      return;
    }

    if (this.roles.find(rol => rol.id_rol === rolId)?.nombre_rol === 'Director' && !carreraId) {
      Toast.fire({
        icon: "warning",
        title: "No se ha seleccionado ninguna carrera",
        footer: "Seleccione una carrera para continuar"
      });
      return;
    }

    if (this.roles.find(rol => rol.id_rol === rolId)?.nombre_rol === 'Rector') {
      this.rectorService.getRector().subscribe(data =>{
        if(data.length === 0){
          this.rector.id_persona = this.idPersona;
          this.rectorService.create(this.rector).subscribe(response => {
          Toast.fire({
            icon: "success",
            title: "Rol asignado correctamente",
          });
          this.limpiarCampos();
      })
        }else{
          this.rector = data[0];
          this.rector.id_persona = this.idPersona;
          this.rectorService.update(this.rector).subscribe(response =>{
            Toast.fire({
              icon: "success",
              title: "Rol asignado correctamente",
            });
            this.limpiarCampos();
          })
        }
      });
      
    } else {

      if (usuarioId) {
        const usuarioRol: UsuarioRol = {
          id_usuario_rol: 0,
          id_usuario: usuarioId,
          id_rol: rolId
        };

        this.personaService.saveUsuarioRol(usuarioRol).subscribe(() => {
          Toast.fire({
            icon: "success",
            title: "Rol asignado correctamente",
          });

          if (this.roles.find(rol => rol.id_rol === rolId)?.nombre_rol === 'Director' && carreraId) {
            this.carreraService.getCarreraById(carreraId).subscribe(carrera => {
              if (this.usuario) {
                this.usuario.carrera = carrera;
                this.personaService.updateUsuario(this.usuario).subscribe(() => {
                  Toast.fire({
                    icon: "success",  
                    title: "Carrera asignada correctamente",
                  });
                  this.limpiarCampos();
                });
              }
            });
          } else {
            this.limpiarCampos();
          }
        });
      }
    }
  }

  limpiarCampos() {
    this.searchForm.reset();
    this.personaForm.reset();
    this.personaForm.disable();
    this.roles = [];
    this.carreras = [];
    this.usuario = null;
  }

  openModal() {
    const dialogRef = this.dialog.open(PersonaListModalComponent, {
      width: '80%',
      height: '80%',
    });
    dialogRef.componentInstance.personaSeleccionada.subscribe((cedula: string) => {
      this.searchForm.patchValue({ cedula });
      this.buscarPersona();
    });
  }

}