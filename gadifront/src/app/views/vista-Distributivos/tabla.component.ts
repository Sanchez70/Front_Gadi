import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../Services/personaService/persona.service';

import { Periodo } from '../periodo/periodo';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional'; 
import { Subscription, catchError, filter, forkJoin, of, switchMap, tap } from 'rxjs';
import { DistributivoService } from '../../Services/distributivoService/distributivo.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../auth.service';
import { Persona } from '../../Services/docenteService/persona';
import { ActivatedRoute, Router } from '@angular/router';
import { Distributivo } from '../../Services/distributivoService/distributivo';
import { PeriodoService } from '../../Services/periodoService/periodo.service';
import { ReportesComponent } from '../reportes/reportes/reportes.component';
interface PersonaConDistributivo {
  persona: Persona;
  distributivo: Distributivo;
  periodo?: Periodo;
  grado?: GradoOcupacional; 
  contrato?: TipoContrato;
}

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
  providers:[ReportesComponent]
})
export class TablaComponent implements OnInit {
  displayedColumns: string[] = ['descargar','cedula', 'nombre', 'apellido', 'telefono', 'direccion', 'correo', 'edad', 'fecha_vinculacion', 'contrato', 'grado', 'nombre_periodo', 'inicio_periodo', 'fin_periodo'];
  dataSource!: MatTableDataSource<PersonaConDistributivo>;
  personas: Persona[] = [];
  periodos: { [key: number]: Periodo } = {};
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};
  color = '#1E90FF';
  periodosTotales: any[] = [];
  personaBuscar: Persona = new Persona();
  periodoSeleccionado: number = 0;
  idPeriodo: number = 0;
  currentExplan: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private sidebarSubscription!: Subscription;
  personaEncontrada: Persona = new Persona();
  
  constructor(private report: ReportesComponent,private personaService: PersonaService, private distributivoService: DistributivoService,private periodoService: PeriodoService,private authService: AuthService, private activatedRoute: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.cargarComboPeriodos();
    this.personaService.getPersonas().subscribe(data => {
      const personaEncontrados = data as Persona[];
      const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === this.authService.id_persona);
      if (usuarioEncontrado) {
        this.buscarDistributivos(usuarioEncontrado)
      }
    });

    this.sidebarSubscription = this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
      this.adjustTable();
    });
  }

  cargarComboPeriodos(): void {
    this.periodoService.getPeriodo().subscribe(data => {
      this.periodosTotales = data;
    });
  }

  buscarDistributivos(persona: Persona): void{
    this.distributivoService.getDistributivo().subscribe(data => {
      const distributivos = data;
      const distributivoFiltrado = distributivos.filter(
        (distributivo) => (distributivo.id_persona === persona.id_persona)
      );
     
      
      this.loadTableData(persona, distributivoFiltrado)
      
      
    });
  }

  buscarDistributivosbyId(idPeriodo: number): void {
    this.distributivoService.getDistributivo().subscribe(data => {
      const distributivos = data;
      const distributivosFiltrados = distributivos.filter(distributivo =>
        distributivo.id_persona === this.authService.id_persona && distributivo.id_periodo === idPeriodo
      );
  
     
      this.personaService.getPersonaById(this.authService.id_persona).subscribe(persona => {
        this.loadTableData(persona, distributivosFiltrados);
      });
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

  loadTableData(persona: Persona, distributivos: Distributivo[]): void {
    const dataTabla: PersonaConDistributivo[] = [];
  
    distributivos.forEach(distributivo => {
      const personaConDistributivo: PersonaConDistributivo = {
        persona: persona,
        distributivo: distributivo,
        periodo: undefined,
        grado: undefined,
        contrato: undefined
      };
      dataTabla.push(personaConDistributivo);
    });
  
    dataTabla.forEach(item => {
      forkJoin([
        this.personaService.getPeriodoById(item.distributivo.id_periodo),
        this.personaService.getGradoById(item.persona.id_grado_ocp ?? 0),
        this.personaService.getContratoById(item.persona.id_tipo_contrato?? 0)
      ]).subscribe(([periodo, grado, contrato]) => {
        item.periodo = periodo || { id_periodo: 0, nombre_periodo: 'No asignado', inicio_periodo: null, fin_periodo: null };
        item.grado = grado || { id_grado_ocp: 0, nombre_grado_ocp: 'No asignado' };
        item.contrato = contrato || { id_tipo_contrato: 0, nombre_contrato: 'No asignado' };
        this.dataSource = new MatTableDataSource(dataTabla);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
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
      window.dispatchEvent(new Event('resize'));
    }
  }

  onPeriodoChange(event: any): void {
    this.periodoSeleccionado = +event.target.value;
    this.idPeriodo = this.periodoSeleccionado;
    this.buscarDistributivosbyId(this.idPeriodo);
    
  }

  generarModeloPDF(idPeriodo: number): void {
    this.authService.clearLocalStoragePeriodo();
    this.authService.id_periodo = idPeriodo;
    this.authService.saveUserToLocalStorage();
    if (this.authService.id_periodo) {
      setTimeout(()=>{
        this.report.captureAndDownloadPdf();
      },100)

    } else {
      console.warn('No se encontró id_periodo para esta persona.');
    }
  }

  recargarPagina() {
    this.personaService.getPersonas().subscribe(data => {
      const personaEncontrados = data as Persona[];
      const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === this.authService.id_persona);
      if (usuarioEncontrado) {
        this.buscarDistributivos(usuarioEncontrado)
      }
    });
    
  }
}