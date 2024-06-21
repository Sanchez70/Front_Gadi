import { Component, OnInit, ViewChild } from '@angular/core';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { PersonaService } from '../persona/persona.service';
import { CicloService } from '../../Services/cicloService/ciclo.service';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { JornadaService } from '../../Services/jornadaService/jornada.service';
import { DistributivoAsignaturaService } from '../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { DistributivoService } from '../../Services/distributivoService/distributivo.service';
import { DistributivoActividadService } from '../../Services/distributivoActividadService/distributivo_actividad.service';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { GradoOcupacionalService } from '../../Services/grado/grado-ocupacional.service';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { PeriodoService } from '../../Services/periodoService/periodo.service';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { Actividad } from '../../Services/actividadService/actividad';
import { Persona } from '../../Services/docenteService/persona';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { Periodo } from '../../Services/periodoService/periodo';
import { Jornada } from '../../Services/jornadaService/jornada';
import { Distributivo } from '../../Services/distributivoService/distributivo';
import { DistributivoAsignatura } from '../../Services/distributivoAsignaturaService/distributivo-asignatura';
import { DistributivoActividad } from '../../Services/distributivoActividadService/distributivo_actividad';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { Carrera } from '../../Services/carreraService/carrera';

@Component({
  selector: 'app-matriz-distributivo',
  templateUrl: './matriz-distributivo.component.html',
  styleUrl: './matriz-distributivo.component.css'
})


export class MatrizDistributivoComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'direccion', 'correo', 'edad', 'fecha_vinculacion', 'contrato', 'titulo', 'grado'];
  displayedColumnsAsig: string[] = ['carrera', 'asignatura', 'paralelo', 'nro_horas', 'jornada', 'periodo'];
  displayedColumnsAct: string[] = ['nro_horas', 'total_horas', 'descripcion','tipo_actividad'];
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
  distributivoAsignatura: { [key: number]: DistributivoAsignatura } = {};
  carreras: { [key: number]: Carrera } = {};
  tipo_actividad: { [key: number]: tipo_actividad } = {};

  color = '#1E90FF';
  currentExplan: string = '';
  personaEncontrada: Persona = new Persona();
  personas: Persona[] = [];
  distributivos: Distributivo[] = [];
  actividades: Actividad[] = [];
  distributivoFiltrado: any[] = [];
  distributivoAsignaturas: DistributivoAsignatura[] = [];
  distributivoActividades: DistributivoActividad[] = [];
  distributivoActividadesFiltrado: DistributivoActividad[] = [];
  actividadesFiltradas: any[] = [];
  asignaturas: Asignatura[] = [];
  tipos: tipo_actividad[] = [];

  horasTotales: number = 0;
  horasTotalesActividad: number = 0;
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

  ngOnInit(): void{
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarTipoActividad();
    this.cargarCarreras();
    this.personaService.getPersonas().subscribe(data => {
      const personaEncontrados = data as Persona[];
      const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === this.authService.id_persona);
      if (usuarioEncontrado) {
        this.personaEncontrada = usuarioEncontrado;
        this.personas.push(this.personaEncontrada);
        this.loadAdditionalDataForPersonas();
      }
    });
    this.buscarDistributivo(this.authService.id_persona);
  }

  cargarTipoActividad(): void {
    this.tipo_actividadService.gettipoActividad().subscribe((tipos) => {
      this.tipos = tipos;
    });
  }

  cargarCarreras(): void {
    this.carreraService.getCarrera().subscribe(data => {
      this.carreras = data;
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

  cargarAdicional(): void {
    const requests = this.asignaturas.map(asignatura =>

      forkJoin([
        this.periodoService.getPeriodobyId(asignatura.id_asignatura ?? 0).pipe(
          tap(periodo => {
            this.periodosDis[asignatura.id_asignatura] = periodo ?? { id_periodo: 0, nombre_periodo: 'No asignado', inicio_periodo: null, fin_periodo: null };
            console.log('periodoPersona' + periodo.nombre_periodo);
          }),
          catchError(() => {
            this.periodosDis[asignatura.id_asignatura] = { id_periodo: 0, nombre_periodo: 'No asignado', inicio_periodo: null, fin_periodo: null } as unknown as Periodo;
            return of(null);
          })
        ),
        this.jornadaService.getJornadabyId(asignatura.id_asignatura ?? 0).pipe(
          tap(jornada => {
            this.jornada[asignatura.id_asignatura] = jornada ?? { id_jornada: 0, descrip_jornada: 'No asignada' };
          }),
          catchError(() => {
            this.jornada[asignatura.id_asignatura] = { id_jornada: 0, descrip_jornada: 'No asignada' } as Jornada;
            return of(null);
          })
        ),
        this.distributivoAsignaturaService.getDistributivobyId(asignatura.id_asignatura ?? 0).pipe(
          tap(distributivosAsig => {
            this.distributivoAsignatura[asignatura.id_asignatura] = distributivosAsig ?? { id_distributivo_asig: 0, paralelo: 'No asignada' };
          }),
          catchError(() => {
            this.distributivoAsignatura[asignatura.id_asignatura] = { id_distributivo_asig: 0, paralelo: 'No asignada' } as DistributivoAsignatura;
            return of(null);
          })
        ),
        this.carreraService.getCarreraById(asignatura.id_asignatura ?? 0).pipe(
          tap(carrera => {
            this.carreras[asignatura.id_asignatura] = carrera ?? { id_carrera: 0, nombre_carrera: 'No asignada' };
          }),
          catchError(() => {
            this.carreras[asignatura.id_asignatura] = { id_carrera: 0, paralelo: 'No nombre_carrera' } as unknown as Carrera;
            return of(null);
          })
        ),
      ])

    );
    forkJoin(requests).subscribe(() => {
      this.dataSourceAsig = new MatTableDataSource(this.asignaturas);
      this.dataSourceAsig.paginator = this.paginator;
      this.dataSourceAsig.sort = this.sort;
    });
  }

  cargarTipo(): void {
    const requests = this.actividades.map(actividad =>
      forkJoin([
        this.tipo_actividadService.gettipoActividadbyId(actividad.id_actividad ?? 0).pipe(
          tap(tipo_actividades => {
            this.tipo_actividad[actividad.id_actividad] = tipo_actividades ?? { id_tipo_actividad: 0, nom_tip_actividad: 'No asignado'};
          }),
          catchError(() => {
            this.tipo_actividad[actividad.id_actividad] = { id_tipo_actividad: 0, nom_tip_actividad:  'No asignado' } as unknown as tipo_actividad;
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
       if (this.authService.asignaturasSeleccionadaAuth.length === 0) {
        this.asignaturas = this.asignaturas.concat(asignaturasCargadas);
      }else{
        this.asignaturas=this.authService.asignaturasSeleccionadaAuth
      }
        this.calcularHorasTotales();
   
        this.cargarAdicional();
        console.log('Asignaturas cargadas:', this.asignaturas);
      });
    });
  }

  buscarActividad(idDistributivo: number): void {
    this.distributivoActividadService.getDistributivoActividad().subscribe(data => {
      this.distributivoActividades = data;
      const actividadesFiltradas = this.distributivoActividades.filter(
        activDis => activDis.id_distributivo === idDistributivo
      );
      const idActividades = actividadesFiltradas.map(acti => acti.id_actividad);
      this.actividadService.getActividad().subscribe(acti => {
        const activEncontrados = acti as Actividad[];
        const actividadesCargadas = activEncontrados.filter(actividad =>
          idActividades.includes(actividad.id_actividad)
        );
        if (this.authService.id_actividades.length === 0) {
          this.actividades = this.actividades.concat(actividadesCargadas);
        }else{
          this.actividades=this.authService.id_actividades;
        }
        //this.actividades = this.actividades.concat(actividadesCargadas);
        this.cargarTipo();
        this.calcularHorasTotalesActividad();
        console.log('actividades cargadas:', this.actividades);
      });
    });

  }

  calcularHorasTotales():void{
    this.horasTotales = this.asignaturas.reduce(
      (sum,asignatura) => sum + asignatura.horas_semanales, 0
    );
    console.log('horas totales asignatura', this.horasTotales);
  }

  calcularHorasTotalesActividad():void{
    this.horasTotalesActividad = this.actividades.reduce(
      (sum,actividad) => sum + actividad.horas_no_docentes, 0
    );
    console.log('horas totales actividad', this.horasTotalesActividad);
  }

   enviarAsignaturas():void{
    this.authService.asignaturasSeleccionadaAuth = this.asignaturas;
  }

  enviarActividades():void{
    this.authService.id_actividades = this.actividades;
    console.log('actividades enviadas:',this.authService.id_actividades);
  }



}
