import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Actividad } from '../../Services/actividadService/actividad';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrl: './actividad.component.css'
})
export class ActividadComponent implements OnInit {
  Actividades: Actividad[] = [];
  public Tipos: tipo_actividad[] = [];

  constructor(private actividadService: ActividadService, private tipo_actividadService: tipo_actividadService) { }

  ngOnInit(): void {
    this.cargarActividad();
    this.cargarTipoActividad();
  }

  cargarActividad(): void {
    this.actividadService.getActividad().subscribe(
      (Actividades) => {
        this.Actividades = Actividades;
      },
      (error) => {
        console.error(error);
      }
    );
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
  obtenerTipoActividad(id_tipo_actividad: number): string {
    const tipoActividad = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo_actividad);
    return tipoActividad ? tipoActividad.nom_tip_actividad : '';
  }
  ///metodo para borra si se desea
  // delete(actividad: Actividad): void {
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: `¿Quieres eliminar el Servicio ${actividad.nombre_actividad}?`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Sí, Eliminar',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.actividadService.deleteid(actividad.id_tipo_actividad).subscribe(
  //         () => {
  //           this.actividadService.getActividad().subscribe(
  //             (actividades) => {
  //               this.Actividades = actividades;
  //               Swal.fire('Actividad eliminada', `Actividad ${actividad.nombre_actividad} eliminado con éxito`, 'success');
  //             },
  //           );
  //         },
  //       );
  //     }
  //   });
  // }
}