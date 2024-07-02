import { Component } from '@angular/core';
import { ActividadService } from '../../../Services/actividadService/actividad.service';
import { tipo_actividadService } from '../../../Services/tipo_actividadService/tipo_actividad.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { Actividad } from '../../../Services/actividadService/actividad';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { DistributivoActividad } from '../../../Services/distributivoActividadService/distributivo_actividad';
import { DistributivoActividadService } from '../../../Services/distributivoActividadService/distributivo_actividad.service';
import { MatDialog } from '@angular/material/dialog';
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
  selector: 'app-editar-actividades',
  templateUrl: './editar-actividades.component.html',
  styleUrl: './editar-actividades.component.css'
})
export class EditarActividadesComponent {
  currentExplan: string = '';
  myForm: FormGroup = this.fb.group({});
  public Actividades: Actividad[] = [];
  public Tipos: any[] = [];
  actividadesFiltrada: any[] = [];
  actividadesSeleccionadas: Actividad[] = [];
  tipoActividadSeleccionado: number = 0;
  idTipo: number = 0;
  distributivoActividad: DistributivoActividad = new DistributivoActividad();
  horasTotales: number = 0;
  constructor(private dialog: MatDialog, private distributivoActividadService: DistributivoActividadService, private actividadService: ActividadService, private tipo_actividadService: tipo_actividadService, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });

    this.myForm = this.fb.group({
      tipoActividadSeleccionado: [null, Validators.required]
    })
    this.cargarActividadObtenida();
    this.cargartipo();
  }

  cargarActividadObtenida(): void {
    this.actividadesSeleccionadas = this.authService.id_actividades;
  }

  cargarACti(): Observable<void> {
    return new Observable(observer => {
      this.actividadService.getActividad().subscribe(data => {
        this.Actividades = data;
        observer.next();
        observer.complete();
      });
    });
  }

  cargartipo(): void {
    this.tipo_actividadService.gettipoActividad().subscribe((Tipos) => {
      this.Tipos = Tipos;
    });
  }

  filtrarActividadabyTipo(): void {
    this.cargarACti().subscribe(() => {
      this.actividadesFiltrada = this.Actividades.filter(
        (actividad) =>
          (this.tipoActividadSeleccionado === null || actividad.id_tipo_actividad === this.idTipo)
      );
      console.log('actividad filtrada por tipo', this.actividadesFiltrada);
    });
  }

  escogerActividad(actividad: Actividad): void {
    const actividadExistente = this.actividadesSeleccionadas.some(
      (id) => id.id_actividad === actividad.id_actividad
    );
    if (!actividadExistente) {
      this.actividadesSeleccionadas.push(actividad);
      this.calcularHorasTotales();
    } else {
      Toast.fire({
        icon: "warning",
        title: "La actividad se encuentra seleccionada",
      });
    }
  }

  eliminarActividad(fila: number): void {
    this.actividadesSeleccionadas.splice(fila, 1);
    this.calcularHorasTotales()
  }

  calcularHorasTotales(): void {
    this.horasTotales = this.actividadesSeleccionadas.reduce(
      (sum, actividad) => sum + actividad.horas_no_docentes, 0
    );
  }

  enviarActividades(): void {
  
      this.authService.id_actividades = this.actividadesSeleccionadas;
      this.distributivoActividad.id_distributivo = this.authService.id_distributivo;
  
      this.distributivoActividadService.getDistributivoActividad().subscribe(data => {
        const distributivoEncontrado = data as DistributivoActividad[];
  
        // Filtrar los distributivos que coinciden con el distributivo seleccionado
        const distributivosFinales = distributivoEncontrado.filter(resul =>
          this.authService.distributivos.some(dist => dist.id_distributivo === resul.id_distributivo)
        );
  
        const deleteObservables = distributivosFinales.map(distributivoFinal =>
          this.distributivoActividadService.delete(distributivoFinal.id_distributivo_actividad)
        );
  
        forkJoin(deleteObservables).subscribe(() => {
          if (this.authService.distributivos.length > 0) {
            const primaryDistributivo = this.authService.distributivos[0]; // Utiliza solo el primer distributivo
            const createObservables = this.actividadesSeleccionadas.map(data => {
              const newDistributivoActividad = { ...primaryDistributivo, id_actividad: data.id_actividad };
              return this.distributivoActividadService.create(newDistributivoActividad);
            });
  
            forkJoin(createObservables).subscribe(responses => {
              const idsDistributivoActividad = responses.map(respuest => respuest.id_distributivo_actividad);
              this.authService.id_distributivoActividad = idsDistributivoActividad;
              this.authService.saveUserToLocalStorage();
              this.dialog.closeAll();
            });
          }
        });
      });

  }
  



  onTipoChange(event: any): void {
    this.tipoActividadSeleccionado = +event.target.value;
    this.idTipo = this.tipoActividadSeleccionado;
    console.log('paralelo', this.tipoActividadSeleccionado);
    this.filtrarActividadabyTipo();
    this.myForm.get('tipoActividadSeleccionado')?.setValue(event.target.value);
  }

  obtenerNombreTipo(id_tipo: number): void {
    const tipo = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo);
    return tipo ? tipo.nom_tip_actividad : '';
  }

  crearDistributivoActividad(): void {

  }

}