import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { TipoActividadModalComponent } from './tipo-actividad-modal.component';
import { AuthService } from '../../auth.service';

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
  selector: 'app-tipo-actividad',
  templateUrl: './tipo-actividad.component.html',
  styleUrls: ['./tipo-actividad.component.css']
})
export class TipoActividadComponent implements OnInit {
  displayedColumns: string[] = ['nom_tip_actividad', 'borrar', 'actualizar'];
  dataSource!: MatTableDataSource<tipo_actividad>;
  currentExplan: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private tipoActividadService: tipo_actividadService, private dialog: MatDialog, private authService: AuthService,) { }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.loadTipoActividades();
  }

  loadTipoActividades(): void {
    this.tipoActividadService.gettipoActividad().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TipoActividadModalComponent, {
      width: '400px',
      data: new tipo_actividad()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTipoActividades();
        Toast.fire({
          icon: "success",
          title: "El tipo de actividad ha sido creado correctamente",
        });
      }
    });
  }

  openEditDialog(tipoActividad: tipo_actividad): void {
    const dialogRef = this.dialog.open(TipoActividadModalComponent, {
      width: '400px',
      data: tipoActividad
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTipoActividades();
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
      text: 'Se eliminaran tambien todas las Actividades asociadas con este tipo de Actividad',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoActividadService.deleteid(id).subscribe(() => {
          this.loadTipoActividades();
          Toast.fire({
            icon: "success",
            title: "El tipo de actividad ha sido eliminado correctamente",
          });
        });
      }
    });
  }
}
