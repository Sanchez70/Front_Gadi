import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../Services/personaService/persona.service';
import { AuthService } from '../../auth.service';
import { Persona } from '../../Services/docenteService/persona';
import { Usuario } from '../../Services/loginService/usuario';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TituloProfesionalComponent } from '../titulo-profesional/titulo-profesional.component';
import { ValidacionesComponent } from '../../validaciones/validaciones.component';
import { DatePipe } from '@angular/common';


const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  showCloseButton: true,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [DatePipe]

})
export class FormComponent implements OnInit {
  displayedColumns: string[] = ['grado', 'nombre_titulo'];
  persona: Persona = new Persona();
  usuario: Usuario = new Usuario();
  mostrarCarga: boolean = false;
  personaForm: FormGroup;
  currentExplan: string = '';
  titulos: TituloProfecional[] = [];
  private sidebarSubscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private personaService: PersonaService,
    private authService: AuthService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.persona.fecha_vinculacion = new Date();
    this.personaForm = this.fb.group({
      cedula: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(ValidacionesComponent.patternRucValidator())]],
      nombre1: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternOnlyNames())]],
      nombre2: ['', [Validators.pattern(ValidacionesComponent.patternOnlyNames())]],
      apellido1: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternOnlyNames())]],
      apellido2: ['', [Validators.pattern(ValidacionesComponent.patternOnlyNames())]],
      telefono: ['', [Validators.pattern(ValidacionesComponent.patterOnlyNumbersValidator())]],
      direccion: [''],
      correo: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternEmailValidator())]],
      edad: [{ value: '', disabled: true }, [Validators.required, Validators.min(1), Validators.max(120)]],
      fecha_vinculacion: [{ value: '', disabled: true }]
    });
  }

  openModal(): void {
    const idPersona = this.authService.id_persona;
    const dialogRef = this.dialog.open(TituloProfesionalComponent, {
      width: '30%',
      height: '60%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.mostrarTitulos(idPersona);
    });
  }

  ngOnInit(): void {
    const idPersona = this.authService.id_persona;
    if (idPersona) {
      this.personaService.getPersonaById(idPersona).subscribe(
        (persona) => {
          this.persona = persona;
          // Formatear la fecha de vinculación
          const formattedDate = this.datePipe.transform(persona.fecha_vinculacion, 'd/M/yyyy');
          this.personaForm.patchValue({ ...persona, fecha_vinculacion: formattedDate });
          this.mostrarTitulos(idPersona);
        },
        (error) => {
          console.error('Error al cargar los datos de la persona:', error);
        }
      );
    } else {
      console.error('ID de persona no disponible');
    }

    this.sidebarSubscription = this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
  }

  mostrarTitulos(idPersona: number): void {
    this.personaService.getTitulosProfecionalesByPersonaId(idPersona).subscribe(
      (titulos: TituloProfecional[]) => {
        this.titulos = titulos;
      },
      (error) => {
        console.error('Error al obtener los títulos de la persona:', error);
      }
    );
  }

  guardarCambios(): void {
    if (this.personaForm.valid) {
      Swal.fire({
        title: '¿Está seguro de actualizar los datos de esta persona?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.mostrarCarga = true;
          const formValue = this.personaForm.getRawValue();
          const formattedDate = this.datePipe.transform(formValue.fecha_vinculacion, 'yyyy-MM-dd');
          const updatedPersona: Persona = { ...this.persona, ...formValue, fecha_vinculacion: formattedDate };
          this.personaService.updatePersona(updatedPersona).subscribe(
            (response) => {
              this.mostrarCarga = false;
              Toast.fire({
                icon: "success",
                title: "Datos actualizados con éxito",
              });
              this.router.navigate(['/mainDocente']);
            },
            (error) => {
              this.mostrarCarga = false;
              Toast.fire({
                icon: "error",
                title: "Error al actualizar los datos",
              });
            }
          );
        }
      });
    }
  }
}