import { Component, OnInit, ViewChild } from '@angular/core';
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
import { PeriodoService } from '../../Services/periodoService/periodo.service';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, forkJoin, of, switchMap, tap, throwIfEmpty } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { Actividad } from '../../Services/actividadService/actividad';
import { DistributivoAsignatura } from '../../Services/distributivoAsignaturaService/distributivo-asignatura';
import { Periodo } from '../../Services/periodoService/periodo';
import { Jornada } from '../../Services/jornadaService/jornada';
import { Distributivo } from '../../Services/distributivoService/distributivo';
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
export class MatrizPropuestaComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'direccion', 'correo', 'edad', 'fecha_vinculacion', 'contrato', 'titulo', 'grado'];
  displayedColumnsAsig: string[] = ['asignatura', 'nro_horas', 'periodo'];
  displayedColumnsAct: string[] = ['nro_horas', 'total_horas', 'descripcion'];
  dataSourceAsig!: MatTableDataSource<Asignatura>;
  dataSourceAct!: MatTableDataSource<Actividad>;
  dataSource!: MatTableDataSource<Persona>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};
  periodosDis: { [key: number]: Periodo } = {};
  jornada: { [key: number]: Jornada } = {};

  personas: Persona[] = [];
  asignaturas: Asignatura[] = [];
  actividades: Actividad[] = [];
  jornadas: any[] = [];
  periodos: any[] = [];
  ciclos: any[] = [];
  carreras: any[] = [];
  distributivos: Distributivo[] = [];
  distributivoFiltrado: any[] = [];
  distributivoAsignaturas: any[] = [];
  distributivoAsignaturasFiltrado: any[] = [];
  distributivoActividades: any[] = [];
  distributivoActividadesFiltrado: any[] = [];
  asignaturasFiltradas: any[] = [];
  actividadesFiltradas: any[] = [];
  public Tipos: tipo_actividad[] = [];
  cedula: string = '';
  periodo: number = 0;
  color = '#1E90FF';
  periodoNombre: string = '';
  personaEncontrada: Persona = new Persona();
  personaExtendida: PersonaExtendida = new Persona();
  gradoOcupacional: Grado_ocupacional = new Grado_ocupacional();
  tipo_contrato: Tipo_contrato = new Tipo_contrato();
  titulo: Titulo_profesional = new Titulo_profesional();
  currentExplan: string = '';
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
    private periodoService: PeriodoService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarCarreras();
    this.cargarCiclos();
    this.buscarDistributivo(this.authService.id_persona);

    this.cargarActividades();
    this.cargarJornadas();

    this.personaService.getPersonas().subscribe(data => {
      const personaEncontrados = data as Persona[];
      const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === this.authService.id_persona);
      if (usuarioEncontrado) {
        this.personaEncontrada = usuarioEncontrado;
        this.personas.push(this.personaEncontrada);

      }
    });

  }






  cargarAsignaturas(): void {
    this.asignaturaService.getAsignatura().subscribe(data => {
      this.asignaturas = data;

    });
  }

  cargarActividades(): void {
    this.actividadService.getActividad().subscribe(data => {
      this.actividades = data;
    });
  }

  cargarCiclos(): void {
    this.cicloService.getCiclo().subscribe(data => {
      this.ciclos = data;
    });
  }

  cargarJornadas(): void {
    this.jornadaService.getJornada().subscribe(data => {
      this.jornadas = data;
    });
  }

  cargarTipoActividad(): void {
    this.tipo_actividadService.gettipoActividad().subscribe((Tipos) => {
      this.Tipos = Tipos;

    });
  }

  cargarPeriodos(): void {
    this.periodoService.getPeriodo().subscribe(data => {
      this.periodos = data;
    });
  }

  cargarCarreras(): void {
    this.carreraService.getCarrera().subscribe(data => {
      this.carreras = data;
    });
  }

  buscarDistributivo(idPersona: number): void {
    idPersona = this.authService.id_persona;
    this.distributivoService.getDistributivo().subscribe(data => {
      this.distributivos = data;
      this.distributivoFiltrado = this.distributivos.filter(
        distributivo => distributivo.id_persona === idPersona);
      console.log('distributivo encontrado', this.distributivoFiltrado);
      this.distributivoFiltrado.forEach(distributivo => {
        this.buscarAsignatura(distributivo.id_distributivo);
        this.buscarActividad(distributivo.id_distributivo);
      });
    });

    ;
  }

  buscarAsignatura(idDistributivo: number): void {
    this.distributivoAsignaturaService.getDistributivoAsignatura().subscribe(data => {
      this.distributivoAsignaturas = data;
      const asignaturasFiltradas = this.distributivoAsignaturas.filter(
        materiaAs => materiaAs.id_distributivo === idDistributivo
      );
      const idAsignaturas = asignaturasFiltradas.map(asig => asig.id_asignatura);
      this.asignaturaService.getAsignatura().subscribe(asig => {
        const asigEncontrados = asig as Asignatura[];
        const asignaturasCargadas = asigEncontrados.filter(materia =>
          idAsignaturas.includes(materia.id_asignatura)
        );
        this.asignaturas = this.asignaturas.concat(asignaturasCargadas);
        
        this.loadAdditionalDataForPersonas();
      
        console.log('Asignaturas cargadas:', this.asignaturas);
      });
    });
  }


  buscarActividad(idDistributivo: number): void {
    this.distributivoActividadService.getDistributivoActividad().subscribe(data => {
      this.distributivoActividades = data;

      this.distributivoActividadesFiltrado = this.distributivoActividades.filter(
        distributivoActividad =>
          distributivoActividad.id_distributivo === idDistributivo);
      console.log('distributivo actividad', this.distributivoActividadesFiltrado)

      const idActividades = this.distributivoActividadesFiltrado.map(distributivoActividadEncontrados => distributivoActividadEncontrados.id_actividad);
      console.log('id_actividad', idActividades);

      this.actividadesFiltradas = this.actividades.filter(actividad =>
        idActividades.includes(actividad.id_actividad));
      console.log('detalle cargadas', this.actividadesFiltradas);
    });

  }



  obtenerNombreCiclo(id_ciclo: number): void {
    const ciclo = this.ciclos.find(ciclo => ciclo.id_ciclo === id_ciclo);
    return ciclo ? ciclo.nombre_ciclo : '';
  }

  obtenerNombreCarrera(id_carrera: number): string {
    const carrera = this.carreras.find(carrera => carrera.id_carrera === id_carrera);
    return carrera ? carrera.nombre_carrera : '';
  }

  obtenerNombreJornada(id_jornada: number): string {
    const jornada = this.jornadas.find(jornada => jornada.id_jornada === id_jornada);
    return jornada ? jornada.descrip_jornada : '';
  }

  obtenerNombrePeriodo(idPeriodo: number) {
    const periodo = this.periodos.find(periodo => periodo.id_periodo === idPeriodo);
    this.periodoNombre = periodo ? periodo.nombre_periodo : '';
    console.log('nombre periodo', this.periodoNombre);
  }

  obtenerTipoActividad(id_tipo_actividad: number): string {
    const tipoActividad = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo_actividad);
    return tipoActividad ? tipoActividad.nom_tip_actividad : '';
  }

  onChangeBuscar(event: any): void {
    this.cedula = event.target.value;
    console.log('cedula ingresada', this.cedula)
  }

  cargarAdicional(): void {
    const requests = this.personas.map(persona =>
      this.personaService.getPeriodoById(persona.id_persona).pipe(
        switchMap(() =>
          forkJoin([
            this.periodoService.getPeriodobyId(persona.id_persona ?? 0).pipe(
              tap(periodo => {
                this.periodosDis[persona.id_persona] = periodo ?? { id_periodo: 0, nombre_periodo: 'No asignado', inicio_periodo: null, fin_periodo: null };
                console.log('periodoPersona' + periodo.nombre_periodo);
              }),
              catchError(() => {
                this.periodosDis[persona.id_persona] = { id_periodo: 0, nombre_periodo: 'No asignado', inicio_periodo: null, fin_periodo: null } as unknown as Periodo;
                return of(null);
              })
            )
          ]))
      )
    );
    forkJoin(requests).subscribe(() => {
      this.dataSourceAsig = new MatTableDataSource(this.asignaturas);
      this.dataSourceAsig.paginator = this.paginator;
      this.dataSourceAsig.sort = this.sort;
    });
  }

  loadAdditionalDataForPersonas(): void {
    const requests = this.personas.map(persona =>
      forkJoin([
        this.personaService.getGradoById(persona.id_grado_ocp ?? 0).pipe(
          tap(grado => {
            this.grados[persona.id_persona] = grado ?? { id_grado_ocp: 0, nombre_grado_ocp: 'No asignado' };
          }),
          catchError(() => {
            this.grados[persona.id_persona] = { id_grado_ocp: 0, nombre_grado_ocp: 'No asignado' } as GradoOcupacional;
            return of(null);
          })
        ),
        this.personaService.getTituloById(persona.id_titulo_profesional ?? 0).pipe(
          tap(titulo => {
            this.titulos[persona.id_persona] = titulo ?? { id_titulo_profesional: 0, nombre_titulo: 'No asignado' };
          }),
          catchError(() => {
            this.titulos[persona.id_persona] = { id_titulo_profesional: 0, nombre_titulo: 'No asignado' } as unknown as TituloProfecional;
            return of(null);
          })
        ),
        this.personaService.getContratoById(persona.id_tipo_contrato ?? 0).pipe(
          tap(contrato => {
            this.contratos[persona.id_persona] = contrato ?? { id_tipo_contrato: 0, nombre_contrato: 'No asignado' };
          }),
          catchError(() => {
            this.contratos[persona.id_persona] = { id_tipo_contrato: 0, nombre_contrato: 'No asignado' } as unknown as TipoContrato;
            return of(null);
          })
        )
      ])

    );

    forkJoin(requests).subscribe(() => {

      this.dataSource = new MatTableDataSource(this.personas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }



}
