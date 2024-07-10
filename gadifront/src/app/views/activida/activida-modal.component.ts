import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import Swal from 'sweetalert2';
import { ValidacionesComponent } from '../../validaciones/validaciones.component'; // Asegúrate de ajustar la ruta de importación según la estructura de tu proyecto
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Actividad } from '../../Services/actividadService/actividad';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-activida-modal',
  templateUrl: './activida-modal.component.html',
  styleUrls: ['./activida-modal.component.css']
})
export class ActividaModalComponent implements OnInit {

  public validaciones = ValidacionesComponent;
  actividadForm!: FormGroup;
  Actividades: Actividad[] = [];
  public actividad: Actividad = new Actividad();
  public tipo: tipo_actividad = new tipo_actividad();
  public Tipos: tipo_actividad[] = [];
  currentExplan: string = '';

  constructor(
    public dialogRef: MatDialogRef<ActividaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Actividad, // Cambiado a Actividad para aceptar datos existentes
    private tipoActividadService: tipo_actividadService,
    private authService: AuthService,
    private fb: FormBuilder,
    private actividadService: ActividadService,
    private tipo_actividadService: tipo_actividadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.cargarTipoActividad();
    this.initForm();
    if (this.data) {
      this.actividad = this.data; // Asignar datos existentes a actividad
      this.actividadForm.patchValue(this.data); // Cargar los datos en el formulario
    }
  }

  cargarTipoActividad(): void {
    this.tipo_actividadService.gettipoActividad().subscribe(
      (Tipos) => {
        this.Tipos = Tipos;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  initForm(): void {
    this.actividadForm = this.fb.group({
      nombre_actividad: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternOnlyNames())]],
      descripcion_actividad: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternDescripValidator())]],
      horas_no_docentes: ['', [Validators.required, Validators.min(0)]],
      id_tipo_actividad: ['', Validators.required]
    });
  }

  save(): void {
    if (this.actividadForm.invalid) {
      Swal.fire('Error', 'Por favor, completa todos los campos correctamente', 'error');
      return;
    }

    const nombreActividad = this.actividadForm.get('nombre_actividad')?.value.trim();
    if (!this.validaciones.patternOnlyLettersValidator().test(nombreActividad)) {
      Swal.fire('Error', 'Ingrese un nombre válido (solo letras, 2-20 caracteres)', 'error');
      return;
    }

    this.actividad = {
      ...this.actividad,
      ...this.actividadForm.value,
      id_tipo_actividad: this.actividadForm.value.id_tipo_actividad
    };

    if (this.actividad.id_actividad) {
      // Actualizar actividad existente
      this.actividadService.update(this.actividad).subscribe(
        () => {
          Swal.fire('Éxito', 'La actividad ha sido actualizada', 'success');
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al actualizar la actividad:', error);
          Swal.fire('Error', 'No se pudo actualizar la actividad', 'error');
        }
      );
    } else {
      // Crear nueva actividad
      this.actividadService.create(this.actividad).subscribe(
        (actividad) => {
          this.actividad.id_actividad = actividad.id_actividad;
          Swal.fire('Éxito', 'La actividad ha sido creada', 'success');
          this.actividadForm.reset();
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al crear la actividad:', error);
          Swal.fire('Error', 'No se pudo crear la actividad', 'error');
        }
      );
    }
  }

  obtenerTipoActividad(id_tipo_actividad: number): string {
    const tipoActividad = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo_actividad);
    return tipoActividad ? tipoActividad.nom_tip_actividad : '';
  }

  cancel(): void {
    this.dialogRef.close();
  }
}