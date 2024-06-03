import { Component,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Actividad } from '../../Services/actividadService/actividad';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { FormBuilder, FormGroup } from '@angular/forms'
@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrl: './actividad.component.css'
})
export class ActividadComponent implements OnInit{
  Actividades: Actividad[] = [];
  constructor(private actividadService: ActividadService) { }

  ngOnInit(): void {
    this.actividadService.getActividad().subscribe(
      Actividades => this.Actividades = Actividades
    );
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