import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../Services/docenteService/docente.service';
import { Persona } from '../../Services/docenteService/persona';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.css'
})
export class PersonaComponent implements OnInit {
  personas: any[] = [];
  personaSeleccionada: any[] = [];
  personasSeleccionada: Persona[] = [];
  public persona:Persona = new Persona();
  
  
  constructor(private docenteService:DocenteService, private router: Router){

  }
  ngOnInit(): void {
    this.cargarPersonas();
  }
  cargarPersonas(): void{
    console.log(this.personaSeleccionada)
    this.docenteService.getPersona().subscribe(data =>{
      this.personaSeleccionada = data;
      console.log(this.personaSeleccionada)
    });  
  }

  escogerPersona(persona:Persona): void{
    const personaExistente = this.personasSeleccionada.some(
      (id) => id.id_persona === persona.id_persona
    );
    if(!personaExistente){
     this.personasSeleccionada.push(persona);
    }else{
      Swal.fire({
        title: "La asignatura se encuentra seleccionada",
        position: "top-end",
        showConfirmButton: false,
        width: "500px",
        icon: "warning",
        heightAuto: true,
        timer: 1500,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
    }
  }
}
