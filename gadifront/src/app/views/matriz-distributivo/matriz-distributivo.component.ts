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
import { catchError, forkJoin, map, mergeMap, of, tap } from 'rxjs';
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
import { MatDialog } from '@angular/material/dialog';
import { EditarActividadesComponent } from '../coordinador/editar-actividades/editar-actividades.component';
import { EditarAsignaturaComponent } from '../coordinador/editar-asignatura/editar-asignatura.component';
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

interface AsignaturaConDistributivo {
  distributivoAsignatura: DistributivoAsignatura;
  asignaturas: Asignatura;
  carreras?: Carrera;
  distributivo: Distributivo;
  jornada?: Jornada;
  periodo?: Periodo;
}
@Component({
  selector: 'app-matriz-distributivo',
  templateUrl: './matriz-distributivo.component.html',
  styleUrl: './matriz-distributivo.component.css'
})


export class MatrizDistributivoComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'correo', 'fecha_vinculacion', 'contrato', 'titulo', 'grado'];
  displayedColumnsAsig: string[] = ['carrera', 'asignatura', 'paralelo', 'nro_horas', 'jornada', 'periodo', 'asig_jornada', 'eliminar'];
  displayedColumnsAct: string[] = ['nro_horas', 'total_horas', 'descripcion', 'tipo_actividad', 'editar'];
  dataSourceAsig!: MatTableDataSource<any>;
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
  titulo: any[] = [];
  jornadaSeleccionada: { [key: string]: number } = {};
  id_distributivo: number = 0;
  paralelos: string[] = ['A', 'B'];
  paraleloSeleccionado: { [key: string]: string } = {};
  paralelo: string = '';
  horasAsignadasMap: { [key: string]: number } = {};
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
    private dialog: MatDialog,
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
    this.dataSourceAsig = new MatTableDataSource<any>();

  }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarComboJornada();
    this.cargarComboTitulos();
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
        this.buscarDistributivo(this.authService.id_persona);
      }
    });

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
  cargarComboTitulos(): void {
    this.tituloService.getTitulo().subscribe(data => {
      const titulosEncontrados = data as unknown as TituloProfecional[];
      const titulosFitrados = titulosEncontrados.filter(respuest => respuest.id_persona === this.authService.id_persona);
      if (titulosFitrados) {
        this.titulo = titulosFitrados;
      }

    });
  }

  cargarComboJornada(): void {
    this.jornadaService.getJornada().subscribe(data => {
      this.jornadas = data;
    });
  }

  onJornadaChange(event: any, idAsignatura: any, index: number): void {
    this.idJornada = +event.target.value;
    const key = `${idAsignatura}-${index}`;
    this.jornadaSeleccionada[key] = this.idJornada;
    console.log(`Asignatura ID: ${idAsignatura}, Jornada seleccionada: ${this.idJornada}`);
  }

  onParaleloChange(event: any, idAsignatura: any, index: number): void {
    this.paralelo = event.target.value;
    const key = `${idAsignatura}-${index}`;
    this.paraleloSeleccionado[key] = this.paralelo;
    console.log(`Asignatura ID: ${idAsignatura}, paralelo seleccionada: ${this.paralelo}`);
  }

  generateKey(id_asignatura: number, index: number): string {
    return `${id_asignatura}-${index}`;
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


  combinarDatos(distributivos: Distributivo[]): void {

    forkJoin({
      actividades: this.actividadService.getActividad(),
      tiposActividad: this.tipo_actividadService.gettipoActividad(),
      distributivosActividades: this.distributivoActividadService.getDistributivoActividad(),
    }).pipe(
      map(({ actividades, tiposActividad, distributivosActividades }) => {
        const data: any[] = [];
        const actividadesMap = new Map<number, any>();
        const actividadesFiltradas: Actividad[] = [];

        distributivos.forEach(dist => {
          const distributivosFiltrados = distributivosActividades.filter(da => da.id_distributivo === dist.id_distributivo);
          this.distributivoActividades.concat(distributivosFiltrados);
          console.log('distributivos:', this.distributivoActividades);
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

            } else {
              const existingActividad = actividadesMap.get(da.id_actividad);
              existingActividad.horasTotales += da.hora_no_docente;
            }

          });


        });

        actividadesMap.forEach(value => {
          data.push(value);
        });

        this.actividades = actividadesFiltradas;
        console.log('respuesta Actividades', this.actividades)
        return data;
      })
    ).subscribe(data => {
      this.dataSourceAct.data = data;
      this.horasTotalesActividad = 0;
      data.forEach(respuesta => {

        this.horasTotalesActividad += respuesta.horasTotales;
      });
      this.calcularTotales();
    });

  }
  buscarDistributivo(idPersona: number): void {
    idPersona = this.authService.id_persona;
    this.authService.clearLocalStorageDistributivos();
    this.distributivoService.getDistributivo().subscribe(data => {
      this.distributivos = data;
      this.distributivoFiltrado = this.distributivos.filter(
        (distributivo) => (distributivo.id_persona === idPersona &&
          distributivo.id_periodo === this.authService.id_periodo && distributivo.estado === 'Pendiente')
      );

      console.log('distributivo encontrado', this.distributivoFiltrado);
      this.authService.distributivos = this.distributivoFiltrado;
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

        this.asignaturas = this.asignaturas.concat(asignaturasCargadas);
        console.log('Asignaturas cargadas:', this.asignaturas);
        this.combinarDatosAsignatura(this.distributivoFiltrado);
        this.calcularTotales();
      });
    });
  }

  combinarDatosAsignatura(distributivos: Distributivo[]): void {
    forkJoin({
      asignaturas: this.asignaturaService.getAsignatura(),
      carreras: this.carreraService.getCarrera(),
      distributivoAsignatura: this.distributivoAsignaturaService.getDistributivoAsignatura(),
      jornadas: this.jornadaService.getJornada(),
      periodo: this.periodoService.getPeriodo()
    }).pipe(
      map(({ asignaturas, carreras, distributivoAsignatura, jornadas, periodo }) => {
        const data: any[] = [];
        const asignaturaMap = new Map<number, any>();
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
                id_asignatura: asignatura ? asignatura.id_asignatura : '',
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
        this.calcularHorasTotalesAsig();
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
        this.combinarDatos(this.distributivoFiltrado);
        this.calcularTotales();
        console.log('actividades cargadas:', this.actividades);
      });
    });

  }

  calcularHorasTotalesAsig(): void {
    this.horasTotales = this.asignaturas.reduce(
      (sum, asignatura) => sum + asignatura.horas_semanales, 0
    );
  }



  enviarAsignaturas(): void {
    this.authService.asignaturasSeleccionadaAuth = this.asignaturas;
  }

  enviarActividades(): void {
    this.authService.id_actividades = this.actividades;
    this.authService.distributivos = this.distributivoFiltrado;
    this.authService.id_distributivoActividad = this.distributivoActividades;
    console.log('distributivos enviados', this.authService.id_distributivoActividad);

  }

  asignarHoras(idActividad: number, index: number): void {
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
          return 'Por favor, ingrese un número mayor a cero';
        }
        return null;
      }
    };

    Swal.fire(swalOptions).then((result) => {
      if (result.isConfirmed) {
        const horasAsignadas = result.value;
        const key = `${idActividad}-${index}`;
        this.horasAsignadasMap[key] = horasAsignadas;
        console.log(`Actividad ID: ${idActividad}, Index: ${index}, Horas asignadas: ${horasAsignadas}`);

        // Iterar sobre los distributivos y actualizar DistributivoActividad si existe
        this.distributivoFiltrado.forEach(distributivo => {
          const distributivoActividad: DistributivoActividad = {
            id_distributivo_actividad: 0, // Asegúrate de ajustar esto al campo correcto de tu modelo
            id_distributivo: distributivo.id_distributivo,
            id_actividad: this.id_activida,
            hora_no_docente: horasAsignadas
          };

          // Buscar el DistributivoActividad correspondiente
          this.distributivoActividadService.getDistributivoActividad().subscribe(data => {
            const resultado = data as DistributivoActividad[];

            const resultFinal = resultado.find(d => d.id_distributivo === distributivo.id_distributivo && d.id_actividad === this.id_activida);
            if (resultFinal) {
              // Actualizar horas si existe
              resultFinal.hora_no_docente = horasAsignadas;
              this.distributivoActividadService.updateDistributivo(resultFinal).subscribe(
                () => {
                  this.combinarDatos(this.distributivoFiltrado);
                  this.calcularTotales();
                  Toast.fire({
                    icon: "success",
                    title: "Horas asignadas con éxito",
                  });
                  console.log('primer create');
                },
                (error) => {
                  console.error('Error al actualizar DistributivoActividad:', error);
                  Toast.fire({
                    icon: "error",
                    title: "Error al actualizar horas",
                  });
                }
              );
            }
            //   // Si no existe, crear un nuevo DistributivoActividad
            //   this.distributivoActividadService.create(distributivoActividad).subscribe(
            //     () => {
            //       this.combinarDatos(this.distributivoFiltrado);
            //       Toast.fire({
            //         icon: "success",
            //         title: "Horas asignadas con éxito",
            //       });
            //       console.log('segundo create');
            //     },
            //     (error) => {
            //       console.error('Error al crear DistributivoActividad:', error);
            //       Toast.fire({
            //         icon: "error",
            //         title: "Error al asignar horas",
            //       });
            //     }
            //   );
            // }
          });
        });


      }
    });
  }

  onRowClicked(row: any, index: number) {
    this.id_activida = row.idActividad;
    console.log('ID of clicked row: ', row.idActividad);
    this.asignarHoras(row.idActividad, index);
  }

  calcularTotales(): void {
    this.horasTotalesFinal = this.horasTotales + this.horasTotalesActividad;
    console.log('horas', this.horasTotalesFinal, this.horasTotalesActividad)
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
            this.validador = 'true';
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
          this.eliminarDistributivos();
          
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
    this.asignaturas.forEach((asignatura, index) => {
      const key = `${asignatura.id_asignatura}-${index}`;
      const id_jornada = this.jornadaSeleccionada[key];
      const paralelo = this.paraleloSeleccionado[key];
      this.jornadaService.getJornadabyId(id_jornada).subscribe(data => {
        const jornadaNombre = data.descrip_jornada.charAt(0);
        const acronimo = this.crearAcronimo(jornadaNombre, paralelo, asignatura.id_ciclo);

        if (id_jornada) {
          const nuevoAsignaturaDistributivo: DistributivoAsignatura = {
            id_jornada: id_jornada,
            paralelo: paralelo,
            id_distributivo: id_distributivo,
            id_asignatura: asignatura.id_asignatura,
            acronimo: acronimo,
            id_distributivo_asig: 0
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
    this.actividades.forEach((actividad, index) => {
      const key = `${actividad.id_actividad}-${index}`;
      const horasNoDocentes = this.horasAsignadasMap[key];
      this.distributivoActividades
      const distributivoacti2: DistributivoActividad = {
        id_actividad: actividad.id_actividad,
        hora_no_docente: horasNoDocentes,
        id_distributivo: id_distributivo,
        id_distributivo_actividad: 0
      };
      this.distributivoActividadService.create(distributivoacti2)
        .subscribe(
          (distributivo) => {
            console.log("valorREVISAR", distributivo);
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
    console.log('Iniciando eliminación de distributivos y sus relaciones.');
  
    this.eliminarActividadDistributivo();
    this.eliminarAsignaturaDistributivo();
    this.distributivoFiltrado.forEach(distributivo =>{
      this.distributivoService.delete(distributivo.id_distributivo).subscribe(response=>{
        console.log('Distributivos eliminado');
      })
    });
    Toast.fire({
      icon: "success",
      title: "Distributivo guardado correctamente",
    });
    this.router.navigate(['/coordinador']);
  }

  eliminarAsignaturaDistributivo(): void {
    console.log('id distributivo:', this.id_distributivo);

    this.distributivoAsignaturaService.getDistributivoAsignatura().subscribe(
      data => {
        const distributivoEncontrado = data as DistributivoAsignatura[];

        const allDeleteObservables = this.authService.distributivos.map(distributivoId => {
          const distributivosFinales = distributivoEncontrado.filter(
            resul => resul.id_distributivo === distributivoId.id_distributivo
          );

          if (distributivosFinales.length > 0) {
            const deleteObservables = distributivosFinales.map(distributivoFinal =>
              this.distributivoAsignaturaService.delete(distributivoFinal.id_distributivo_asig)
            );
            return forkJoin(deleteObservables);
          } else {
            // No hay actividades asociadas, retornar un observable vacío
            return of(null);
          }
        });


        forkJoin(allDeleteObservables).subscribe({
          next: () => {
            console.log('Asignaturas eliminadas correctamente')
          },
          error: (error) => {
            console.error('Error al eliminar asignaturas:', error);
          }
        });
      }
    );

  }

  eliminarActividadDistributivo(): void {

    this.distributivoActividadService.getDistributivoActividad().subscribe(data => {
      const distributivoEncontrado = data as DistributivoActividad[];

      const allDeleteObservables = this.authService.distributivos.map(distributivoId => {
        const distributivosFinales = distributivoEncontrado.filter(
          resul => resul.id_distributivo === distributivoId.id_distributivo
        );
        
        if (distributivosFinales.length > 0) {
          const deleteObservables = distributivosFinales.map(distributivoFinal =>
            this.distributivoActividadService.delete(distributivoFinal.id_distributivo_actividad)
          );
          return forkJoin(deleteObservables);
        } else {
          // No hay actividades asociadas, retornar un observable vacío
          return of(null);
        }
      });

      forkJoin(allDeleteObservables).subscribe({
        next: () => {
          console.log('Actividade eliminadas');
        }
      });
    });

  }




  openModal() {
    this.enviarActividades();
    const dialogRef = this.dialog.open(EditarActividadesComponent, {
      width: '90%',
      height: '90%',
    });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  openModalAsignatura() {
    this.enviarAsignaturas();
    const dialogRef = this.dialog.open(EditarAsignaturaComponent, {
      width: '90%',
      height: '90%',
    });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  crearAcronimo(jornadaNombre: string, paralelo: string, id_ciclo: number): string {
    console.log('acronimo ', jornadaNombre + id_ciclo + paralelo);
    return jornadaNombre + id_ciclo + paralelo;
  }
}
