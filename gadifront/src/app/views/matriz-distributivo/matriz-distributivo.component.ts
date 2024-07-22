import { Component, OnInit, ViewChild } from '@angular/core';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { PersonaService } from '../../Services/personaService/persona.service';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { JornadaService } from '../../Services/jornadaService/jornada.service';
import { DistributivoAsignaturaService } from '../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { DistributivoService } from '../../Services/distributivoService/distributivo.service';
import { DistributivoActividadService } from '../../Services/distributivoActividadService/distributivo_actividad.service';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { PeriodoService } from '../../Services/periodoService/periodo.service';
import { AuthService } from '../../auth.service';
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
import { Router } from '@angular/router';
import { EditarDialogComponent } from './editar-dialog/editar-dialog.component';

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
  displayedColumnsAct: string[] = ['nro_horas', 'total_horas', 'descripcion', 'tipo_actividad', 'editar', 'eliminar'];
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
  id_asignatura: any;
  horasActividad: any;
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
  center: any;

  constructor(
    private asignaturaService: AsignaturaService,
    private personaService: PersonaService,
    private carreraService: CarreraService,
    private jornadaService: JornadaService,
    private dialog: MatDialog,
    private distributivoAsignaturaService: DistributivoAsignaturaService,
    private distributivoService: DistributivoService,
    private distributivoActividadService: DistributivoActividadService,
    private actividadService: ActividadService,
    private tipo_contratoService: TipoContratoService,
    private tituloService: TituloProfesionalService,
    private tipo_actividadService: tipo_actividadService,
    private periodoService: PeriodoService,
    private authService: AuthService,
    private router: Router) {
    this.dataSourceAct = new MatTableDataSource<any>();
    this.dataSourceAsig = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    console.log('dsad');
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
  }

  onParaleloChange(event: any, idAsignatura: any, index: number): void {
    this.paralelo = event.target.value;
    const key = `${idAsignatura}-${index}`;
    this.paraleloSeleccionado[key] = this.paralelo;
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
          distributivosFiltrados.forEach(da => {
            const actividad = actividades.find(a => a.id_actividad === da.id_actividad);
            if (actividad) {
              actividadesFiltradas.push(actividad);
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

      this.authService.distributivos = this.distributivoFiltrado;
      this.distributivoFiltrado.forEach(distributivo => {
        this.authService.id_distributivo = distributivo.id_distributivo;
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
              asignaturaFiltradas.push(asignatura);

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
                id_distributivo_asig: da.id_distributivo_asig,
                id_ciclo: asignatura ? asignatura.id_ciclo : ''
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
  }

  asignarHoras(idActividad: number, index: number): void {
    const swalOptions: SweetAlertOptions = {
      title: 'Ingrese el número de horas asignadas',
      input: 'number',
      inputAttributes: {
        min: '1',
        max: this.horasActividad,
        step: '1'
      },
      inputLabel: 'Horas',
      inputPlaceholder: 'Ingrese un número entre 1 y ' + `${this.horasActividad}`,
      showCancelButton: true,
      inputValidator: (value) => {
        const numberValue = Number(value);
        if (isNaN(numberValue) || numberValue < 1 || numberValue > this.horasActividad) {
          return 'Las horas ingresadas son mayores a la actividad o son menores a cero ';
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

  eliminarActividad(idActividad: number): void {
    console.log(idActividad);
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.distributivoFiltrado.forEach(distributivo => {
          this.distributivoActividadService.getDistributivoActividad().subscribe(data => {
            const resultado = data as DistributivoActividad[];

            const resultFinal = resultado.find(d => d.id_distributivo === distributivo.id_distributivo && d.id_actividad === idActividad);
            if (resultFinal) {
              this.distributivoActividadService.delete(resultFinal.id_distributivo_actividad).subscribe(
                () => {
                  this.combinarDatos(this.distributivoFiltrado);
                  this.calcularTotales();
                  Toast.fire({
                    icon: "success",
                    title: "Actividad eliminada con éxito",
                  });
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
          });
        });
      }
    });

  }

  onRowClicked(row: any, index: number) {
    this.id_activida = row.idActividad;
    this.horasActividad = row.horaActividad;
    this.asignarHoras(row.idActividad, index);
  }

  abrirEditarAsignatura(idAsignaturaDistributivo: number, idCiclo: number): void {
    const dialogRef = this.dialog.open(EditarDialogComponent, {
      width: '400px',
      data: { paralelos: this.paralelos, jornadas: this.jornadas, id_distributivo_asig: idAsignaturaDistributivo }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('id distributivo', idAsignaturaDistributivo);
      if (result) {
        this.jornadaService.getJornadabyId(result.jornada).subscribe(response => {
          const jornadaNombre = response.descrip_jornada.charAt(0);
          const acronimo = this.crearAcronimo(jornadaNombre, result.paralelo, idCiclo);

          this.distributivoAsignaturaService.getDistributivobyId(idAsignaturaDistributivo).subscribe(response => {
            const actualizarAsignaturaDistributivo: DistributivoAsignatura = {
              id_jornada: result.jornada,
              paralelo: result.paralelo,
              id_distributivo: response.id_distributivo,
              id_asignatura: response.id_asignatura,
              acronimo: acronimo,
              id_distributivo_asig: response.id_distributivo_asig
            };

            this.distributivoAsignaturaService.updateDistributivo(actualizarAsignaturaDistributivo).subscribe(response => {
              this.combinarDatosAsignatura(this.distributivoFiltrado);
              this.calcularTotales();
              Toast.fire({
                icon: "success",
                title: "Asignatura actualizada correctamente",
              });
            })
          })
        })

      }
    });
  }

  editarAsignatura(row: any): void {
    this.id_asignatura = row.id_distributivo_asig;
    this.abrirEditarAsignatura(this.id_asignatura, row.id_ciclo);
  }

  eliminarAsignatura(row: any): void {
    const id_asignatura_distributivo = row.id_distributivo_asig;
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.distributivoAsignaturaService.getDistributivobyId(id_asignatura_distributivo).subscribe(response => {
          if (response) {
            this.distributivoAsignaturaService.delete(response.id_distributivo_asig).subscribe(response => {
              this.combinarDatosAsignatura(this.distributivoFiltrado);
              this.calcularTotales();
              Toast.fire({
                icon: "success",
                title: "Asignatura eliminada correctamente",
              });
            })
          }
        })
      }
    });
  }

  calcularTotales(): void {
    this.horasTotalesFinal = this.horasTotales + this.horasTotalesActividad;
    this.validarHorasContrato();
  }

  validarHorasContrato(): void {
    this.personaService.getPersonaById(this.authService.id_persona).subscribe(
      data => {
        this.tipo_contratoService.getcontratobyId(data.id_tipo_contrato).subscribe(contrato => {
          if (this.horasTotalesFinal === contrato.hora_contrato) {
            this.validador = 'false';
          } else {
            this.validador = 'true';
          }
        });
      });
  }

  public createdistributivo(): void {
    if (!this.validarJornadasSeleccionadas() || !this.validarParaleloSeleccionado()) {
      Toast.fire({
        icon: "warning",
        title: "Por favor, seleccione alguna opción en Jornada o Paralelo",
      });
    } else {
      this.distributivo.id_persona = this.authService.id_persona;
      this.distributivo.id_periodo = this.idPeriodo;
      this.distributivo.estado = 'Aceptado';
      this.distributivoService.create(this.distributivo)
        .subscribe(
          (distributivo) => {
            this.createAsignaturaDistributivo(distributivo.id_distributivo);
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
          this.distributivoAsignaturaService.create(nuevoAsignaturaDistributivo).subscribe(response => { }, error => { });
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
          (distributivo) => { },
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

    this.eliminarActividadDistributivo();
    this.eliminarAsignaturaDistributivo();
    this.distributivoFiltrado.forEach(distributivo => {
      this.distributivoService.delete(distributivo.id_distributivo).subscribe(response => { })
    });
    Toast.fire({
      icon: "success",
      title: "Distributivo guardado correctamente",
    });
    this.router.navigate(['/coordinador']);
  }

  eliminarAsignaturaDistributivo(): void {

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
            return of(null);
          }
        });

        forkJoin(allDeleteObservables).subscribe({
          next: () => { },
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
          return of(null);
        }
      });

      forkJoin(allDeleteObservables).subscribe({ next: () => { } });
    });

  }

  openModal() {
    this.enviarActividades();
    const dialogRef = this.dialog.open(EditarActividadesComponent, {
      width: '90%',
      height: '90%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.buscarDistributivo(this.authService.id_persona);
    });
  }

  openModalAsignatura() {
    this.enviarAsignaturas();
    const dialogRef = this.dialog.open(EditarAsignaturaComponent, {
      width: '90%',
      height: '90%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.buscarDistributivo(this.authService.id_persona);
    });
  }

  crearAcronimo(jornadaNombre: string, paralelo: string, id_ciclo: number): string {
    return jornadaNombre + id_ciclo + paralelo;
  }

  validarJornadasSeleccionadas(): boolean {
    return Object.keys(this.jornadaSeleccionada).length === this.asignaturas.length;
  }

  validarParaleloSeleccionado(): boolean {
    return Object.keys(this.paraleloSeleccionado).length === this.asignaturas.length;
  }

  updateAsigantura(): void {
    this.distributivoFiltrado.forEach(recorrido => {
      console.log(this.distributivoFiltrado);

      this.distributivoAsignaturaService.getDistributivoAsignatura().subscribe(obtenerAsignaturas => {
        const filtroAsignatura = obtenerAsignaturas as DistributivoAsignatura[];

        const asignaturasFiltradas = filtroAsignatura.filter(respueste => respueste.id_distributivo === recorrido.id_distributivo);
        console.log(asignaturasFiltradas);

        let processedCountAsig = 0;
        const totalAsignaturas = asignaturasFiltradas.length;

        if (totalAsignaturas === 0) {
          console.log('No se encontraron asignaturas para actualizar.');
          return;
        }

        asignaturasFiltradas.forEach(filtro => {
          this.asignaturaDistributivo = { ...filtro, id_distributivo: this.distributivoFiltrado[0].id_distributivo };

          this.distributivoAsignaturaService.updateDistributivo(this.asignaturaDistributivo).subscribe(
            () => {
              processedCountAsig++;
              console.log(`Asignatura actualizada: ${this.asignaturaDistributivo.id_distributivo}`);

              if (processedCountAsig === totalAsignaturas) {
                console.log('Todas las asignaturas se han actualizado.');
              }
            },
            error => {
              console.error('Error al actualizar asignatura:', error);
            }
          );
        });
      }, error => {
        console.error('Error al obtener asignaturas:', error);
      });
    });
  }



// Método principal
estadoDistributivo(): void {
  this.distributivoFiltrado.forEach(recorrido => {
    this.actualizarActividades(recorrido);
  });
}

// Método para actualizar actividades
actualizarActividades(recorrido: any): void {
  this.distributivoActividadService.getDistributivoActividad().subscribe(inicio => {
    const distributivosActALL = inicio as DistributivoActividad[];
    const filtroDistributivoActividad = distributivosActALL.filter(validacion => validacion.id_distributivo === recorrido.id_distributivo);
    let processedCount = 0;

    if (filtroDistributivoActividad.length === 0) {
      console.log('No se encontraron actividades para actualizar.');
      return;
    }

    filtroDistributivoActividad.forEach(mandarActualizacion => {
      this.distribdistributivoActividadesEn = { ...mandarActualizacion, id_distributivo: this.distributivoFiltrado[0].id_distributivo };
      this.distributivoActividadService.updateDistributivo(this.distribdistributivoActividadesEn).subscribe(() => {
        processedCount++;
        if (processedCount === filtroDistributivoActividad.length) {
          this.actualizarAsignaturas(recorrido);
        }
      });
    });
  });
}

// Método para actualizar asignaturas
actualizarAsignaturas(recorrido: any): void {
  this.distributivoAsignaturaService.getDistributivoAsignatura().subscribe(obtenerAsignaturas => {
    const filtroAsignatura = obtenerAsignaturas as DistributivoAsignatura[];
    const asignaturasFiltradas = filtroAsignatura.filter(respueste => respueste.id_distributivo === recorrido.id_distributivo);
    let processedCountAsig = 0;

    if (asignaturasFiltradas.length === 0) {
      console.log('No se encontraron asignaturas para actualizar.');
      return;
    }

    asignaturasFiltradas.forEach(filtro => {
      this.asignaturaDistributivo = { ...filtro, id_distributivo: this.distributivoFiltrado[0].id_distributivo };
      this.distributivoAsignaturaService.updateDistributivo(this.asignaturaDistributivo).subscribe(() => {
        processedCountAsig++;
        if (processedCountAsig === asignaturasFiltradas.length) {
          this.actualizarEstadoYEliminarDistributivos();
        }
      });
    });
  });
}

// Método para actualizar el estado y eliminar distributivos sobrantes
actualizarEstadoYEliminarDistributivos(): void {
  let processedCountDistributivo = 0;
  const idsDistributivosParaEliminar = this.distributivoFiltrado.slice(1).map(recorrer => recorrer.id_distributivo);

  this.distributivoFiltrado.forEach((recorrer, index) => {
    if (index === 0) {
      this.distributivo = { ...recorrer, estado: 'Aceptado' };
      this.distributivoService.updateDistributivo(this.distributivo).subscribe(() => {
        processedCountDistributivo++;
        if (processedCountDistributivo === this.distributivoFiltrado.length) {
          Toast.fire({
            icon: "success",
            title: "Distributivo guardado correctamente",
          });
        }
      });
    }
  });

  idsDistributivosParaEliminar.forEach(idDistributivo => {
    this.distributivoService.delete(idDistributivo).subscribe(() => {
      processedCountDistributivo++;
      if (processedCountDistributivo === this.distributivoFiltrado.length) {
        Toast.fire({
          icon: "success",
          title: "Distributivo guardado correctamente",
        });
        this.router.navigate(['/coordinador']);
      }
    });
  });
}


}