import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar-coordinador',
  templateUrl: './sidebar-coordinador.component.html',
  styleUrl: './sidebar-coordinador.component.css'
})
export class SidebarCoordinadorComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  mostrarDocente: boolean = false;
  isExpanded = true;
  explan: string = 'Abrir';

  constructor(private authService: AuthService, private router: Router) { }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
    this.sidenav.toggle();
  }

  cerrar(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres Cerrar Sesión?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(`Hasta pronto`, 'Sesion cerrada correctamente', 'success');
        this.router.navigate(['./login']);
        this.authService.logout();
        this.authService.tiporol='';
        this.authService.clearLocalStorage();
      }
    });
  }

  navbar(): void {
    if (this.explan === 'Abrir') {
      this.explan = 'Cerrar';
    } else if (this.explan === 'Cerrar') {
      this.explan = 'Abrir';
    }
    this.toggleSidenav();
  }
}
