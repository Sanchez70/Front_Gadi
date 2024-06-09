import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { CicloService } from '../../Services/cicloService/ciclo.service';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { JornadaService } from '../../Services/jornadaService/jornada.service';
import { DistributivoAsignaturaService } from '../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { AuthService } from '../../auth.service';
import { DistributivoService } from '../../Services/distributivoService/distributivo.service';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { DistributivoActividadService } from '../../Services/distributivoActividadService/distributivo_actividad.service';
import { PersonaService } from '../persona/persona.service';
import { Persona } from '../../Services/docenteService/persona';
import { Grado_ocupacional } from '../../Services/grado/grado_ocupacional';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';
import { GradoOcupacionalService } from '../../Services/grado/grado-ocupacional.service';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
interface PersonaExtendida extends Persona {
  nombre_contrato?: string;
  nombre_titulo?: string;
  nombre_grado_ocp?: string;
}
@Component({
  selector: 'app-matriz-propuesta',
  templateUrl: './matriz-propuesta.component.html',
  styleUrl: './matriz-propuesta.component.css'
})
export class MatrizPropuestaComponent implements OnInit{
asignaturas: any[] = [];
actividades: any[] = [];
ciclos: any[] = [];
carreras: any[] = [];
distributivos: any[] = [];
distributivoFiltrado: any[] = [];
distributivoAsignaturas: any[] = [];
distributivoAsignaturasFiltrado: any[] = [];
distributivoActividades: any[] = [];
distributivoActividadesFiltrado: any[] = [];
asignaturasFiltradas: any[] = [];
actividadesFiltradas: any[] = [];
public Tipos: tipo_actividad[] = [];
cedula: string = '';
personaEncontrada : Persona = new Persona();
personaExtendida : PersonaExtendida = new Persona();
gradoOcupacional : Grado_ocupacional = new Grado_ocupacional();
tipo_contrato: Tipo_contrato = new Tipo_contrato();
titulo: Titulo_profesional = new Titulo_profesional();
  constructor(
    private asignaturaService: AsignaturaService, 
    private personaService: PersonaService,
    private cicloService: CicloService,
    private carreraService: CarreraService, 
    private jornadaService: JornadaService, 
    private distributivoAsignaturaService: DistributivoAsignaturaService, 
    private distributivoService: DistributivoService, 
    private distributivoActividadService: DistributivoActividadService, 
    private actividadService: ActividadService, 
    private tipo_contratoService: TipoContratoService, 
    private tituloService: TituloProfesionalService, 
    private gradoService: GradoOcupacionalService,
    private tipo_actividadService: tipo_actividadService,
    private authService: AuthService, 
    private router: Router,
    private activatedRoute: ActivatedRoute){

  }
  ngOnInit(): void{
    this.cargarAsignaturas();
    this.cargarCarreras();
    this.cargarCiclos();
  }

  buscarPersona(): void{
    this.personaService.getPersonaByCedula(this.cedula).subscribe(data =>{
      this.personaEncontrada = data;
    });
    this.loadPersonaData(this.personaEncontrada.id_persona);
    this.buscarDistributivo(this.personaEncontrada.id_persona);

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

  
  cargarDistributivos(): void{
    this.distributivoService.getDistributivo().subscribe(data =>{
      this.distributivos = data;
    });
  }

  cargarAsignaturasDistributivo(): void{
    this.distributivoAsignaturaService.getDistributivoAsignatura().subscribe(data =>{
      this.distributivoAsignaturas = data;
    });
  }

  cargarActividadDistributivo(): void{
    this.distributivoActividadService.getDistributivoActividad().subscribe(data =>{
      this.distributivoActividades = data;
    });
  }

  cargarAsignaturas(): void{
    this.asignaturaService.getAsignatura().subscribe(data =>{
      this.asignaturas = data;
    });
  }

  cargarActividades(): void{
    this.actividadService.getActividad().subscribe(data =>{
      this.actividades = data;
    });
  }

  cargarCiclos(): void{
    this.cicloService.getCiclo().subscribe(data => {
      this.ciclos = data;
    });
  }

  cargarTipoActividad(): void {
    this.tipo_actividadService.gettipoActividad().subscribe((Tipos) => {
      this.Tipos = Tipos;
    });
  }

  cargarCarreras(): void {
    this.carreraService.getCarrera().subscribe(data => {
      this.carreras = data;
    });
  }

  buscarDistributivo(idPersona:number): void{
    this.cargarDistributivos();
    this.distributivoFiltrado = this.distributivos.filter(
      (distributivo) => 
        (distributivo.id_persona === idPersona) 
    );
    console.log('distributivo encontrado',this.distributivoFiltrado)
    this.buscarAsignatura(this.distributivoFiltrado[0].id_distributivo);
    this.buscarActividad(this.distributivoFiltrado[0].id_distributivo);
  }

  buscarAsignatura(idDistributivo: number): void{
    this.cargarAsignaturasDistributivo();
    this.distributivoAsignaturasFiltrado = this.distributivoAsignaturas.filter(
      (distributivoAsignatura) => 
        (distributivoAsignatura.id_distributivo === idDistributivo)
    );
    console.log('distributivo asignatura',this.distributivoAsignaturasFiltrado)

    const idAsignaturas = this.distributivoAsignaturasFiltrado.map(distributivoAsignaturaEncontrados => distributivoAsignaturaEncontrados.id_asignatura);
    console.log('id_asignaturas', idAsignaturas);
    this.cargarDetalleAsignaturas(idAsignaturas);
  }

  cargarDetalleAsignaturas(idAsignaturas : number[]): void{
    this.asignaturasFiltradas = this.asignaturas.filter(asignatura =>{
      idAsignaturas.includes(asignatura.id_asignatura);
    });
    console.log('asignaturas cargadas',this.asignaturasFiltradas);
  }

  buscarActividad(idDistributivo: number): void{
    this.cargarActividadDistributivo();
    this.distributivoActividadesFiltrado = this.distributivoActividades.filter(
      (distributivoActividad) => 
        (distributivoActividad.id_distributivo === this.distributivoFiltrado[0].id_distributivo)
    );
    console.log('distributivo actividad',this.distributivoActividadesFiltrado)

    const idActividades = this.distributivoActividadesFiltrado.map(distributivoActividadEncontrados => distributivoActividadEncontrados.id_actividad);
    console.log('id_actividad', idActividades);
    this.cargarDetalleActividades(idActividades);
  }

  cargarDetalleActividades(idActividades : number[]): void{
    this.actividadesFiltradas = this.actividades.filter(actividad =>{
      idActividades.includes(actividad.id_actividad);
    });
    console.log('detalle cargadas',this.actividadesFiltradas);
  }

  obtenerNombreCiclo(id_ciclo:number):void{
    const ciclo = this.ciclos.find(ciclo => ciclo.id_ciclo === id_ciclo);
    return ciclo ? ciclo.nombre_ciclo : '';
  }

  obtenerNombreCarrera(id_carrera: number): string {
    const carrera = this.carreras.find(carrera => carrera.id_carrera === id_carrera);
    return carrera ? carrera.nombre_carrera : '';
  }

  obtenerTipoActividad(id_tipo_actividad: number): string {
    const tipoActividad = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo_actividad);
    return tipoActividad ? tipoActividad.nom_tip_actividad : '';
  }

  onChangeBuscar(event: any): void{
    this.cedula = event.target.value;
    console.log('cedula ingresada',this.cedula)
  }


}
