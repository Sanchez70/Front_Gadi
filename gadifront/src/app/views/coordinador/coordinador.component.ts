import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from '../persona/persona.service';
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
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'correo', 'fecha_vinculacion', 'contrato', 'titulo', 'detalle'];
  dataSource = new MatTableDataSource<Persona>();
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};
  personas: Persona[] = [];
  personaEncontrada: Persona = new Persona();
  gradoOcupacional: Grado_ocupacional = new Grado_ocupacional();
  tipo_contrato: Tipo_contrato = new Tipo_contrato();
  titulo: Titulo_profesional = new Titulo_profesional();
  cedula: string = '';
  color = '#1E90FF';
  currentExplan: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private personaService: PersonaService,
    private tipo_contratoService: TipoContratoService,
    private tituloService: TituloProfesionalService,
    private gradoService: GradoOcupacionalService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });

    this.personaService.getPersonas().subscribe(data => {
      this.personas = data;
      this.loadAdditionalDataForPersonas();
      console.log(this.dataSource);
    })
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

  verDetalle(valor: any): void {
    this.authService.clearLocalStorageAsignatura();
    console.log(valor)
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

