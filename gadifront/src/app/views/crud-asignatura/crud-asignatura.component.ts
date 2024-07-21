import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { AsignaturaModalComponent } from './asignatura-model.component';

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
  selector: 'app-crud-asignatura',
  templateUrl: './crud-asignatura.component.html',
  styleUrls: ['./crud-asignatura.component.css'] // Corregido el nombre de la propiedad
})
export class CrudAsignaturaComponent implements OnInit {
  displayedColumns: string[] = ['nombre_asignatura', 'horas_semanales', 'carrera', 'ciclo', 'actualizar'];
  dataSource!: MatTableDataSource<Asignatura>;
  color = '#1E90FF';
  currentExplan: string = '';
  filterValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private sidebarSubscription!: Subscription;

  constructor(private asignaturaService: AsignaturaService,
    private dialog: MatDialog,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.loadAsignaturas();

    this.sidebarSubscription = this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
      this.adjustTable();
    });
  }

  ngAfterViewInit(): void {
    this.adjustTable();
  }

  ngOnDestroy(): void {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  loadAsignaturas(callback?: () => void): void {
    this.asignaturaService.getAsignaturasCrud().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (callback) {
        callback();
      }
    });
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AsignaturaModalComponent, {
      width: '400px',
      data: new Asignatura()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAsignaturas(() => {
          Toast.fire({
            icon: "success",
            title: "Asignatura creada correctamente",
          });
          this.applyStoredFilter();
        });
      }
    });
  }

  openEditDialog(asignatura: Asignatura): void {
    const dialogRef = this.dialog.open(AsignaturaModalComponent, {
      width: '400px',
      data: asignatura
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAsignaturas(() => {
          Toast.fire({
            icon: "success",
            title: "Asignatura actualizada correctamente",
          });
          this.applyStoredFilter();
        });
      }
    });
  }

  deleteAsignatura(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.asignaturaService.delete(id).subscribe(() => {
          this.loadAsignaturas(() => {
            Toast.fire({
              icon: "success",
              title: "Asignatura eliminada correctamente",
            });
            this.applyStoredFilter();
          });
        });
      }
    });
  }

  adjustTable(): void {
    if (this.dataSource && this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      window.dispatchEvent(new Event('resize'));
    }
  }

  applyStoredFilter(): void {
    this.dataSource.filter = this.filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
