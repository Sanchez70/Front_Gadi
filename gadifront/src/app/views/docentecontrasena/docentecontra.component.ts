import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { LoginService } from '../../Services/loginService/login.service';
import { PersonaService } from '../../Services/personaService/persona.service';
import { DocenteContraComponentModalComponent } from './docentecontra-modal.component';
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
  selector: 'app-docentecontra',
  templateUrl: './docentecontra.component.html',
  styleUrls: ['./docentecontra.component.css']
})
export class DocenteContraComponent implements OnInit {
  displayedColumns: string[] = ['usuario', 'nombre1', 'nombre2', 'apellido1',  'apellido2', 'contra', 'actualizar'];
  dataSource!: MatTableDataSource<any>; 
  currentExplan: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loginService: LoginService,
    private personaService: PersonaService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.loadUsuariosAndPersonas();
  }

  loadUsuariosAndPersonas(): void {
    this.loginService.getUsuario().subscribe(users => {
      this.personaService.getPersonas().subscribe(personas => {
        const combinedData = users.map(user => {
          const persona = personas.find(p => p.id_persona === user.id_usuario);
          return {
            ...user,
            nombre1: persona ? persona.nombre1 : '',
            nombre2: persona ? persona.nombre2 : '',
            apellido1: persona ? persona.apellido1 : '',
            apellido2: persona ? persona.apellido2 : ''
          };
        });
        this.dataSource = new MatTableDataSource(combinedData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditDialog(usuario: any): void {
    const dialogRef = this.dialog.open(DocenteContraComponentModalComponent, {
      width: '400px',
      data: { usuario: usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsuariosAndPersonas();
        Toast.fire({
          icon: "success",
          title: "La contraseña ha sido actualizada correctamente",
        });
      }
    });
  }
}