import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Carrera } from '../../Services/carreraService/carrera';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { CarreraModalComponent } from './carrera-modal.component';

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
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrl: './carrera.component.css',
})
export class CarreraComponent implements OnInit {
  displayedColumns: string[] = ['nombre_carrera', 'fecha_inicio', 'horas_semanales', 'codigo', 'borrar', 'actualizar'];
  dataSource!: MatTableDataSource<Carrera>;
  color = '#1E90FF';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private carreraService: CarreraService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadCarreras();
  }

  loadCarreras(): void {
    this.carreraService.getCarrera().subscribe(data => {
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
    const dialogRef = this.dialog.open(CarreraModalComponent, {
      width: '400px',
      data: new Carrera()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCarreras();
        Toast.fire({
          icon: "success",
          title: "La carrera ha sido creada correctamente",
        });
      }
    });
  }

  openEditDialog(carrera: Carrera): void {
    const dialogRef = this.dialog.open(CarreraModalComponent, {
      width: '400px',
      data: carrera
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCarreras();
        Toast.fire({
          icon: "success",
          title: "La carrera ha sido actualizada correctamente",
        });
      }
    });
  }

  deleteCarrera(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carreraService.delete(id).subscribe(() => {
          this.loadCarreras();
          Toast.fire({
            icon: "success",
            title: "La carrera ha sido eliminada correctamente",
          });
        });
      }
    });
  }
}
