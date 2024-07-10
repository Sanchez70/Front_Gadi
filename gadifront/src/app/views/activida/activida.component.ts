import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { Actividad } from '../../Services/actividadService/actividad';
import { ActividaModalComponent } from './activida-modal.component';
import { AuthService } from '../../auth.service';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  showCloseButton: true,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

@Component({
  selector: 'app-activida',
  templateUrl: './activida.component.html',
  styleUrls: ['./activida.component.css']
})
export class ActividaComponent implements OnInit {
  displayedColumns: string[] = ['id_actividad','nombre_actividad','descripcion_actividad','horas_no_docentes','id_tipo_actividad', 'borrar', 'actualizar'];
  dataSource!: MatTableDataSource<Actividad>;
  currentExplan: string = '';
  public tipo: tipo_actividad = new tipo_actividad();
  public Tipos: tipo_actividad[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tipoActividadService: tipo_actividadService,
    private actividadService: ActividadService, 
    private dialog: MatDialog, 
    private authService: AuthService,) { }

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
          title: "El tipo de actividad ha sido creado correctamente",
        });
      }
    });
  }

  openEditDialog(tipoActividad: Actividad): void {
    const dialogRef = this.dialog.open(ActividaModalComponent, {
      width: '900px',
      data: tipoActividad
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadActividades();
        Toast.fire({
          icon: "success",
          title: "El tipo de actividad ha sido actualizado correctamente",
        });
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
            title: "El tipo de actividad ha sido eliminado correctamente",
          });
        });
      }
    });
  }
}
