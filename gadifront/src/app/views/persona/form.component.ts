import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../Services/personaService/persona.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  
  constructor(
    private personaService: PersonaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const idPersona = this.authService.id_persona;
    if (idPersona) {
      this.personaService.getPersonaById(idPersona).subscribe(
        (persona) => {
          console.log('Datos de la persona cargados:', persona);
          // Aquí puedes acceder a los datos de la persona y realizar cualquier otra lógica necesaria
        },
        (error) => {
          console.error('Error al cargar los datos de la persona:', error);
        }
      );
    } else {
      console.error('ID de persona no disponible');
    }
  }      
   
}