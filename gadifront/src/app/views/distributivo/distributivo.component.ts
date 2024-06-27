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
import { Distributivo } from '../../Services/distributivoService/distributivo';
import { DistributivoService } from '../../Services/distributivoService/distributivo.service';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { Periodo } from '../../Services/periodoService/periodo';
import { PeriodoService } from '../../Services/periodoService/periodo.service';
import { Ciclo } from '../../Services/cicloService/ciclo';
import { CicloService } from '../../Services/cicloService/ciclo.service';
import { JornadaService } from '../../Services/jornadaService/jornada.service';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { DistributivoAsignatura } from '../../Services/distributivoAsignaturaService/distributivo-asignatura';
import { DistributivoAsignaturaService } from '../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { DistributivoActividad } from '../../Services/distributivoActividadService/distributivo_actividad';
import { DistributivoActividadService } from '../../Services/distributivoActividadService/distributivo_actividad.service';
interface PersonaExtendida extends Persona {
  nombre_contrato?: string;
  nombre_titulo?: string;
  nombre_grado_ocp?: string;
}
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
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
  displayedColumns2: string[] = ['nombre_asignatura', 'horas_semanales', 'id_carrera', 'id_ciclo', 'jornada'];
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
  public periodoEncontrado: Periodo = new Periodo();
  public Actividades: Actividad[] = [];
  public Tipos: tipo_actividad[] = [];
  public ciclos: any[] = [];
  public carreras: any[] = [];
  public asignaturas: any[] = [];
  public distributivo: Distributivo = new Distributivo();
  public distributivoacti: DistributivoActividad = new DistributivoActividad()
  public Distributivos: Distributivo[] = [];
  public asignaturaDistributivo: DistributivoAsignatura = new DistributivoAsignatura();
  periodos: any[] = [];
  periodoActual: string = '';
  paraleloSeleccionado: string = '';
  jornadas: any[] = [];
  jornadaSeleccionada: { [key: string]: number } = {};
  idPeriodo: number = 0;
  idJornada: number = 0;
  horasTotales: number = 0;
  personas: PersonaExtendida[] = [];
  currentExplan: string = '';
  id_contrato: any;
  color = '#1E90FF';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private distributivoService: DistributivoService,
    private tipo_actividadService: tipo_actividadService,
    private actividadService: ActividadService,
    private docenteService: DocenteService,
    private authService: AuthService,
    private tipo_contrato: TipoContratoService,
    private titulo_profesional: TituloProfesionalService,
    private grado_ocupacional: GradoOcupacionalService,
    private asignaturaSeleccionada: AsignaturaService,
    private cicloService: CicloService,
    private carreraService: CarreraService,
    private periodoService: PeriodoService,
    private jornadaService: JornadaService,
    private distributivoAsignaturaService: DistributivoAsignaturaService,
    private distributivoActividadService: DistributivoActividadService,
  ) { }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    if (this.authService.id_persona) {
      this.loadPersonaData(this.authService.id_persona);
    }

    this.cargarTipoActividad();
    this.cargarCarreras();
    this.cargarCiclos();
    this.cargarComboPeriodos();
    this.cargarComboJornada();
    this.buscarAsignaturas();
    this.buscarActividades();
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

  // cargarActividades(): void {
  //   this.actividadService.getActividad().subscribe((actividades) => {
  //     this.Actividades = actividades;
  //     this.dataSource3 = new MatTableDataSource(this.Actividades);
  //     this.dataSource3.paginator = this.paginator;
  //     this.dataSource3.sort = this.sort;
  //   });
  // }

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

  cargarComboPeriodos(): void {
    this.periodoService.getPeriodo().subscribe(data => {
      this.periodos = data;
      this.periodoEncontrado = this.periodos.find(
        (periodo) => (periodo.estado === 'Activo')
      );
      this.idPeriodo = this.periodoEncontrado.id_periodo
      console.log('periodo cargado', this.periodoEncontrado.id_periodo);
    });
  }

  // onPeriodoChange(event: any): void {
  //   this.periodoSeleccionado = +event.target.value;
  //   this.idPeriodo = this.periodoSeleccionado;
  // }

  cargarComboJornada(): void {
    this.jornadaService.getJornada().subscribe(data => {
      this.jornadas = data;
    });
  }

  onJornadaChange(event: any, idAsignatura: any, index: number): void {
    this.idJornada = +event.target.value;
    const key = `${idAsignatura}-${index}`;
    this.jornadaSeleccionada[key] = this.idJornada;
  }

  generateKey(id_asignatura: number, index: number): string {
    return `${id_asignatura}-${index}`;
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

  buscarActividades(): void {
    if (this.authService.id_actividades) {
      this.authService.id_actividades.forEach(actividad => {
        const idActividades: any = actividad.id_actividad;
        this.actividadService.getActividadbyId(idActividades).subscribe(response => {
          this.actividad = response;
          this.Actividades.push(this.actividad);
          this.dataSource3 = new MatTableDataSource(this.Actividades);
          this.dataSource3.paginator = this.paginator;
          this.dataSource3.sort = this.sort;
        })
      })
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


  public createdistributivo(): void {
    this.distributivo.id_persona = this.persona.id_persona;
    this.distributivo.id_periodo = this.idPeriodo;
    this.distributivo.estado = 'Pendiente';
    this.distributivoService.create(this.distributivo)
      .subscribe(
        (distributivo) => {
          console.log("valor", distributivo);
          this.createAsignaturaDistributivo(distributivo.id_distributivo); // Pasa el id_distributivo al segundo método
          this.createdistributivoacti(distributivo.id_distributivo);

          this.dataSource = new MatTableDataSource<PersonaExtendida>([]);
          this.dataSource2 = new MatTableDataSource<Asignatura>([]);
          this.dataSource3 = new MatTableDataSource<Actividad>([]);
          this.authService.clearLocalStorageAsignatura();
          this.authService.clearLocalStorageActividad();
          this.authService.clearLocalStoragePersona();
          this.authService.saveUserToLocalStorage();
          Toast.fire({
            icon: "success",
            title: "Distributivo Generado con éxito",
          });


        },
        (error) => {
          console.error('Error al guardar:', error);
          Toast.fire({
            icon: "error",
            title: "Hubo un error al guardar",
            footer: "Por favor, verifique si ha completado todo lo necesario"
          });
        }
      );
  }

  createAsignaturaDistributivo(id_distributivo: number): void {
    this.authService.id_asignaturas.forEach((asignatura, index) => {
      const key = `${asignatura.id_asignatura}-${index}`;
      const id_jornada = this.jornadaSeleccionada[key];

      this.jornadaService.getJornadabyId(id_jornada).subscribe(data => {
        const jornadaNombre = data.descrip_jornada.charAt(0);
        const acronimo = this.crearAcronimo(jornadaNombre, this.authService.paralelo, asignatura.id_ciclo);

        if (id_jornada) {
          const nuevoAsignaturaDistributivo: DistributivoAsignatura = {
            id_jornada: id_jornada,
            paralelo: this.authService.paralelo,
            id_distributivo: id_distributivo,
            id_asignatura: asignatura.id_asignatura,
            acronimo: acronimo
          };
          this.distributivoAsignaturaService.create(nuevoAsignaturaDistributivo).subscribe(response => {
            //Swal.fire('Asignatura guardada', `guardado con éxito`, 'success');
            console.log('Asignatura Distributivo generado');
          }, error => {
            //Swal.fire('ERROR', `no se ha podido guardar correctamente`, 'warning');
            console.log('Error al crear', error);
          });
        } else {
          console.log('No se ha seleccionado una jornada para la asignatura con id', asignatura.id_asignatura);
        }
      });
    });
  }


  createdistributivoacti(id_distributivo: number): void {
    this.Actividades.forEach(actividad => {
      const distributivoacti2: DistributivoActividad = {
        id_actividad: actividad.id_actividad,
        hora_no_docente: actividad.horas_no_docentes,
        id_distributivo: id_distributivo,
        id_distributivo_actividad: 0
      };
      this.distributivoActividadService.create(distributivoacti2)
        .subscribe(
          (distributivo) => {
            console.log("valorREVISAR", distributivo);
            //Swal.fire('Distributivo guardado', `Actividad ${distributivo.id_distributivo_actividad} Guardado con éxito`, 'success');
          },
          (error) => {
            console.error('Error al guardar la actividad:', error);
            // Toast.fire({
            //   icon: "error",
            //   title: "Hubo un error al guardar la actividad",
            //   footer: "Por favor, verifique"
            // });
          }
        );
    });
  }

  crearAcronimo(jornadaNombre: string, paralelo: string, id_ciclo: number): string {
    console.log('acronimo ', jornadaNombre + id_ciclo + paralelo );
    return jornadaNombre + id_ciclo + paralelo;
  }

}