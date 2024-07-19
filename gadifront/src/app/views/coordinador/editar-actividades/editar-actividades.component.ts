import { Component, OnInit, ViewChild } from '@angular/core';
import { ActividadService } from '../../../Services/actividadService/actividad.service';
import { tipo_actividadService } from '../../../Services/tipo_actividadService/tipo_actividad.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { Actividad } from '../../../Services/actividadService/actividad';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { DistributivoActividad } from '../../../Services/distributivoActividadService/distributivo_actividad';
import { DistributivoActividadService } from '../../../Services/distributivoActividadService/distributivo_actividad.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { tipo_actividad } from '../../../Services/tipo_actividadService/tipo_actividad';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActividaModalComponent } from '../../activida/activida-modal.component';
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
export class EditarActividadesComponent implements OnInit {
  displayedColumns: string[] = ['id_actividad', 'nombre_actividad', 'descripcion_actividad', 'horas_no_docentes', 'id_tipo_actividad', 'actualizar'];
  dataSource!: MatTableDataSource<Actividad>;
  currentExplan: string = '';
  public tipo: tipo_actividad = new tipo_actividad();
  public distributivoAct: DistributivoActividad = new DistributivoActividad();
  public Tipos: tipo_actividad[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tipoActividadService: tipo_actividadService,
    private actividadService: ActividadService,
    private dialog: MatDialog,
    private authService: AuthService,
    private distributivoActividad: DistributivoActividadService) { }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.loadActividades();
    this.loadTiposActividad();
  }

  loadActividades(): void {
    this.actividadService.getActividad().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadTiposActividad(): void {
    this.tipoActividadService.gettipoActividad().subscribe(data => {
      this.Tipos = data;
    });
  }

  obtenerTipoActividad(id_tipo_actividad: number): string {
    const tipoActividad = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo_actividad);
    return tipoActividad ? tipoActividad.nom_tip_actividad : '';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ActividaModalComponent, {
      width: '60%',
      height: '80%',
      data: new Actividad()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadActividades();
        Toast.fire({
          icon: "success",
          title: "La Actividad ha sido creado correctamente",
        });
      }
    });
  }

  openEditDialog(tipoActividad: Actividad): void {
    this.distributivoActividad.getDistributivoActividad().subscribe(filtar => {
      const almacena = filtar;
      const duplicados = [];

      this.authService.distributivos.forEach(recorrido => {
        const filtrarActividades = almacena.find(duplicado => duplicado.id_actividad === tipoActividad.id_actividad && recorrido.id_distributivo === duplicado.id_distributivo);

        if (filtrarActividades) {
          duplicados.push(recorrido.id_distributivo);
        }
      });

      if (duplicados.length > 0) {
        Toast.fire({
          icon: "error",
          title: "Actividad ya seleccionada",
        });
      } else if (this.authService.distributivos.length > 0) {
        // Asigna id_actividad y id_distributivo del primer elemento no duplicado
        this.distributivoAct.id_actividad = tipoActividad.id_actividad;
        this.distributivoAct.id_distributivo = this.authService.distributivos[0].id_distributivo;

        // Crea el registro en distributivoActividad
        this.distributivoActividad.create(this.distributivoAct).subscribe(respuesta => {
          Toast.fire({
            icon: "success",
            title: "Actividad seleccionada",
          });
        });
      } else {
        console.error('No hay distributivos disponibles.');
      }
    });
  }


  deleteTipoActividad(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actividadService.deleteid(id).subscribe(() => {
          this.loadActividades();
          Toast.fire({
            icon: "success",
            title: "Actividad eliminada correctamente",
          });
        });
      }
    });
  }

}