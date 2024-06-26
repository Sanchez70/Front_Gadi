import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { Periodo } from '../../Services/periodoService/periodo';
import { PeriodoService } from '../../Services/periodoService/periodo.service';
import { PeriodoModalComponent } from './periodo-modal.component';


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
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrl: './periodo.component.css'
})
export class PeriodoComponent implements OnInit{


  displayedColumns: string[] = ['nombre_periodo', 'inicio_periodo', 'fin_periodo', 'estado', 'borrar', 'actualizar'];
  dataSource!: MatTableDataSource<Periodo>;
  color = '#1E90FF';
  currentExplan: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private sidebarSubscription!: Subscription;

  constructor(private periodoService: PeriodoService, private dialog: MatDialog, private authService: AuthService,) { }

  ngOnInit(): void {
    this.loadPeriodos();

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


  loadPeriodos(): void {
    this.periodoService.getPeriodo().subscribe(data => {
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
    const dialogRef = this.dialog.open(PeriodoModalComponent, {
      width: '400px',
      data: new Periodo()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPeriodos();
        Toast.fire({
          icon: "success",
          title: "La periodo ha sido creada correctamente",
        });
      }
    });
  }

  openEditDialog(periodo: Periodo): void {
    const dialogRef = this.dialog.open(PeriodoModalComponent, {
      width: '400px',
      data: periodo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPeriodos();
        Toast.fire({
          icon: "success",
          title: "La periodo ha sido actualizada correctamente",
        });
      }
    });
  }

  deletePeriodo(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.periodoService.delete(id).subscribe(() => {
          this.loadPeriodos();
          Toast.fire({
            icon: "success",
            title: "La periodo ha sido eliminada correctamente",
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
