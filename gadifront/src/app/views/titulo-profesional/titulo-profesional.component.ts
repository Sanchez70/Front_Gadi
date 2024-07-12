import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../Services/personaService/persona.service';
import { AuthService } from '../../auth.service';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ValidacionesComponent } from '../../validaciones/validaciones.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  selector: 'app-titulo-profesional',
  templateUrl: './titulo-profesional.component.html',
  styleUrls: ['./titulo-profesional.component.css']
})
export class TituloProfesionalComponent implements OnInit {

  tituloForm!: FormGroup;
  grados: string[] = ['Tercer Nivel', 'Cuarto Nivel'];

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TituloProfesionalComponent>,
    private tituloService: TituloProfesionalService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const idPersona = this.authService.id_persona;
    this.tituloForm = this.fb.group({
      id_persona: [idPersona, Validators.required],
      grado: ['', Validators.required],
      nombre_titulo: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patterntitleValidator())]]
    });

    //Nombre_titulo' y transformarlo a mayúsculas
    this.tituloForm.get('nombre_titulo')?.valueChanges.subscribe(value => {
      this.tituloForm.get('nombre_titulo')?.setValue(value.toUpperCase(), { emitEvent: false });
    });
  }

  guardarTitulo(): void {
    if (this.tituloForm.valid) {
      this.tituloService.create(this.tituloForm.value).subscribe(
        response => {
          Toast.fire({
            icon: "success",
            title: "Titulo registrado con exito",
          });
          this.dialogRef.close();
          this.router.navigate(['./persona/form']);
        },
        error => {
          Toast.fire({
            icon: "error",
            title: "Error al Registrar Título",
          });
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
  
}
