import { Component, OnInit, ViewChild } from '@angular/core';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { PersonaService } from '../../Services/personaService/persona.service';
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
import { catchError, forkJoin, map, of, tap } from 'rxjs';
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
import Swal, { SweetAlertOptions } from 'sweetalert2';
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
  selector: 'app-matriz-distributivo',
  templateUrl: './matriz-distributivo.component.html',
  styleUrl: './matriz-distributivo.component.css'
})


export class MatrizDistributivoComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'direccion', 'correo', 'edad', 'fecha_vinculacion', 'contrato', 'titulo', 'grado'];
  displayedColumnsAsig: string[] = ['carrera', 'asignatura', 'paralelo', 'nro_horas', 'jornada', 'periodo'];
  displayedColumnsAct: string[] = ['nro_horas', 'total_horas', 'descripcion', 'tipo_actividad', 'editar'];
  dataSourceAsig!: MatTableDataSource<Asignatura>;
  dataSourceAct!: MatTableDataSource<any>;
  dataSource!: MatTableDataSource<Persona>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};
  periodosDis: { [key: number]: Periodo } = {};
  jornada: { [key: number]: Jornada } = {};
  distributivoAsignatura: { [key: number]: DistributivoAsignatura } = {};
  distributivoActividad: { [key: number]: DistributivoActividad } = {};
  carreras: { [key: number]: Carrera } = {};
  tipo_actividad: { [key: number]: tipo_actividad } = {};
  idJornada: number = 0;
  horasDistributivo: any;
  color = '#1E90FF';
  currentExplan: string = '';
  personaEncontrada: Persona = new Persona();
  personas: Persona[] = [];
  distributivos: Distributivo[] = [];
  actividades: Actividad[] = [];
  distributivoFiltrado: any[] = [];
  periodos: any[] = [];
  distributivoAsignaturas: DistributivoAsignatura[] = [];
  distributivoActividades: DistributivoActividad[] = [];
  distribdistributivoActividadesEn: DistributivoActividad = new DistributivoActividad();
  distributivoActividadesFiltrado: DistributivoActividad[] = [];
  actividadesFiltradas: any[] = [];
  asignaturas: Asignatura[] = [];
  periodo: Periodo = new Periodo();
  tipos: tipo_actividad[] = [];
  idPeriodo: number = this.authService.id_periodo;
  periodoName: string = '';
  horasTotales: number = 0;
  horasTotalesActividad: number = 0;
  horasTotalesFinal: number = 0;
  id_activida: any;
  validador: string = '';
  jornadas: any[] = [];
  jornadaSeleccionada: number = 0;
  id_distributivo: number = 0;
  public asignaturaDistributivo: DistributivoAsignatura = new DistributivoAsignatura();
  public distributivo: Distributivo = new Distributivo();
  public distributivoacti: DistributivoActividad = new DistributivoActividad();
  public persona: Persona = new Persona();
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
    this.dataSourceAct = new MatTableDataSource<any>();

  }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarComboJornada();
    this.cargarTipoActividad();
    this.cargarCarreras();
    this.cargarComboPeriodos();
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

  cargarComboPeriodos(): void {
    this.periodoService.getPeriodobyId(this.idPeriodo).subscribe(data => {
      this.periodo = data;
      this.periodoName = this.periodo.nombre_periodo;
    });
  }
  cargarComboJornada(): void {
    this.jornadaService.getJornada().subscribe(data => {
      this.jornadas = data;
    });
  }
  onJornadaChange(event: any): void {
    this.jornadaSeleccionada = +event.target.value;
    this.idJornada = this.jornadaSeleccionada;
    console.log('id_jornada', this.idJornada);
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
  combinarDatos(): void {
    this.horasTotalesActividad=0;
    forkJoin({
      actividades: this.actividadService.getActividad(),
      tiposActividad: this.tipo_actividadService.gettipoActividad(),
      distributivosActividades: this.distributivoActividadService.getDistributivoActividad(),
    }).pipe(
      map(({ actividades, tiposActividad, distributivosActividades }) => {
        const data: any[] = [];
        const actividadesMap = new Map<number, any>();
        const actividadesFiltradas: Actividad[] = [];
  
        const distributivosFiltrados = distributivosActividades.filter(da => da.id_distributivo === this.id_distributivo);
        distributivosFiltrados.forEach(da => {
          const actividad = actividades.find(a => a.id_actividad === da.id_actividad);
          if (actividad) {
            actividadesFiltradas.push(actividad); // Guardar la actividad filtrada en el array
          }
          const tipoActividad = tiposActividad.find(ta => ta.id_tipo_actividad === actividad?.id_tipo_actividad);
          if (!actividadesMap.has(da.id_actividad)) {
            actividadesMap.set(da.id_actividad, {
              descripcionActividad: actividad ? actividad.descripcion_actividad : '',
              tiposActividad: tipoActividad ? tipoActividad.nom_tip_actividad : '',
              horaActividad: actividad ? actividad.horas_no_docentes : '',
              horasTotales: da.hora_no_docente,
              idActividad: actividad ? actividad.id_actividad : '',
            });
            this.horasTotalesActividad +=  da.hora_no_docente ;
          } else {
            const existingActividad = actividadesMap.get(da.id_actividad);
            existingActividad.horasTotales += da.hora_no_docente;
          }
        });
        actividadesMap.forEach(value => {
          data.push(value);
        });
  
        this.actividades = actividadesFiltradas; 
        console.log('respuesta Actividades',this.actividades)
        return data;
      })
    ).subscribe(data => {
      this.dataSourceAct.data = data;
      this.calcularTotales();
    });

  }
  buscarDistributivo(idPersona: number): void {
    idPersona = this.authService.id_persona;
    this.distributivoService.getDistributivo().subscribe(data => {
      this.distributivos = data;
      this.distributivoFiltrado = this.distributivos.filter(
        (distributivo) => (distributivo.id_persona === idPersona &&
          distributivo.id_periodo === this.authService.id_periodo)
      );

      console.log('distributivo encontrado', this.distributivoFiltrado);
      this.distributivoFiltrado.forEach(distributivo => {
        this.id_distributivo = distributivo.id_distributivo;
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
        } else {
          this.asignaturas = this.authService.asignaturasSeleccionadaAuth
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
      this.authService.id_distributivo = idDistributivo;
      const idActividades = actividadesFiltradas.map(acti => acti.id_actividad);
      this.actividadService.getActividad().subscribe(acti => {
        const activEncontrados = acti as Actividad[];
        const actividadesCargadas = activEncontrados.filter(actividad =>
          idActividades.includes(actividad.id_actividad)
        );
        this.actividades = this.actividades.concat(actividadesCargadas);
        this.combinarDatos();
        this.calcularTotales();
        console.log('actividades cargadas:', this.actividades);
      });
    });

  }

  calcularHorasTotales(): void {

    this.horasTotales = this.asignaturas.reduce(
      (sum, asignatura) => sum + asignatura.horas_semanales, 0
    );
    console.log('horas totales asignatura', this.horasTotales);
  }

 

  enviarAsignaturas(): void {
    this.authService.asignaturasSeleccionadaAuth = this.asignaturas;
  }

  enviarActividades(): void {
    this.authService.id_actividades = this.actividades;

  }

  asignarHoras(): void {
    const swalOptions: SweetAlertOptions = {
      title: 'Ingrese el número de horas asignadas',
      input: 'number',
      inputAttributes: {
        min: '1',
        max: '24',
        step: '1'
      },
      inputLabel: 'Horas',
      inputPlaceholder: 'Ingrese un número entre 1 y 24',
      showCancelButton: true,
      inputValidator: (value) => {
        const numberValue = Number(value);
        if (isNaN(numberValue) || numberValue < 1) {
          return 'Por favor, Ingrese un numero mayor a cero';
        }
        return null;
      }
    };

    Swal.fire(swalOptions).then((result) => {
      if (result.isConfirmed) {
        const horasAsignadas = result.value;
        this.distributivoActividadService.getDistributivoActividad().subscribe(data => {
          const resultado = data as DistributivoActividad[];
          const resultFinal = resultado.find(distributivo => distributivo.id_distributivo === this.id_distributivo && distributivo.id_actividad === this.id_activida);
          if (resultFinal) {
            resultFinal.hora_no_docente = horasAsignadas;
            this.distributivoActividadService.create(resultFinal).subscribe(data1 => {        
              this.combinarDatos();
              Toast.fire({
                icon: "success",
                title: "Horas asignadas con exito",
              });
            });
          }
        });
      }
    });
  }

  onRowClicked(row: any) {
    this.id_activida = row.idActividad;
    console.log('ID of clicked row: ', row.idActividad);
    this.asignarHoras();
  }

  calcularTotales(): void {
    this.horasTotalesFinal = this.horasTotales + this.horasTotalesActividad;
    console.log('horas',this.horasTotalesFinal, this.horasTotalesActividad)
    this.validarHorasContrato();
  }


  validarHorasContrato(): void {
    console.log('inicio')
    this.personaService.getPersonaById(this.authService.id_persona).subscribe(
      data => {
        this.tipo_contratoService.getcontratobyId(data.id_tipo_contrato).subscribe(contrato => {
          if (this.horasTotalesFinal === contrato.hora_contrato) {
            this.validador = 'false';
            console.log('inicio', this.validador)
          } else {
            this.validador = 'tru';
            console.log('inicio', this.validador)

          }
        });
      });
  }

  public createdistributivo(): void {
    this.distributivo.id_persona = this.authService.id_persona;
    this.distributivo.id_periodo = this.idPeriodo;
    this.distributivo.estado = 'Aceptado';
    this.distributivoService.create(this.distributivo)
      .subscribe(
        (distributivo) => {
          console.log("valor", distributivo);
          this.createAsignaturaDistributivo(distributivo.id_distributivo); // Pasa el id_distributivo al segundo método
          this.createdistributivoacti(distributivo.id_distributivo);
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

  createAsignaturaDistributivo(id_distributivo: number): void { // Recibe el id_distributivo como argumento
    this.asignaturas.forEach(asignatura => {
      const nuevoAsignaturaDistributivo: DistributivoAsignatura = {
        id_jornada: this.idJornada,
        paralelo: this.authService.paralelo,
        id_distributivo: id_distributivo,
        id_asignatura: asignatura.id_asignatura
      };
      this.distributivoAsignaturaService.create(nuevoAsignaturaDistributivo).subscribe(response => {
        //Swal.fire('Asignatura guardada', `guardado con éxito`, 'success');
        console.log('Asignatura Distributivo generado');
      }, error => {
        //Swal.fire('ERROR', `no se ha podido guardar correctamente`, 'warning');
        console.log('Error al crear', error);
      });
    });
  }


  createdistributivoacti(id_distributivo: number): void {
    this.actividades.forEach(actividad => {
      this.distributivoActividades
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
            Swal.fire('Distributivo guardado', `Actividad ${distributivo.id_distributivo_actividad} Guardado con éxito`, 'success');
          },
          (error) => {
            console.error('Error al guardar la actividad:', error);
            Toast.fire({
              icon: "error",
              title: "Hubo un error al guardar la actividad",
              footer: "Por favor, verifique"
            });
          }
        );
    });
  }

  eliminarDistributivos(): void {
    console.log('antes de asig');
    this.distributivoActividadService.getDistributivoActividad().subscribe(
      data => {
        const distributivoEncontrado = data as DistributivoActividad[];
        const distributivosFinales = distributivoEncontrado.filter(resul => resul.id_distributivo === this.id_distributivo);
        if (distributivosFinales.length > 0) {
          console.log('Registros de distributivoActividad encontrados:', distributivosFinales);
          distributivosFinales.forEach(distributivoFinal => {
            this.distributivoActividadService.delete(distributivoFinal.id_distributivo_actividad).subscribe(() => {
              console.log('Eliminado distributivoActividad id:', distributivoFinal.id_distributivo_actividad);
              this.distributivoAsignaturaService.getDistributivoAsignatura().subscribe(dataAsig => {
                const distributivoAsig = dataAsig as DistributivoAsignatura[];
                const asignaturasFinales = distributivoAsig.filter(result => result.id_distributivo === this.id_distributivo);
                if (asignaturasFinales.length > 0) {
                  asignaturasFinales.forEach(asignaturaFinal => {
                    this.distributivoAsignaturaService.delete(asignaturaFinal.id_distributivo_asig ?? 0).subscribe(() => {
                      console.log('Eliminado distributivoAsignatura id:', asignaturaFinal.id_distributivo_asig);
                      this.distributivoService.delete(asignaturaFinal.id_distributivo).subscribe(() => {
                        console.log('Eliminado actividad id_distributivo:', asignaturaFinal.id_distributivo);
                        this.createdistributivo();
                      });
                    });
                  });
                } else {
                  console.log('No se encontraron asignaturas con el id_distributivo:', this.id_distributivo);
                }
              });
            });
          });
        } else {
          console.log('No se encontraron distributivosActividad con el id_distributivo:', this.id_distributivo);
        }

      }
    );
  }

}
