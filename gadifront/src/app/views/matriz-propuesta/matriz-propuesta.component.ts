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
import { PersonaService } from '../../Services/personaService/persona.service';
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
import { catchError, forkJoin, map, of, switchMap, tap, throwIfEmpty } from 'rxjs';
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
import { Carrera } from '../../Services/carreraService/carrera';
interface PersonaExtendida extends Persona {
  nombre_contrato?: string;
  nombre_titulo?: string;
  nombre_grado_ocp?: string;
}

interface AsignaturaConDistributivo {
  distributivoAsignatura: DistributivoAsignatura;
  asignaturas: Asignatura;
  carreras?: Carrera;
  distributivo: Distributivo;
  jornada?: Jornada;
  periodo?: Periodo;
}
@Component({
  selector: 'app-matriz-propuesta',
  templateUrl: './matriz-propuesta.component.html',
  styleUrl: './matriz-propuesta.component.css'
})
export class MatrizPropuestaComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'direccion', 'correo', 'edad', 'fecha_vinculacion', 'contrato', 'titulo', 'grado'];
  displayedColumnsAsig: string[] = ['carrera', 'asignatura', 'paralelo', 'nro_horas', 'jornada', 'periodo'];
  displayedColumnsAct: string[] = ['nro_horas', 'descripcion', 'tipo_actividad'];
  dataSourceAsig!: MatTableDataSource<any>;
  dataSourceAct!: MatTableDataSource<Actividad>;
  dataSource!: MatTableDataSource<Persona>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};
  periodosDis: { [key: number]: Periodo } = {};
  jornada: { [key: number]: Jornada } = {};
  distributivoAsignatura: { [key: number]: DistributivoAsignatura } = {};
  carreras: { [key: number]: Carrera } = {};
  tipo_actividad: { [key: number]: tipo_actividad } = {};
  personas: Persona[] = [];
  asignaturas: Asignatura[] = [];
  actividades: Actividad[] = [];
  jornadas: any[] = [];
  periodos: any[] = [];
  ciclos: any[] = [];

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
  id_distributivo: number = 0;
  tituloCargado: any[] = [];
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
    this.dataSourceAsig = new MatTableDataSource<any>();
  }
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarComboTitulos();
    this.personaService.getPersonas().subscribe(data => {
      const personaEncontrados = data as Persona[];
      const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === this.authService.id_persona);
      if (usuarioEncontrado) {
        this.personaEncontrada = usuarioEncontrado;
        this.personas.push(this.personaEncontrada);
        this.loadAdditionalDataForPersonas();
        this.buscarDistributivo(this.authService.id_persona);
      }
    });

  }

  buscarDistributivo(idPersona: number): void {
    idPersona = this.authService.id_persona;
    this.distributivoService.getDistributivo().subscribe(data => {
      this.distributivos = data;
      this.distributivoFiltrado = this.distributivos.filter(
        distributivo => distributivo.id_persona === idPersona && distributivo.estado === 'Pendiente' && distributivo.id_periodo === this.authService.id_periodo);
      this.distributivoFiltrado.forEach(distributivo => {
        this.id_distributivo = distributivo.id_distributivo;
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
        this.combinarDatos(this.distributivoFiltrado);

      });
    });
  }

  combinarDatos(distributivos: Distributivo[]): void {
    forkJoin({
      asignaturas: this.asignaturaService.getAsignatura(),
      carreras: this.carreraService.getCarrera(),
      distributivoAsignatura: this.distributivoAsignaturaService.getDistributivoAsignatura(),
      jornadas: this.jornadaService.getJornada(),
      periodo: this.periodoService.getPeriodo()
    }).pipe(
      map(({ asignaturas, carreras, distributivoAsignatura, jornadas, periodo }) => {
        const data: any[] = [];
        const asignaturaFiltradas: Asignatura[] = [];
        distributivos.forEach(dis => {
          const distributivosFiltrados = distributivoAsignatura.filter(da => da.id_distributivo === dis.id_distributivo);
          distributivosFiltrados.forEach(da => {
            const asignatura = asignaturas.find(a => a.id_asignatura === da.id_asignatura);
            if (asignatura) {
              asignaturaFiltradas.push(asignatura); // Guardar la actividad filtrada en el array

              const carrera = carreras.find(ca => ca.id_carrera === asignatura?.id_carrera);
              const jornada = jornadas.find(jo => jo.id_jornada === da?.id_jornada);
              const periodos = periodo.find(pe => pe.id_periodo === dis?.id_periodo);

              data.push({
                nombreAsignatura: asignatura ? asignatura.nombre_asignatura : '',
                carrera: carrera ? carrera.nombre_carrera : '',
                horaAsignatura: asignatura ? asignatura.horas_semanales : '',
                jornada: jornada ? jornada.descrip_jornada : '',
                paralelo: da.paralelo,
                periodo: periodos ? periodos.nombre_periodo : '',
              });


            }
          });
        });


        this.asignaturas = asignaturaFiltradas;
        return data;
      })
    ).subscribe(data => {
      this.dataSourceAsig.data = data;
    });
  }



  buscarActividad(idDistributivo: number): void {
    this.distributivoActividadService.getDistributivoActividad().subscribe(data => {
      this.distributivoActividades = data;

      const actividadesFiltradas = this.distributivoActividades.filter(
        distributivoActividad =>
          distributivoActividad.id_distributivo === idDistributivo);

      const idActividades = actividadesFiltradas.map(distributivoActividadEncontrados => distributivoActividadEncontrados.id_actividad);

      this.actividadService.getActividad().subscribe(activ => {
        const activEncontrados = activ as Actividad[];
        const actividadCargadas = activEncontrados.filter(actividad =>
          idActividades.includes(actividad.id_actividad)
        );
        this.actividades = this.actividades.concat(actividadCargadas);
        this.cargarTipo();
      });
    });

  }

  cargarTipo(): void {
    const requests = this.actividades.map(actividad =>
      forkJoin([
        this.tipo_actividadService.gettipoActividadbyId(actividad.id_actividad ?? 0).pipe(
          tap(tipo_actividades => {
            this.tipo_actividad[actividad.id_actividad] = tipo_actividades ?? { id_tipo_actividad: 0, nom_tip_actividad: 'No asignado' };
          }),
          catchError(() => {
            this.tipo_actividad[actividad.id_actividad] = { id_tipo_actividad: 0, nom_tip_actividad: 'No asignado' } as unknown as tipo_actividad;
            return of(null);
          })
        ),
      ])

    );
    forkJoin(requests).subscribe(() => {
      this.dataSourceAct = new MatTableDataSource(this.actividades);
      this.dataSourceAct.paginator = this.paginator;
      this.dataSourceAct.sort = this.sort;
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

  cargarComboTitulos(): void {
    this.tituloService.getTitulo().subscribe(data => {
      const titulosEncontrados = data as unknown as TituloProfecional[];
      const titulosFitrados = titulosEncontrados.filter(respuest => respuest.id_persona === this.authService.id_persona);
      if (titulosFitrados) {
        this.tituloCargado = titulosFitrados;
      }

    });
  }
}
