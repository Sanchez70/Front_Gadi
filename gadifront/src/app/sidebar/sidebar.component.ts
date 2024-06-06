import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { style } from '@angular/animations';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  isExpanded = false;
 explan :string ='Abrir';

  constructor(private authService: AuthService, private router: Router) { }

  toggleSidenav() {
    this.sidenav.toggle();
   
    this.isExpanded = !this.isExpanded;

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
        this.authService.logout();
      }
    });

  }

  navbar() :void{

    if(this.explan ==='Abrir'){
      this.explan='Cerrar';
      this.authService.navbar();
      this.toggleSidenav();
    }else if(this.explan ==='Cerrar'){
      this.explan ='Abrir';
       this.toggleSidenav();
       this.authService.navbar();
    }

  }
}
