import { Component, OnInit } from '@angular/core';
import { Persona } from '../../Services/docenteService/persona';
import { DocenteService } from '../../Services/docenteService/docente.service';
import { AuthService } from '../../auth.service';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { GradoOcupacionalService } from '../../Services/grado/grado-ocupacional.service';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';

@Component({
  selector: 'app-distributivo',
  templateUrl: './distributivo.component.html',
  styleUrl: './distributivo.component.css'
})
export class DistributivoComponent implements OnInit {
  static idpersona: number = 0;
  public persona: Persona = new Persona();
  public contrato: Tipo_contrato = new Tipo_contrato();
  public titulo: Titulo_profesional= new Titulo_profesional();
  personas: Persona[] = [];
  currentExplan: string = '';
  id_contrato: any;
  constructor(private docenteService: DocenteService, private authService: AuthService, private tipo_contrato: TipoContratoService, private titulo_profesional:TituloProfesionalService, private grado_ocupacional:GradoOcupacionalService) {
  }
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.buscarprsona();
  }

  buscarprsona(): void {
    this.docenteService.getpersonabyId(DistributivoComponent.idpersona).subscribe(data => {
      this.persona = data;
      this.tipo_contrato.getcontratobyId(data.id_tipo_contrato).subscribe(
        contratos => {
          this.contrato = contratos;

        });
      this.titulo_profesional.getTitulobyId(data.id_titulo_profesional).subscribe(titulos=>{
          this.titulo= titulos;
      });
      

    });
  }

}
