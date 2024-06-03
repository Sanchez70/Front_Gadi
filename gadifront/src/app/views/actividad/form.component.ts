
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
export class FormComponent{
  public actividad: Actividad = new Actividad()
  Tipos: tipo_actividad[] = [];
  tipoSeleccionada: number = 0;
  idtipo: number = 0;
  public titulo: String = "CREAR Actividad"

  constructor(private actividadService: ActividadService,private tipo_actividadService: tipo_actividadService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarActividades()
    this.cargarActividad()
    
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

  public create(): void {
    console.log("llega aqui")
    console.log('id tipo',this.Tipos)
    this.actividadService.create(this.actividad)
      .subscribe(
        (actividad) => {
          this.router.navigate(['/']);
          Swal.fire('Actividad guardada', `Actividad ${actividad.nombre_Actividad} Guardado con éxito`, 'success');
        },
        (error) => {
          console.error('Error al guardar la actividad:', error);
          Swal.fire('Error', 'Hubo un error al guardar la actividad', 'error');
        }
      );
  }

  cargarActividad(): void {
    this.tipo_actividadService.gettipoActividad().subscribe(data => {
      this.Tipos = data;
      console.log('id tipo',this.Tipos)
    });
  }

  onCarreraChange(event:any): void{
    this.tipoSeleccionada = +event.target.value;
    this.idtipo = this.tipoSeleccionada;
  }
}