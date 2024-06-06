import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PersonaService } from '../persona/persona.service';
import { Persona } from '../persona/persona';
import { Periodo } from '../periodo/periodo';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional'; 
import { forkJoin, switchMap, tap } from 'rxjs';
import { DistributivoService } from '../../Services/distributivoService/distributivo.service';

@Component({
  selector: 'app-tabla',
  standalone: true,
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class TablaComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'telefono', 'direccion', 'correo', 'edad', 'fecha_vinculacion', 'contrato', 'titulo', 'grado', 'nombre_periodo', 'inicio_periodo', 'fin_periodo'];
  dataSource!: MatTableDataSource<Persona>;

  personas: Persona[] = [];
  periodos: { [key: number]: Periodo } = {};
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private personaService: PersonaService, private distributivoService: DistributivoService) { }

  ngOnInit(): void {
    this.personaService.getPersonas().subscribe(data => {
      this.personas = data;
      this.loadAdditionalDataForPersonas();
    });
  }

  loadAdditionalDataForPersonas(): void {
    const requests = this.personas.map(persona =>
      this.distributivoService.getDistributivoByPersonaId(persona.id_persona).pipe(
        switchMap(distributivo => forkJoin([
          this.personaService.getPeriodoById(distributivo.id_periodo).pipe(
            tap(periodo => {
              this.periodos[persona.id_persona] = periodo;
            })
          ),
          this.personaService.getGradoById(persona.id_grado_ocp).pipe(
            tap(grado => {
              this.grados[persona.id_persona] = grado;
            })
          ),
          this.personaService.getTituloById(persona.id_titulo_profesional).pipe(
            tap(titulo => {
              this.titulos[persona.id_persona] = titulo;
            })
          ),
          this.personaService.getContratoById(persona.id_tipo_contrato).pipe(
            tap(contrato => {
              this.contratos[persona.id_persona] = contrato;
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
}
