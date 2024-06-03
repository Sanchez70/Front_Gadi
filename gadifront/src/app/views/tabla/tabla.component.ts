import { Component, OnInit } from '@angular/core';
import { DistributivoService } from './distributivo.service';
import { PersonaService } from '../persona/persona.service';
import { Persona } from '../persona/persona';
import { Periodo } from '../periodo/periodo';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
})
export class TablaComponent implements OnInit {
  personas: Persona[] = [];
  periodos: Periodo[] = [];
  contratos: TipoContrato[] = [];
  grados: GradoOcupacional[] = [];
  titulos: TituloProfecional[] = [];
  filteredPersonas: any[] = [];
  isFiltering: boolean = false;

  constructor(private personaService: PersonaService) { }

  ngOnInit(): void {
  
    this.personaService.getPersonas().subscribe(data => {
      this.personas = data;
      this.updateFilteredPersonas();
    });

    this.personaService.getPeriodos().subscribe(data => {
      this.periodos = data;
    });

    this.personaService.getTiposContratos().subscribe(data => {
      this.contratos = data;
    });

    this.personaService.getGadosOcupacionales().subscribe(data => {
      this.grados = data;
    });

    this.personaService.getTitulosProfecionales().subscribe(data => {
      this.titulos = data;
    });
  }

  updateFilteredPersonas(): void {
    this.filteredPersonas = this.personas;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (!filterValue) {
      this.updateFilteredPersonas();
      return;
    }

    this.isFiltering = true;

    setTimeout(() => {
      this.filteredPersonas = this.personas.filter(persona => {
        return Object.values(persona).some(val =>
          String(val).toLowerCase().includes(filterValue)
        );
      });
      this.isFiltering = false;
    }, 300);
  }
}
