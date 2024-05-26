import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  constructor(private router: Router) { }

  toggleSidenav() {
    this.sidenav.toggle();
  }
  cerrar(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres Cerrar Sesión?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(`Hata pronto`, 'Sesion cerrada correctamente', 'success');
        this.router.navigate(['./login']);
      }
    });

  }
}
