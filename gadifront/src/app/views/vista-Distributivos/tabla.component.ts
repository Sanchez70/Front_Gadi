import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../Services/personaService/persona.service';
import { Persona } from '../../Services/personaService/persona';
import { Periodo } from '../periodo/periodo';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional'; 
import { Subscription, catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { DistributivoService } from '../../Services/distributivoService/distributivo.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
})
export class TablaComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'direccion', 'correo', 'edad', 'fecha_vinculacion', 'contrato', 'titulo', 'grado', 'nombre_periodo', 'inicio_periodo', 'fin_periodo'];
  dataSource!: MatTableDataSource<Persona>;
  personas: Persona[] = [];
  periodos: { [key: number]: Periodo } = {};
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};
  color = '#1E90FF';
  currentExplan: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private sidebarSubscription!: Subscription;
  
  constructor(private personaService: PersonaService, private distributivoService: DistributivoService,private authService: AuthService,) { }

  ngOnInit(): void {
    this.personaService.getPersonas().subscribe(data => {
      this.personas = data;
      this.loadAdditionalDataForPersonas();
    });

    this.sidebarSubscription = this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
      this.adjustTable();
    });
  }

  ngAfterViewInit(): void {
    this.adjustTable();
  }

  ngOnDestroy(): void {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }


  loadAdditionalDataForPersonas(): void {
    const requests = this.personas.map(persona =>
      this.distributivoService.getDistributivoByPersonaId(persona.id_persona).pipe(
        switchMap(distributivo => forkJoin([
          this.personaService.getPeriodoById(distributivo?.id_periodo ?? 0).pipe(
            tap(periodo => {
              this.periodos[persona.id_persona] = periodo ?? { id_periodo: 0, nombre_periodo: 'No asignado', inicio_periodo: null, fin_periodo: null };
            }),
            catchError(() => {
              this.periodos[persona.id_persona] = { id_periodo: 0, nombre_periodo: 'No asignado', inicio_periodo: null, fin_periodo: null } as unknown as Periodo;
              return of(null);
            })
          ),
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  adjustTable(): void {
    if (this.dataSource && this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Trigger a resize event to adjust table columns
      window.dispatchEvent(new Event('resize'));
    }
  }
}