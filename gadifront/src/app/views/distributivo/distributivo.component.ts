import { Component, OnInit } from '@angular/core';
import { Persona } from '../../Services/docenteService/persona';
import { DocenteService } from '../../Services/docenteService/docente.service';
import { AuthService } from '../../auth.service';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { GradoOcupacionalService } from '../../Services/grado/grado-ocupacional.service';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';
import { Grado_ocupacional } from '../../Services/grado/grado_ocupacional';
import { Actividad } from '../../Services/actividadService/actividad';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { Ciclo } from '../../Services/cicloService/ciclo';
import { CicloService } from '../../Services/cicloService/ciclo.service';



@Component({
  selector: 'app-distributivo',
  templateUrl: './distributivo.component.html',
  styleUrl: './distributivo.component.css'
})
export class DistributivoComponent implements OnInit {

  public persona: Persona = new Persona();
  public contrato: Tipo_contrato = new Tipo_contrato();
  public titulo: Titulo_profesional = new Titulo_profesional();
  public asignatura: Asignatura = new Asignatura();
  public grado: Grado_ocupacional = new Grado_ocupacional();
  public actividad: Actividad = new Actividad()
  public Actividades: Actividad[] = [];
  public tipo: tipo_actividad = new tipo_actividad()
  public Tipos: tipo_actividad[] = [];
  public ciclos: any[] = [];
  public asignaturas: any[] = [];

  personas: Persona[] = [];
  currentExplan: string = '';
  id_contrato: any;
  constructor(private tipo_actividadService: tipo_actividadService,private actividadService: ActividadService,private docenteService: DocenteService, private authService: AuthService, private tipo_contrato: TipoContratoService, private titulo_profesional: TituloProfesionalService, private grado_ocupacional: GradoOcupacionalService, private asignaturaSeleccionada: AsignaturaService, private cicloService: CicloService) {
  }
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.buscarprsona();
    this.cargarACti();
    this.cargarTipoActividad();
    this.buscarAsignaturas();
  }

  buscarprsona(): void {
    this.docenteService.getpersonabyId(this.authService.id_persona).subscribe(data => {
      this.persona = data;
      this.tipo_contrato.getcontratobyId(data.id_tipo_contrato).subscribe(
        contratos => {
          this.contrato = contratos;

        });
      this.titulo_profesional.getTitulobyId(data.id_titulo_profesional).subscribe(titulos => {
        this.titulo = titulos;
      });
      this.grado_ocupacional.getGradobyId(data.id_grado_ocp).subscribe(grados => {
        this.grado = grados;
      });

    });
  }

  cargarACti(): void {
    this.actividadService.getActividad().subscribe((Actividades) => {
      this.Actividades = Actividades;
      console.log("valor",Actividades)
    });
  }

  cargartipo(): void {
    this.tipo_actividadService.gettipoActividad().subscribe((Tipos) => {
      this.Tipos = Tipos;
    });
  }

  cargarCiclos(): void{
    this.cicloService.getCiclo().subscribe(data => {
      this.ciclos = data;
    });
  }
  cargarTipoActividad(): void {
    this.tipo_actividadService.gettipoActividad().subscribe(
      (Tipos) => {
        this.Tipos = Tipos;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  obtenerTipoActividad(id_tipo_actividad: number): string {
    const tipoActividad = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo_actividad);
    return tipoActividad ? tipoActividad.nom_tip_actividad : '';
  }

  buscarAsignaturas(): void{
    this.authService.id_asignaturas.forEach(asignatura => {
      const idAsignaturas: any = asignatura.id_asignatura
  
      this.asignaturaSeleccionada.getAsignaturabyId(idAsignaturas).subscribe(response => {
        this.asignatura = response;
        this.asignaturas.push(this.asignatura);
        console.log('Asignatura cargadas',this.asignaturas);
      }, error => {
        
        console.log('Error al crear', error);
      });
    });
  }

  obtenerNombreCiclo(id_ciclo:number):void{
    this.cargarCiclos();
    const ciclo = this.ciclos.find(ciclo => ciclo.id_ciclo === id_ciclo);
    return ciclo ? ciclo.nombre_ciclo : '';
  }


}
