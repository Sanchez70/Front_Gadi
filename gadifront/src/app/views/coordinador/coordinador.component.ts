import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from '../persona/persona.service';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { GradoOcupacionalService } from '../../Services/grado/grado-ocupacional.service';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { Persona } from '../../Services/docenteService/persona';
import { Grado_ocupacional } from '../../Services/grado/grado_ocupacional';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';
interface PersonaExtendida extends Persona {
  nombre_contrato?: string;
  nombre_titulo?: string;
  nombre_grado_ocp?: string;
}
@Component({
  selector: 'app-coordinador',
  templateUrl: './coordinador.component.html',
  styleUrl: './coordinador.component.css'
})
export class CoordinadorComponent implements OnInit {
  personaEncontrada : Persona = new Persona();
  personaExtendida : PersonaExtendida = new Persona();
  gradoOcupacional : Grado_ocupacional = new Grado_ocupacional();
  tipo_contrato: Tipo_contrato = new Tipo_contrato();
  titulo: Titulo_profesional = new Titulo_profesional();
  cedula: string = '';
  constructor(
    private personaService: PersonaService,
    private tipo_contratoService: TipoContratoService, 
    private tituloService: TituloProfesionalService, 
    private gradoService: GradoOcupacionalService,
    private router: Router,
    private activatedRoute: ActivatedRoute){
  }
  ngOnInit(): void{
    
  }

  buscarPersona(): void{
    this.personaService.getPersonaByCedula(this.cedula).subscribe(data =>{
      this.personaEncontrada = data;
      console.log('id_persona',this.personaEncontrada.id_persona);
      this.loadPersonaData(this.personaEncontrada.id_persona);
    });
    
  }

  loadPersonaData(personaId: number): void {
    this.personaService.getPersonaById(personaId).subscribe(data => {
      this.personaExtendida = { ...data };
      this.tipo_contratoService.getcontratobyId(data.id_tipo_contrato).subscribe(contratos => {
        this.tipo_contrato = contratos;
        this.personaExtendida.nombre_contrato = this.tipo_contrato.nombre_contrato;
        
      });
      this.tituloService.getTitulobyId(data.id_titulo_profesional).subscribe(titulos => {
        this.titulo = titulos;
        this.personaExtendida.nombre_titulo = this.titulo.nombre_titulo;
       
      });
      this.gradoService.getGradobyId(data.id_grado_ocp).subscribe(grados => {
        this.gradoOcupacional = grados;
        this.personaExtendida.nombre_grado_ocp = this.gradoOcupacional.nombre_grado_ocp;
        
      });
    });
  }

  onChangeBuscar(event: any): void{
    this.cedula = event.target.value;
    console.log('cedula ingresada',this.cedula)
  }
}

