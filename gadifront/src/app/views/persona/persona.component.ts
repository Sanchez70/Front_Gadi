import { Component } from '@angular/core';
import { DocenteService } from '../../Services/docenteService/docente.service';


@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.css'
})
export class PersonaComponent {
  persona: any[] = [];

  constructor(private docenteService:DocenteService){

  }
  cargarAsignaturas(): void{
    this.docenteService.getPersona().subscribe(data =>{
      this.persona = data;
    });
  }
}
