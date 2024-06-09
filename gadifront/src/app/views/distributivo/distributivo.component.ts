import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
interface PersonaExtendida extends Persona {
  nombre_contrato?: string;
  nombre_titulo?: string;
  nombre_grado_ocp?: string;
}

@Component({
  selector: 'app-distributivo',
  templateUrl: './distributivo.component.html',
  styleUrls: ['./distributivo.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButton,
    RouterModule
  ]
})
export class DistributivoComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'nombre_contrato', 'nombre_titulo', 'nombre_grado_ocp', 'fecha_vinculacion'];
  displayedColumns2: string[] = ['nombre_asignatura', 'horas_semanales', 'id_carrera', 'id_ciclo'];
  displayedColumns3: string[] = ['id_actividad', 'nombre_actividad', 'descripcion_actividad', 'horas_no_docentes', 'id_tipo_actividad'];
  dataSource!: MatTableDataSource<PersonaExtendida>;
  dataSource2!: MatTableDataSource<Asignatura>;
  dataSource3!: MatTableDataSource<Actividad>;

  public persona: PersonaExtendida = new Persona();
  public contrato: Tipo_contrato = new Tipo_contrato();
  public titulo: Titulo_profesional = new Titulo_profesional();
  public asignatura: Asignatura = new Asignatura();
  public grado: Grado_ocupacional = new Grado_ocupacional();
  public actividad: Actividad = new Actividad();
  public Actividades: Actividad[] = [];
  public Tipos: tipo_actividad[] = [];
  public ciclos: any[] = [];
  public carreras: any[] = [];
  public asignaturas: any[] = [];
  horasTotales: number = 0;
  personas: PersonaExtendida[] = [];
  currentExplan: string = '';
  id_contrato: any;
  color = '#1E90FF';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tipo_actividadService: tipo_actividadService,
    private actividadService: ActividadService,
    private docenteService: DocenteService,
    private authService: AuthService,
    private tipo_contrato: TipoContratoService,
    private titulo_profesional: TituloProfesionalService,
    private grado_ocupacional: GradoOcupacionalService,
    private asignaturaSeleccionada: AsignaturaService,
    private cicloService: CicloService,
    private carreraService: CarreraService
  ) {}

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    if (this.authService.id_persona) {
      this.loadPersonaData(this.authService.id_persona);
    }
    this.cargarActividades();
    this.cargarTipoActividad();
    this.cargarCarreras();
    this.cargarCiclos();
    this.buscarAsignaturas();
  }

  loadPersonaData(personaId: number): void {
    this.docenteService.getpersonabyId(personaId).subscribe(data => {
      this.persona = { ...data };
      this.tipo_contrato.getcontratobyId(data.id_tipo_contrato).subscribe(contratos => {
        this.contrato = contratos;
        this.persona.nombre_contrato = this.contrato.nombre_contrato;
        this.updateDataSource();
      });
      this.titulo_profesional.getTitulobyId(data.id_titulo_profesional).subscribe(titulos => {
        this.titulo = titulos;
        this.persona.nombre_titulo = this.titulo.nombre_titulo;
        this.updateDataSource();
      });
      this.grado_ocupacional.getGradobyId(data.id_grado_ocp).subscribe(grados => {
        this.grado = grados;
        this.persona.nombre_grado_ocp = this.grado.nombre_grado_ocp;
        this.updateDataSource();
      });
    });
  }

  updateDataSource(): void {
    this.dataSource = new MatTableDataSource([this.persona]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarActividades(): void {
    this.actividadService.getActividad().subscribe((Actividades) => {
      this.Actividades = Actividades;
      this.dataSource3 = new MatTableDataSource(this.Actividades);
      this.dataSource3.paginator = this.paginator;
      this.dataSource3.sort = this.sort;
    });
  }

  cargarTipoActividad(): void {
    this.tipo_actividadService.gettipoActividad().subscribe((Tipos) => {
      this.Tipos = Tipos;
    });
  }

  cargarCiclos(): void {
    this.cicloService.getCiclo().subscribe(data => {
      this.ciclos = data;
    });
  }

  cargarCarreras(): void {
    this.carreraService.getCarrera().subscribe(data => {
      this.carreras = data;
    });
  }

  obtenerTipoActividad(id_tipo_actividad: number): string {
    const tipoActividad = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo_actividad);
    return tipoActividad ? tipoActividad.nom_tip_actividad : '';
  }

  buscarAsignaturas(): void {
    if (this.authService.id_asignaturas) {
      this.authService.id_asignaturas.forEach(asignatura => {
        const idAsignaturas: any = asignatura.id_asignatura;
        this.asignaturaSeleccionada.getAsignaturabyId(idAsignaturas).subscribe(response => {
          this.asignatura = response;
          this.asignaturas.push(this.asignatura);
          this.dataSource2 = new MatTableDataSource(this.asignaturas);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
          this.calcularHorasTotales();
        }, error => {
          console.log('Error al crear', error);
        });
      });
    }
  }

  obtenerNombreCiclo(id_ciclo: number): string {
    const ciclo = this.ciclos.find(ciclo => ciclo.id_ciclo === id_ciclo);
    return ciclo ? ciclo.nombre_ciclo : '';
  }

  obtenerNombreCarrera(id_carrera: number): string {
    const carrera = this.carreras.find(carrera => carrera.id_carrera === id_carrera);
    return carrera ? carrera.nombre_carrera : '';
  }

  calcularHorasTotales(): void {
    this.horasTotales = this.asignaturas.reduce((sum, asignatura) => sum + asignatura.horas_semanales, 0);
  }
}