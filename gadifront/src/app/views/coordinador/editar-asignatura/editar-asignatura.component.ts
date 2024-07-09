import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { DistributivoAsignatura } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura';
import { AsignaturaService } from '../../../Services/asignaturaService/asignatura.service';
import { JornadaService } from '../../../Services/jornadaService/jornada.service';
import { AuthService } from '../../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CicloService } from '../../../Services/cicloService/ciclo.service';
import { CarreraService } from '../../../Services/carreraService/carrera.service';
import { DistributivoAsignaturaService } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { Asignatura } from '../../../Services/asignaturaService/asignatura';
import { Observable, forkJoin, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
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
  selector: 'app-editar-asignatura',
  templateUrl: './editar-asignatura.component.html',
  styleUrl: './editar-asignatura.component.css'
})
export class EditarAsignaturaComponent {
  carreras: any[] = [];
  carreraSeleccionada: number = 0;
  asignaturas: any[] = [];
  asignaturaFiltrada: any[] = [];
  paralelos: string[] = ['A', 'B'];
  paraleloSeleccionado: string = '';
  jornadas: any[] = [];
  jornadaSeleccionada: number = 0;
  idJornada: number = 0;
  asignaturasSeleccionadas: Asignatura[] = [];
  distributivoAsignatura: DistributivoAsignatura = new DistributivoAsignatura();
  nombreCiclo: string = '';
  horasTotales: number = 0;
  idCarrera: number = 0;
  idCiclo: number = 0;
  ciclos: any[] = [];
  cicloSeleccionado: number = 0;
  id_distributivo = 1;
  currentExplan: string = '';
  myForm: FormGroup = this.fb.group({});

  public asignaturaDistributivo: DistributivoAsignatura = new DistributivoAsignatura();
  constructor(private asignaturaService: AsignaturaService, private cicloService: CicloService, private carreraService: CarreraService,
    private jornadaService: JornadaService, private distributivoAsignaturaService: DistributivoAsignaturaService,
    private authService: AuthService, private router: Router,
    private activatedRoute: ActivatedRoute, private fb: FormBuilder, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarComboCarreras();
    //this.cargarComboJornada();

    this.cargarAsignaturasENviadas();

    this.myForm = this.fb.group({
      paraleloSeleccionado: [null, Validators.required],
      cicloSeleccionado: [null, Validators.required],
      carreraSeleccionada: [null, Validators.required]
    })
  }
  cargarAsignaturasENviadas(): void {
    this.asignaturasSeleccionadas = this.authService.asignaturasSeleccionadaAuth;
    this.calcularHorasTotales();
  }
  cargarComboCarreras(): void {
    this.carreraService.getCarrera().subscribe(data => {
      this.carreras = data;
    });

  }

  cargarComboCiclos(): void {
    this.cicloService.getCiclo().subscribe(data => {
      this.ciclos = data;

    });
  }

  cargarComboJornada(): void {
    this.jornadaService.getJornada().subscribe(data => {
      this.jornadas = data;
    });
  }

  enviarAsignaturasDistributibo(): void {
    this.authService.clearLocalStorageAsignatura();
    this.authService.asignaturasSeleccionadaAuth = this.asignaturasSeleccionadas;
    this.router.navigate(['/matriz-distributivo']);
  }

  cargarAsignaturas(): Observable<void> {
    return new Observable(observer => {
      this.asignaturaService.getAsignatura().subscribe(data => {
        this.asignaturas = data;
        observer.next();
        observer.complete();
      });
    });
  }


  onCarreraChange(event: any): void {
    this.cicloSeleccionado = 0;
    this.carreraSeleccionada = +event.target.value;
    this.idCarrera = this.carreraSeleccionada;
    console.log('id carrera', this.idCarrera)
    this.cargarComboCiclos();


  }

  onCicloChange(event: any): void {
    this.cicloSeleccionado = +event.target.value;
    this.idCiclo = this.cicloSeleccionado;
    console.log('id ciclo', this.idCiclo)
    this.myForm.get('cicloSeleccionado')?.setValue(event.target.value);
    this.filtrarAsignaturaCarrerabyCiclo();
  }

  onJornadaChange(event: any): void {
    this.jornadaSeleccionada = +event.target.value;
    this.idJornada = this.jornadaSeleccionada;
    console.log('id_jornada', this.idJornada);
  }

  onParaleloChange(event: any): void {
    this.paraleloSeleccionado = event.target.value;
    console.log('paralelo', this.paraleloSeleccionado);
    this.myForm.get('paraleloSeleccionado')?.setValue(event.target.value);
  }

  filtrarAsignaturaCarrerabyCiclo(): void {
    this.cargarAsignaturas().subscribe(() => {
      this.asignaturaFiltrada = this.asignaturas.filter(
        (asignatura) =>
          (asignatura.id_carrera === this.idCarrera) &&
          (this.cicloSeleccionado === null || asignatura.id_ciclo === this.idCiclo)
      );
      console.log('asignatura filtrada por ciclo', this.asignaturaFiltrada)
    });
  }

  escogerAsignatura(asignatura: Asignatura): void {
    const asignaturaExistente = this.asignaturasSeleccionadas.some(
      (id) => id.id_asignatura === asignatura.id_asignatura
    );
    this.asignaturasSeleccionadas.push(asignatura);
    this.calcularHorasTotales();
    // } else {
    //   Toast.fire({
    //     icon: "warning",
    //     title: "La asignatura se encuentra seleccionada",
    //   });
    // }
  }

  eliminarAsignatura(fila: number): void {
    this.asignaturasSeleccionadas.splice(fila, 1);
    this.calcularHorasTotales()
  }

  calcularHorasTotales(): void {
    this.horasTotales = this.asignaturasSeleccionadas.reduce(
      (sum, asignatura) => sum + asignatura.horas_semanales, 0
    );
  }

  obtenerNombreCiclo(id_ciclo: number): void {
    const ciclo = this.ciclos.find(ciclo => ciclo.id_ciclo === id_ciclo);
    return ciclo ? ciclo.nombre_ciclo : '';
  }

  enviarAsignaturas(): void {
    console.log('id distributivo:', this.id_distributivo);
    this.authService.id_asignaturas = this.asignaturasSeleccionadas;
  
    // Obtener todas las distributivoAsignaturas
    this.distributivoAsignaturaService.getDistributivoAsignatura().subscribe(
      data => {
        const distributivoEncontrado = data as DistributivoAsignatura[];
        // Filtrar las asignaturas relacionadas a cada distributivo cargado
        const allDeleteObservables = this.authService.distributivos.map(distributivoId => {
          const distributivosFinales = distributivoEncontrado.filter(
            resul => resul.id_distributivo === distributivoId.id_distributivo
          );
          if (distributivosFinales.length > 0) {
            const deleteObservables = distributivosFinales.map(distributivoFinal =>
              this.distributivoAsignaturaService.delete(distributivoFinal.id_distributivo_asig)
            );
            console.log('eliminado')
            return forkJoin(deleteObservables);
          } else {
      
            return of(null);
          }
        });

        forkJoin(allDeleteObservables).subscribe({
          next: () => {
            this.crearNuevasAsignaturas();
          },
          error: (error) => {
            console.error('Error al eliminar asignaturas:', error);
          }
        });
      },
      error => {
        console.error('Error al obtener distributivoAsignaturas:', error);
      }
    );
  }
  
  // Método para crear nuevas asignaturas
  crearNuevasAsignaturas(): void {
    const createObservables = this.asignaturasSeleccionadas.map(data => {
      const newDistributivoAsignatura = {
        ...this.distributivoAsignatura,
        id_asignatura: data.id_asignatura,
        paralelo: '',
        id_jornada: 1,
        id_distributivo: this.authService.id_distributivo
      };
      return this.distributivoAsignaturaService.create(newDistributivoAsignatura);
    });
  
    // Ejecutar la creación de nuevas asignaturas
    forkJoin(createObservables).subscribe({
      next: (responses) => {
        // Guardar todos los IDs de las distribuciones creadas
        const idsDistributivoAsignatura = responses.map(respuest => respuest.id_distributivo_asig);
        this.authService.id_distributivoAsignatura = idsDistributivoAsignatura;
        this.authService.saveUserToLocalStorage();
        this.dialog.closeAll();
        console.log('Asignaturas creadas correctamente');
      },
      error: (error) => {
        console.error('Error al crear asignaturas:', error);
      }
    });
  }

  cerrarDialogo(): void {
    this.dialog.closeAll();
  }
}
