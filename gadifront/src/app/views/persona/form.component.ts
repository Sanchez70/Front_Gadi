import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../Services/personaService/persona.service';
import { AuthService } from '../../auth.service';
import { Persona } from '../../Services/docenteService/persona';
import { Usuario } from '../../Services/loginService/usuario';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';


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
  styleUrls: ['./form.component.css']
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
    private router: Router,
    private personaService: PersonaService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.persona.fecha_vinculacion = new Date();
    this.personaForm = this.fb.group({
      cedula: [{ value: '' }],
      nombre1: [{ value: '' }],
      nombre2: [{ value: '' }],
      apellido1: [{ value: '' }],
      apellido2: [{ value: '' }],
      telefono: [{ value: '' }],
      direccion: [{ value: '' }],
      correo: [{ value: '' }],
      edad: [{ value: '' }],
      fecha_vinculacion: [{ value: '' }],
    });
  }

  ngOnInit(): void {
    const idPersona = this.authService.id_persona;
    if (idPersona) {
      this.personaService.getPersonaById(idPersona).subscribe(
        (persona) => {
          this.persona = persona;
          this.personaForm.patchValue(persona);
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
        console.log('Títulos de la persona:', titulos);
      },
      (error) => {
        console.error('Error al obtener los títulos de la persona:', error);
      }
    );
  }

  guardarCambios(): void {
    if (this.personaForm.valid) {
      Swal.fire({
        title: '¿Está seguro de actualizar los datos de esta perosna?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.mostrarCarga = true;
          const updatedPersona: Persona = { ...this.persona, ...this.personaForm.getRawValue() };
          this.personaService.updatePersona(updatedPersona).subscribe(
            (response) => {
              console.log('Persona actualizada exitosamente:', response);
              this.mostrarCarga = false;
              Toast.fire({
                icon: "success",
                title: "Datos actualizados con exito",
              });
              this.router.navigate(['/mainDocente']);
            },
            (error) => {
              console.error('Error al actualizar datos:', error);
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