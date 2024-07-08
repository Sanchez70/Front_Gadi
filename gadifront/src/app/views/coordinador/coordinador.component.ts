import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from '../../Services/personaService/persona.service';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { GradoOcupacionalService } from '../../Services/grado/grado-ocupacional.service';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { Persona } from '../../Services/docenteService/persona';
import { Grado_ocupacional } from '../../Services/grado/grado_ocupacional';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../auth.service';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { PeriodoService } from '../../Services/periodoService/periodo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DistributivoService } from '../../Services/distributivoService/distributivo.service';
import { Periodo } from '../../Services/periodoService/periodo';
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
interface PersonaExtendida extends Persona {
  nombre_contrato?: string;
  nombre_titulo?: string;
  nombre_grado_ocp?: string;
}
@Component({
  selector: 'app-coordinador',
  templateUrl: './coordinador.component.html',
  styleUrl: './coordinador.component.css'
})
export class CoordinadorComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'correo', 'fecha_vinculacion', 'contrato', 'detalle'];
  dataSource = new MatTableDataSource<Persona>();
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};
  periodos: any[] = [];
  personas: Persona[] = [];
  periodoSeleccionado: number = 0;
  idPeriodo: number = 0;
  personaEncontrada: Persona = new Persona();
  gradoOcupacional: Grado_ocupacional = new Grado_ocupacional();
  tipo_contrato: Tipo_contrato = new Tipo_contrato();
  titulo: Titulo_profesional = new Titulo_profesional();
  public periodoEncontrado: Periodo = new Periodo();
  cedula: string = '';
  color = '#1E90FF';
  currentExplan: string = '';
  myForm: FormGroup = this.fb.group({});
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private personaService: PersonaService,
    private tipo_contratoService: TipoContratoService,
    private tituloService: TituloProfesionalService,
    private gradoService: GradoOcupacionalService,
    private authService: AuthService,
    private periodoService: PeriodoService,
    private distributivoService: DistributivoService,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });

    this.myForm = this.fb.group({
      periodoSeleccionado: [null, Validators.required]
    })
    this.cargarComboPeriodos();
    this.distributivoService.getDistributivo().subscribe(distributivos => {
      const distributivosPendientes = distributivos.filter(distributivo => distributivo.estado === 'Pendiente');
      const idsPersonasPendiente = new Set(distributivosPendientes.map(distributivo => distributivo.id_persona));

      this.personaService.getPersonas().subscribe(data => {
        this.personas = data.filter(persona => idsPersonasPendiente.has(persona.id_persona));
        this.loadAdditionalDataForPersonas();
        console.log(this.dataSource);
      })
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

  buscarPersona(): void {
    this.personaService.getPersonaByCedula(this.cedula).subscribe(data => {
      this.personaEncontrada = data;
      console.log('id_persona', this.personaEncontrada.id_persona);
      this.loadAdditionalDataForPersonas();
    });

  }
  loadAdditionalDataForPersonas(): void {
    const requests = this.personas.map(persona =>
      this.personaService.getPeriodoById(persona.id_persona).pipe(
        switchMap(() => forkJoin([
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
        ]))
      )
    );

    forkJoin(requests).subscribe(() => {
      this.dataSource = new MatTableDataSource(this.personas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  onChangeBuscar(event: any): void {
    this.cedula = event.target.value;
    console.log('cedula ingresada', this.cedula)
  }

  // onPeriodoChange(event: any): void {
  //   this.periodoSeleccionado = +event.target.value;
  //   this.idPeriodo = this.periodoSeleccionado;
  //   console.log('idPeriodo', this.idPeriodo)
  // }

  verDetalle(valor: any): void {
      this.authService.clearLocalStorageAsignatura();
      this.authService.clearLocalStorageActividad();
      console.log(valor)
      this.authService.id_periodo = this.idPeriodo;
      this.authService.saveUserToLocalStorage();
      console.log('idPeriodo enviado', this.idPeriodo);
      this.personaService.getPersonas().subscribe(data => {
        const personaEncontrados = data as Persona[];
        const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === valor);
        if (usuarioEncontrado) {
          this.authService.id_persona = usuarioEncontrado.id_persona;
          this.router.navigate(['/matriz-distributivo']);
        }
      });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

