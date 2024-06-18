import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Actividad } from '../../Services/actividadService/actividad';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { AuthService } from '../../auth.service';
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
  currentExplan: string='';
  constructor(private actividadService: ActividadService, private tipo_actividadService: tipo_actividadService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarTipoActividad();
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

  public create(form:any): void {
    this.actividad.id_tipo_actividad = this.tipo.id_tipo_actividad
    this.actividadService.create(this.actividad)
      .subscribe(
        (actividad) => {
          this.actividad.id_actividad = actividad.id_actividad;
          Toast.fire({
            icon: "success",
            title: "Actividad Guardada Correctamente",
          });
          form.resetForm();
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