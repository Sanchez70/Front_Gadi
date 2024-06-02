import { Component, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
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
  styleUrl: './tabla.component.css',
})
export class TablaComponent implements OnInit {
  personas: Persona[] = [];
  periodos: Periodo[] = [];
  contratos: TipoContrato[] = [];
  grados: GradoOcupacional[] = [];
  titulos: TituloProfecional[] = [];

  constructor(private personaService: PersonaService) { }

  ngOnInit(): void {
    this.personaService.getPersonas().subscribe(data => {
      this.personas = data;
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
}
