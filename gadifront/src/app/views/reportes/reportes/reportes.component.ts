import { Component, OnInit, ViewChild } from '@angular/core';
import { AsignaturaService } from '../../../Services/asignaturaService/asignatura.service';
import { PersonaService } from '../../../Services/personaService/persona.service';
import { CicloService } from '../../../Services/cicloService/ciclo.service';
import { CarreraService } from '../../../Services/carreraService/carrera.service';
import { JornadaService } from '../../../Services/jornadaService/jornada.service';
import { DistributivoAsignaturaService } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { DistributivoService } from '../../../Services/distributivoService/distributivo.service';
import { DistributivoActividadService } from '../../../Services/distributivoActividadService/distributivo_actividad.service';
import { ActividadService } from '../../../Services/actividadService/actividad.service';
import { TipoContratoService } from '../../../Services/tipo_contrato/tipo-contrato.service';
import { TituloProfesionalService } from '../../../Services/titulo/titulo-profesional.service';
import { GradoOcupacionalService } from '../../../Services/grado/grado-ocupacional.service';
import { tipo_actividadService } from '../../../Services/tipo_actividadService/tipo_actividad.service';
import { PeriodoService } from '../../../Services/periodoService/periodo.service';
import { AuthService } from '../../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from '../../../Services/docenteService/persona';
import { Distributivo } from '../../../Services/distributivoService/distributivo';
import { Actividad } from '../../../Services/actividadService/actividad';
import { DistributivoAsignatura } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura';
import { DistributivoActividad } from '../../../Services/distributivoActividadService/distributivo_actividad';
import { Asignatura } from '../../../Services/asignaturaService/asignatura';
import { Periodo } from '../../../Services/periodoService/periodo';
import { tipo_actividad } from '../../../Services/tipo_actividadService/tipo_actividad';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { GradoOcupacional } from '../../grado-ocupacional/grado-ocupacional';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TituloProfecional } from '../../titulo-profesional/titulo-profecional';
import { TipoContrato } from '../../tipo-contrato/tipo-contrato';
import { Jornada } from '../../../Services/jornadaService/jornada';
import { Carrera } from '../../../Services/carreraService/carrera';
import { Ciclo } from '../../../Services/cicloService/ciclo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface PersonaAsignatura {
  persona: Persona;
  asignaturas: Asignatura[];
}

export interface PersonaTitulo extends Persona{
  titulos: TituloProfecional[];
}
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements OnInit {
  dataSourceAsig!: MatTableDataSource<Asignatura>;
  dataSourceAct!: MatTableDataSource<Actividad>;
  dataSource!: MatTableDataSource<PersonaTitulo>;
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
  ciclos: { [key: number]: Ciclo } = {};
  
  fechaDistributivo: string = '';
  currentExplan: string = '';
  personaEncontrada: Persona = new Persona();
  personas: Persona[] = [];
  distributivos: Distributivo[] = [];
  actividades: Actividad[] = [];
  distributivoFiltrado: any[] = [];
  periodos: any[] = [];
  distributivoAsignaturas: DistributivoAsignatura[] = [];
  distributivoActividades: DistributivoActividad[] = [];
  distributivoActividadesFiltrado: DistributivoActividad[] = [];
  actividadesFiltradas: any[] = [];
  asignaturas: Asignatura[] = [];
  titulosCargados: any[] = [];
  titulosFiltrado: any[] = [];
  periodo: Periodo = new Periodo();
  tipos: tipo_actividad[] = [];
  idPeriodo: number = this.authService.id_periodo;
  periodoName: string = '';
  horasTotales: number = 0;
  horasTotalesActividad: number = 0;
  horasPorDocente: number = 0;
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
    private ngxLoader: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    const fechaActual = new Date();
    this.cargarPeriodo()
    this.fechaDistributivo = this.formatearFecha(fechaActual);
    this.personaService.getPersonas().subscribe(data => {
      const personaEncontrados = data as Persona[];
      const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === this.authService.id_persona);
      if (usuarioEncontrado) {
        this.personaEncontrada = usuarioEncontrado;
        this.personas.push(this.personaEncontrada);
        this.cargarTitulos(this.personaEncontrada);
        this.buscarDistributivo(this.authService.id_persona);
      }
    });
  }

  cargarPeriodo(): void {
    this.periodoService.getPeriodobyId(this.idPeriodo).subscribe(data => {
      this.periodo = data;
      this.periodoName = this.periodo.nombre_periodo;
    });
  }

  cargarTitulos(personaEncontrada: Persona):void {
    this.tituloService.getTitulo().subscribe(data =>{
      this.titulosCargados = data;
      this.titulosFiltrado = this.titulosCargados.filter(
        (titulo) => (titulo.id_persona === this.authService.id_persona)
      );
      const personaConTitulo: PersonaTitulo = {
        ...personaEncontrada,
        titulos: this.titulosFiltrado
      };
      this.dataSource = new MatTableDataSource([personaConTitulo]);
    });
  }

  buscarDistributivo(idPersona: number): void {
    //idPersona = this.authService.id_persona;
    this.distributivoService.getDistributivo().subscribe(data => {
      this.distributivos = data;
      this.distributivoFiltrado = this.distributivos.filter(
        (distributivo) => (distributivo.id_persona === idPersona && distributivo.id_periodo === this.idPeriodo && distributivo.estado === 'Aceptado'
        )
      );
     console.log('distributivos filtrados',this.distributivoFiltrado)
      
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
        this.asignaturas = this.asignaturas.concat(asignaturasCargadas);
        this.cargarAdicional();
        this.calcularHorasTotales();
        
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
        this.actividades = this.actividades.concat(actividadesCargadas);
        this.cargarTipo();
        this.calcularHorasTotalesActividad();
        
      });
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

  cargarAdicional(): void {
    const requests = this.asignaturas.map(asignatura =>
      forkJoin([
        this.periodoService.getPeriodobyId(asignatura.id_asignatura ?? 0).pipe(
          tap(periodo => {
              this.periodosDis[asignatura.id_asignatura] = periodo ?? { id_periodo: 0, nombre_periodo: 'No asignado', inicio_periodo: null, fin_periodo: null };
              
            
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
            this.distributivoAsignatura[asignatura.id_asignatura] = distributivosAsig ?? { id_distributivo_asig: 0, paralelo: 'No asignada', acronimo: 'No asignado' };
           
          }),
          catchError(() => {
            this.distributivoAsignatura[asignatura.id_asignatura] = { id_distributivo_asig: 0, paralelo: 'No asignada', acronimo: 'No asignado' } as DistributivoAsignatura;
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
        this.cicloService.getCiclobyId(asignatura.id_asignatura ?? 0).pipe(
          tap(ciclo => {
            this.ciclos[asignatura.id_asignatura] = ciclo ?? { id_ciclo: 0, nombre_ciclo: 'No asignada' };
          }),
          catchError(() => {
            this.ciclos[asignatura.id_asignatura] = { id_ciclo: 0, nombre_ciclo: 'No nombre_ciclo' } as unknown as Ciclo;
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

  formatearFecha(fecha: Date): string{
    const opciones = { month: 'long', day: 'numeric', year: 'numeric' } as const;
    return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
  }

  calcularHorasTotales():void{
    this.horasTotales = this.asignaturas.reduce(
      (sum,asignatura) => sum + asignatura.horas_semanales, 0
    );
  }

  calcularHorasTotalesActividad():void{
    this.horasTotalesActividad = this.actividades.reduce(
      (sum,actividad) => sum + actividad.horas_no_docentes, 0
    );
    
  }

  calcularHorasTotalesPorDocente(horasAsignatura:number, horasActividades:number):number{
    const horasPorDocente = horasAsignatura + horasActividades;
    return horasPorDocente ? horasPorDocente : 0;
  }

  downloadPDF() {
    this.ngxLoader.start();
    const DATA: any = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {
      this.ngxLoader.stop();
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      const fileName = `${new Date().toISOString()}_distributivo.pdf`;
      doc.save(fileName);
    });
  }
}
