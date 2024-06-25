import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../Services/personaService/persona.service';
import { AuthService } from '../../auth.service';
import { Persona } from '../../Services/docenteService/persona';
import { Usuario } from '../../Services/loginService/usuario';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  persona: Persona = new Persona();
  usuario: Usuario = new Usuario(); 
  titulosProfesionales: TituloProfecional[] = [];
  mostrarCarga: boolean = false;

  constructor(
    private personaService: PersonaService,
    private authService: AuthService
  ) {
    this.persona.fecha_vinculacion = new Date();
  }

  ngOnInit(): void {
    const idPersona = this.authService.id_persona;
    if (idPersona) {
      this.personaService.getPersonaById(idPersona).subscribe(
        (persona) => {
          this.persona = persona;
        },
        (error) => {
          console.error('Error al cargar los datos de la persona:', error);
        }
      );
    } else {
      console.error('ID de persona no disponible');
    }
  }
  
  guardarCambios(): void {
    this.mostrarCarga = true;
    this.personaService.updatePersona(this.persona).subscribe(
      (response) => {
        console.log('Persona actualizada exitosamente:', response);
        this.mostrarCarga = false;
        this.mostrarMensaje('Datos actualizados correctamente', 'success');
      },
      (error) => {
        console.error('Error al actualizar persona:', error);
        this.mostrarCarga = false;
        this.mostrarMensaje('Error al actualizar los datos', 'error');
      }
    );
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    Swal.fire({
      icon: tipo,
      title: mensaje,
      showConfirmButton: false,
      timer: 2000
    });
  }

}
