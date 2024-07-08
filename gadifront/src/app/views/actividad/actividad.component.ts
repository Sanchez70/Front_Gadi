import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Actividad } from '../../Services/actividadService/actividad';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { AuthService } from '../../auth.service';
import { ValidacionesComponent } from '../../validaciones/validaciones.component';

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
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrl: './actividad.component.css'
})
export class ActividadComponent implements OnInit {
  Actividades: Actividad[] = [];
  public actividad: Actividad = new Actividad();
  public tipo: tipo_actividad = new tipo_actividad();
  public Tipos: tipo_actividad[] = [];
  actividadForm!: FormGroup;
  currentExplan: string = '';

  constructor(
    private actividadService: ActividadService,
    private tipo_actividadService: tipo_actividadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarTipoActividad();
    this.initForm();
  }

  initForm(): void {
    this.actividadForm = this.fb.group({
      nombre_actividad: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternOnlyLettersValidator())]],
      descripcion_actividad: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternPeriodNameValidator())]],
      horas_no_docentes: ['', [Validators.required, Validators.min(0)]],
      id_tipo_actividad: ['', Validators.required]
    });
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

  public create(): void {
    if (this.actividadForm.invalid) {
      Toast.fire({
        icon: "warning",
        title: "Por favor, completa todos los campos correctamente",
      });
      return;
    }

    this.actividad = {
      ...this.actividad,
      ...this.actividadForm.value,
      id_tipo_actividad: this.actividadForm.value.id_tipo_actividad
    };

    this.actividadService.create(this.actividad)
      .subscribe(
        (actividad) => {
          this.actividad.id_actividad = actividad.id_actividad;
          Toast.fire({
            icon: "success",
            title: "Actividad Guardada Correctamente",
          });
          this.actividadForm.reset();
        },
        (error) => {
          console.error('Error al guardar la actividad:', error);
          Toast.fire({
            icon: "warning",
            title: "Error al guardar la actividad",
          });
        }
      );
  }
  obtenerTipoActividad(id_tipo_actividad: number): string {
    const tipoActividad = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo_actividad);
    return tipoActividad ? tipoActividad.nom_tip_actividad : '';
  }


}