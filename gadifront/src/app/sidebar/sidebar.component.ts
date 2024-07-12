import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../environment/appConfig';
import { PersonaService } from '../Services/personaService/persona.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  mostrarDocente: boolean = false;
  isExpanded = true;
  explan: string = 'Abrir';
  inicialesUsuario: string = '';
  constructor(private authService: AuthService, private router: Router,  private personaService: PersonaService) { }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
    this.sidenav.toggle();
  }
  ngOnInit(): void { 
    this.fetchUserDetails(); 
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
        localStorage.clear();
        
      }
    });
  }

  navbar(): void {
    if (this.explan === 'Abrir') {
      this.explan = 'Cerrar'
      this.authService.navbar();
      this.toggleSidenav();
    } else if (this.explan === 'Cerrar') {
      this.explan = 'Abrir';
      this.authService.navbar();
      this.toggleSidenav();
    }
  
  }

  limpiar():void{
    this.authService.id_persona='';
    this.authService.id_asignaturas=[];
  }

  fetchUserDetails(): void {
    console.log('Fetching user details');
    const user = this.authService.getUser();
    console.log('User from localStorage:', user);

    const id_persona = user.id_persona;

    if (id_persona) {
      console.log('id_persona found:', id_persona);
      this.personaService.getPersonaById(id_persona).subscribe(
        (persona) => {
          console.log('Persona details fetched:', persona);
          const nombre = persona.nombre1 || '';
          const apellido = persona.apellido1 || '';
          this.inicialesUsuario = this.getInitials(nombre, apellido);
          console.log('User initials set to:', this.inicialesUsuario);
        },
        (error) => {
          console.error('Error fetching persona details:', error);
        }
      );
    } else {
      console.error('No id_persona found in user data');
    }
  }

  getInitials(nombre: string, apellido: string): string {
    if (!nombre || !apellido) return 'U'; 
    const initials = `${nombre.charAt(0)}${apellido.charAt(0)}`;
    console.log('Initials generated:', initials);
    return initials.toUpperCase();
  }
}
