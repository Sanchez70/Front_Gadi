import { Component, ViewChild } from '@angular/core';
import { Persona } from '../../../Services/docenteService/persona';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GradoOcupacional } from '../../grado-ocupacional/grado-ocupacional';
import { TituloProfecional } from '../../titulo-profesional/titulo-profecional';
import { TipoContrato } from '../../tipo-contrato/tipo-contrato';
import { Periodo } from '../../../Services/periodoService/periodo';
import { AuthService } from '../../../auth.service';
import { PersonaService } from '../../../Services/personaService/persona.service';
import { Router } from '@angular/router';
import { DistributivoService } from '../../../Services/distributivoService/distributivo.service';
import { PeriodoService } from '../../../Services/periodoService/periodo.service';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { ReportesComponent } from '../../reportes/reportes/reportes.component';
import { Distributivo } from '../../../Services/distributivoService/distributivo';
import Swal from 'sweetalert2';

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
  selector: 'app-distributivos-generados',
  templateUrl: './distributivos-generados.component.html',
  styleUrl: './distributivos-generados.component.css',
  providers: [ReportesComponent]
})


export class DistributivosGeneradosComponent {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'correo', 'fecha_vinculacion', 'contrato', 'detalle','editar'];
  dataSource!: MatTableDataSource<Persona>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};
  color = '#1E90FF';
  personas: Persona[] = [];
  distributivo: Distributivo = new Distributivo();
  currentExplan: string = '';
  periodos: any[] = [];
  idPeriodo: number = 0;
  public periodoEncontrado: Periodo = new Periodo();
  constructor(private authService: AuthService, private personaService: PersonaService, private roter: Router, private distributivoService: DistributivoService, private periodoService: PeriodoService, private report: ReportesComponent, private router: Router) { }
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarComboPeriodos();
    setTimeout(()=>{
      this.distributivoService.getDistributivo().subscribe(distributivos => {
        const distributivosPendientes = distributivos.filter(distributivo => distributivo.estado === 'Aceptado' && distributivo.id_periodo === this.idPeriodo);
        const idsPersonasPendiente = new Set(distributivosPendientes.map(distributivo => distributivo.id_persona));
  
        this.personaService.getPersonas().subscribe(data => {
          this.personas = data.filter(persona => idsPersonasPendiente.has(persona.id_persona));
          this.loadAdditionalDataForPersonas();
  
        })
      });
    },100);
  
  }

  cargarComboPeriodos(): void {
    this.periodoService.getPeriodo().subscribe(data => {
      this.periodos = data;
      this.periodoEncontrado = this.periodos.find(
        (periodo) => (periodo.estado === 'Activo')
      );
      this.idPeriodo = this.periodoEncontrado.id_periodo
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

  generarModeloPDF(valor: any): void {
    this.personaService.getPersonas().subscribe(data => {
      const personaEncontrados = data as Persona[];
      const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === valor);
      if (usuarioEncontrado) {
        this.authService.id_persona = usuarioEncontrado.id_persona;
        this.authService.id_periodo = this.idPeriodo;
        if (this.authService.id_periodo) {
          this.report.captureAndDownloadPdf();
        } else {
          console.warn('No se encontró id_periodo para esta persona.');
        }
      }
    });

  }

  cambiarEstadoDistributivo(personaId:number):void{
    Swal.fire({
      title: '¿Deseas editar el presente distributivo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      this.distributivoService.getDistributivo().subscribe(data =>{
        const distributivoEncontrados = data as Distributivo[];
        const distributivoFinal = distributivoEncontrados.find(distributivo => distributivo.estado === 'Aceptado' && distributivo.id_periodo === this.idPeriodo && distributivo.id_persona === personaId);
        this.distributivoService.getDistributivobyId(distributivoFinal?.id_distributivo).subscribe(response =>{
          this.distributivo = response;
          this.distributivo.estado = 'Pendiente';
          this.distributivoService.updateDistributivo(this.distributivo).subscribe(res =>{
            Toast.fire({
              icon: "success",
              title: "Distributivo actualizado correctamente",
            });
            this.router.navigate(['/coordinador']);
          })
        })
      })
    });
  }



}
