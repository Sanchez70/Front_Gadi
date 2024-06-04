
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actividad } from '../../Services/actividadService/actividad';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import Swal from 'sweetalert2';
import { response } from 'express';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  public actividad: Actividad = new Actividad()
  public tipo: tipo_actividad = new tipo_actividad()
  public Tipos: tipo_actividad[] = [];
  public titulo: String = "CREAR Actividad"

  constructor(private actividadService: ActividadService, private tipo_actividadService: tipo_actividadService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarActividades()
    //this.cargarTipoActividad()
    this.cargartipo()

  }

  cargarActividades(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.actividadService.getActividadbyId(id).subscribe((actividad) => {
          this.actividad = actividad;
        })
      }
    })
  }

  cargartipo(): void {
    this.tipo_actividadService.gettipoActividad().subscribe((Tipos) => {
      this.Tipos = Tipos;
    });
  }

  public create(): void {
    this.actividad.id_tipo_actividad = this.tipo.id_tipo_actividad
    this.actividadService.create(this.actividad)
      .subscribe(
        (actividad) => {
          this.router.navigate(['/']);
          Swal.fire('Actividad guardada', `Actividad ${actividad.nombre_actividad} Guardado con éxito`, 'success');
        },
        (error) => {
          console.error('Error al guardar la actividad:', error);
          Swal.fire('Error', 'Hubo un error al guardar la actividad', 'error');
        }
      );
  }
}