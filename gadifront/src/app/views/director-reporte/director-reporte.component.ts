import { Component, ViewChild } from '@angular/core';
import { PersonaService } from '../../Services/personaService/persona.service';
import { MatTableDataSource } from '@angular/material/table';
import { Persona } from '../../Services/docenteService/persona';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import {  Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { DistributivoService } from '../../Services/distributivoService/distributivo.service';
import { PeriodoService } from '../../Services/periodoService/periodo.service';
import { Periodo } from '../../Services/periodoService/periodo';

@Component({
  selector: 'app-director-reporte',
  templateUrl: './director-reporte.component.html',
  styleUrl: './director-reporte.component.css'
})
export class DirectorReporteComponent {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'correo', 'fecha_vinculacion', 'contrato', 'titulo','detalle'];
  dataSource!: MatTableDataSource<Persona>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    grados: { [key: number]: GradoOcupacional } = {};
    titulos: { [key: number]: TituloProfecional } = {};
    contratos: { [key: number]: TipoContrato } = {};
    color = '#1E90FF';
  personas: Persona[] = [];
  currentExplan: string = '';
  periodos: any[] = [];
   idPeriodo: number = 0;
  public periodoEncontrado: Periodo = new Periodo();
  constructor(private authService: AuthService,private personaService: PersonaService, private roter:Router, private distributivoService:DistributivoService, private periodoService:PeriodoService) { }
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarComboPeriodos();
    this.distributivoService.getDistributivo().subscribe(distributivos => {
        const distributivosPendientes = distributivos.filter(distributivo => distributivo.estado === 'Pendiente');
        const idsPersonasPendiente = new Set(distributivosPendientes.map(distributivo => distributivo.id_persona));
  
        this.personaService.getPersonas().subscribe(data => {
          this.personas = data.filter(persona => idsPersonasPendiente.has(persona.id_persona));
          this.loadAdditionalDataForPersonas();
          
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

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.dataSource.filter = filterValue;

      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

  distributivo(valor: any):void{
    console.log(valor)  
    this.personaService.getPersonas().subscribe(data => {
      const personaEncontrados = data as Persona[];
      const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona===valor );
      if (usuarioEncontrado){
        this.authService.id_persona=usuarioEncontrado.id_persona;
        this.authService.id_periodo=this.idPeriodo;
        this.roter.navigate(['/matriz-propuesta']);
      }
  });
  
  }
}
