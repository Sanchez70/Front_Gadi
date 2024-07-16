import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../Services/personaService/persona.service';
import { AuthService } from '../../auth.service';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ValidacionesComponent } from '../../validaciones/validaciones.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';

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
  isEditMode: boolean = false;
  titulo: Titulo_profesional = new Titulo_profesional();

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TituloProfesionalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tituloService: TituloProfesionalService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.isEditMode = !!this.data; // Si hay data, está en modo edición

    if (this.isEditMode) {
      this.loadTituloData(this.data);
    }
  }

  initializeForm(): void {
    const idPersona = this.authService.id_persona;
    this.tituloForm = this.fb.group({
      id: [null],
      id_persona: [idPersona, Validators.required],
      grado: ['', Validators.required],
      nombre_titulo: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patterntitleValidator())]]
    });

    // Transformar 'nombre_titulo' a mayúsculas
    this.tituloForm.get('nombre_titulo')?.valueChanges.subscribe(value => {
      this.tituloForm.get('nombre_titulo')?.setValue(value.toUpperCase(), { emitEvent: false });
    });
  }

  loadTituloData(titulo: any): void {

    this.titulo = titulo;

    this.tituloForm.patchValue({
      id: titulo.id_titulo_profesional,
      id_persona: titulo.id_persona,
      grado: titulo.grado,
      nombre_titulo: titulo.nombre_titulo
    });
  }

  guardarTitulo(): void {
    const tituloData = this.tituloForm.value;
  
    if (this.tituloForm.valid) {
      if (this.isEditMode) {
        // Editar título existente
        this.titulo.nombre_titulo = tituloData.nombre_titulo;
        this.titulo.grado = tituloData.grado;
        this.tituloService.update(this.titulo).subscribe(
          response => {
            Toast.fire({
              icon: "success",
              title: "Título actualizado con éxito",
            });
            this.dialogRef.close();
            this.router.navigate(['./persona/form']);
          },
          error => {
            Toast.fire({
              icon: "error",
              title: "Error al actualizar el título",
            });
          }
        );
      } else {
        // Crear nuevo título
        this.tituloService.create(tituloData).subscribe(
          response => {
            Toast.fire({
              icon: "success",
              title: "Título registrado con éxito",
            });
            this.dialogRef.close();
            this.router.navigate(['./persona/form']);
          },
          error => {
            Toast.fire({
              icon: "error",
              title: "Error al registrar el título",
            });
          }
        );
      }
    } else {
      console.log('Formulario no válido');
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
