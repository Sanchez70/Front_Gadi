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
import { CicloService } from '../../Services/cicloService/ciclo.service';
import { Ciclo } from '../../Services/cicloService/ciclo';

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
  styleUrl: './crud-asignatura.component.css'
})
export class CrudAsignaturaComponent implements OnInit {

  displayedColumns: string[] = ['nombre_asignatura', 'horas_semanales', 'carrera', 'ciclo', 'actualizar'];
  dataSource!: MatTableDataSource<Asignatura>;
  color = '#1E90FF';
  currentExplan: string = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private sidebarSubscription!: Subscription;

  constructor(private asignaturaService: AsignaturaService,
    private dialog: MatDialog,
    private authService: AuthService,
    private cicloService: CicloService
  ) { }

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

  loadAsignaturas(): void {
    this.asignaturaService.getAsignaturasCrud().subscribe(data => {
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
    const dialogRef = this.dialog.open(AsignaturaModalComponent, {
      width: '400px',
      data: new Asignatura()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAsignaturas();
        Toast.fire({
          icon: "success",
          title: "Asignatura creada correctamente",
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
        this.loadAsignaturas();
        Toast.fire({
          icon: "success",
          title: "Asignatura actualizada correctamente",
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
          this.loadAsignaturas();
          Toast.fire({
            icon: "success",
            title: "Asignatura eliminada correctamente",
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
}