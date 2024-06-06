
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actividad } from '../../Services/actividadService/actividad';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { DistributivoActividad } from '../../Services/distributivoActividadService/distributivo_actividad';
import Swal from 'sweetalert2';
import { response } from 'express';
import { DistributivoActividadService } from '../../Services/distributivoActividadService/distributivo_actividad.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  public actividad: Actividad = new Actividad()
  public Actividades: Actividad[] = [];
  public tipo: tipo_actividad = new tipo_actividad()
  public Tipos: tipo_actividad[] = [];
  public distributivo: DistributivoActividad = new DistributivoActividad()
  public Distributivos: DistributivoActividad[] = [];
  public titulo: String = "CREAR Actividad"

  constructor(private distributivoService: DistributivoActividadService, private actividadService: ActividadService, private tipo_actividadService: tipo_actividadService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargartipo()
    this.cargarACti()

  }

  cargarACti(): void {
    this.actividadService.getActividad().subscribe((Actividades) => {
      this.Actividades = Actividades;
      console.log("valor", Actividades)
    });
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
          this.actividad.id_actividad = actividad.id_actividad;
          Swal.fire('Actividad guardada', `Actividad ${actividad.nombre_actividad} Guardado con éxito`, 'success');
          //this.createdistributivo();
          this.router.navigate(['/distributivo'])
        },
        (error) => {
          console.error('Error al guardar la actividad:', error);
          Swal.fire('Error', 'Hubo un error al guardar la actividad', 'error');
        }
      );
  }

  //Metodo la guardar en el distributivo aun no usado///
  public createdistributivo(): void {
    this.distributivo.id_actividad = this.actividad.id_actividad
    this.distributivo.hora_no_docente = this.actividad.horas_no_docentes
    this.distributivoService.create(this.distributivo)
      .subscribe(
        (distributivo) => {
          this.router.navigate(['/']);
          console.log("valor", distributivo)
          //Swal.fire('Distributivo guardado', `Actividad ${distributivo.id_distributivo_actividad} Guardado con éxito`, 'success');
        },
        (error) => {
          console.error('Error al guardar la actividad:', error);
          Swal.fire('Error', 'Hubo un error al guardar la actividad', 'error');
        }
      );
  }

}