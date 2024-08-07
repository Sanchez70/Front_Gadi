import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../Services/docenteService/docente.service';
import { Persona } from '../../Services/docenteService/persona';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
  personas: Persona[] = [];
  personaSeleccionada: Persona[] = [];
  personasSeleccionada: Persona[] = [];
  public persona: Persona = new Persona();
  currentExplan: string = '';

  constructor(
    private docenteService: DocenteService, 
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarPersonas();
  }

  cargarPersonas(): void {
    this.docenteService.getPersona().subscribe(data => {
      this.personas = data;
    });
  }

  searchTerm: string = '';

  get filteredPersonas(): Persona[] {
    if (!this.searchTerm) {
      return this.personas;
    }
    return this.personas.filter(persona =>
      persona.cedula.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onInput(event: any): void {
    this.searchTerm = event.target.value;
  }

  escogerPersona(persona: Persona): void {
    const personaExistente = this.personasSeleccionada.some(
      (id) => id.id_persona === persona.id_persona
    );
    if (!personaExistente) {
      this.personasSeleccionada.push(persona);
      this.authService.id_persona = persona.id_persona;
      this.authService.saveUserToLocalStorage();
      this.router.navigate(['./distributivo']);
    } else {
      Swal.fire({
        title: "La persona ya está seleccionada",
        position: "top-end",
        showConfirmButton: false,
        width: "500px",
        icon: "warning",
        heightAuto: true,
        timer: 1500,
        showClass: {
          popup: `animate__animated animate__fadeInUp animate__faster`
        },
        hideClass: {
          popup: `animate__animated animate__fadeOutDown animate__faster`
        }
      });
    }
  }
}