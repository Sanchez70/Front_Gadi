import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../Services/personaService/persona.service';
import { Persona } from '../../Services/personaService/persona';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-Modal-persona',
    templateUrl: './persona-modal.component.html',
    styleUrl: './persona-modal.component.css',
})
export class PersonaModalComponent implements OnInit {
    displayedColumns: string[] = ['accion','cedula', 'nombre', 'apellido', 'telefono', 'direccion', 'correo', 'edad', 'fecha_vinculacion', 'contrato', 'grado'];
    dataSource!: MatTableDataSource<Persona>;

    personas: Persona[] = [];

    grados: { [key: number]: GradoOcupacional } = {};
    titulos: { [key: number]: TituloProfecional } = {};
    contratos: { [key: number]: TipoContrato } = {};
    color = '#1E90FF';
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @Output() personaSeleccionada = new EventEmitter<string>();

    constructor(private personaService: PersonaService) { }

    ngOnInit(): void {
        this.personaService.getPersonas().subscribe(data => {
            this.personas = data;
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

    seleccionarPersona(persona: Persona) {
        this.personaSeleccionada.emit(persona.cedula);
    }
}