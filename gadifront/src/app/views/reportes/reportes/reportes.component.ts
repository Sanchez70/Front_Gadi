import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { AsignaturaService } from '../../../Services/asignaturaService/asignatura.service';
import { PersonaService } from '../../../Services/personaService/persona.service';
import { CicloService } from '../../../Services/cicloService/ciclo.service';
import { CarreraService } from '../../../Services/carreraService/carrera.service';
import { JornadaService } from '../../../Services/jornadaService/jornada.service';
import { DistributivoAsignaturaService } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { DistributivoService } from '../../../Services/distributivoService/distributivo.service';
import { DistributivoActividadService } from '../../../Services/distributivoActividadService/distributivo_actividad.service';
import { ActividadService } from '../../../Services/actividadService/actividad.service';
import { TipoContratoService } from '../../../Services/tipo_contrato/tipo-contrato.service';
import { TituloProfesionalService } from '../../../Services/titulo/titulo-profesional.service';
import { GradoOcupacionalService } from '../../../Services/grado/grado-ocupacional.service';
import { tipo_actividadService } from '../../../Services/tipo_actividadService/tipo_actividad.service';
import { PeriodoService } from '../../../Services/periodoService/periodo.service';
import { AuthService } from '../../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Persona } from '../../../Services/docenteService/persona';
import { Asignatura } from '../../../Services/asignaturaService/asignatura';
import { DistributivoAsignatura } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura';
import { Actividad } from '../../../Services/actividadService/actividad';
import { DistributivoActividad } from '../../../Services/distributivoActividadService/distributivo_actividad';
import { GradoOcupacional } from '../../grado-ocupacional/grado-ocupacional';
import { TituloProfecional } from '../../titulo-profesional/titulo-profecional';
import { TipoContrato } from '../../tipo-contrato/tipo-contrato';
import { Periodo } from '../../../Services/periodoService/periodo';
import { Jornada } from '../../../Services/jornadaService/jornada';
import { Carrera } from '../../../Services/carreraService/carrera';
import { tipo_actividad } from '../../../Services/tipo_actividadService/tipo_actividad';
import { Ciclo } from '../../../Services/cicloService/ciclo';
import { Distributivo } from '../../../Services/distributivoService/distributivo';
import { Titulo_profesional } from '../../../Services/titulo/titulo_profesional';
import { RectorService } from '../../../Services/rectorService/rector.service';
import { Rector } from '../../../Services/rectorService/rector';
import JSZip from 'jszip';

export interface PersonaTitulo extends Persona {
  titulos: TituloProfecional[];
}
interface AsignaturaConDistributivo {
  distributivoAsignatura: DistributivoAsignatura;
  asignaturas: Asignatura;
  carreras?: Carrera;
}
interface ActividadConDistributivo {
  distributivoActividad: DistributivoActividad;
  actividad: Actividad;
  tipoActividad?: tipo_actividad;
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  displayedColumns: string[] = ["ACTIVIDAD", "HORAS"];
  displayedColumnsAsig: string[] = ["CARRERA", "CURSO", "ASIGNATURA", "HORAS"];
  displayedColumnsTitulo: string[] = ["DOCENTE", "TITULOS"];
  dataSource = new MatTableDataSource<any>;
  dataSourceAsig = new MatTableDataSource<any>;
  dataSourceTitulos = new MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  grados: { [key: number]: GradoOcupacional } = {};
  titulos: { [key: number]: TituloProfecional } = {};
  contratos: { [key: number]: TipoContrato } = {};
  periodosDis: { [key: number]: Periodo } = {};
  jornada: { [key: number]: Jornada } = {};
  distributivoAsignatura: { [key: number]: DistributivoAsignatura } = {};
  carreras: { [key: number]: Carrera } = {};
  tipo_actividad: { [key: number]: tipo_actividad } = {};
  ciclos: { [key: number]: Ciclo } = {};
  nomreRector: any;
  fechaDistributivo: string = '';
  currentExplan: string = '';
  personaEncontrada: Persona = new Persona();
  personas: Persona[] = [];
  generar: any;
  distributivos: Distributivo[] = [];
  actividades: Actividad[] = [];
  distributivoFiltrado: any[] = [];
  periodos: any[] = [];
  distributivoAsignaturas: DistributivoAsignatura[] = [];
  distributivoActividades: DistributivoActividad[] = [];
  distributivoActividadesFiltrado: DistributivoActividad[] = [];
  actividadesFiltradas: any[] = [];
  asignaturas: Asignatura[] = [];
  titulosCargados: any[] = [];
  titulosFiltrado: any[] = [];
  periodo: Periodo = new Periodo();
  tipos: tipo_actividad[] = [];
  idPeriodo: number = this.authService.id_periodo;
  periodoName: string = '';
  horasTotales: number = 0;
  horasTotalesActividad: number = 0;
  horasPorDocente: number = 0;

  constructor(
    private asignaturaService: AsignaturaService,
    private personaService: PersonaService,
    private cicloService: CicloService,
    private carreraService: CarreraService,
    private jornadaService: JornadaService,
    private distributivoAsignaturaService: DistributivoAsignaturaService,
    private distributivoService: DistributivoService,
    private distributivoActividadService: DistributivoActividadService,
    private actividadService: ActividadService,
    private tipo_contratoService: TipoContratoService,
    private tituloService: TituloProfesionalService,
    private gradoService: GradoOcupacionalService,
    private tipo_actividadService: tipo_actividadService,
    private periodoService: PeriodoService,
    private authService: AuthService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute,
    private rector: RectorService
  ) { }


  ngOnInit(): void {
  }

  cargarPeriodo(): void {
    this.periodoService.getPeriodobyId(this.authService.id_periodo).subscribe(data => {
      this.periodo = data;
      this.periodoName = this.periodo.nombre_periodo;
    });
  }

  cargarTitulos(personaEncontrada: Persona): void {
    // Llama al servicio para obtener todos los títulos


    this.tituloService.getTitulo().subscribe(respuest => {
      const titulos = respuest as Titulo_profesional[];
      const filTitllo = titulos.filter(titulo => titulo.id_persona === personaEncontrada.id_persona);
      console.log('titulos', filTitllo)
      const dataArray: any[] = [];
      filTitllo.forEach(final => {
        dataArray.push({
          TITULOS: final.nombre_titulo || 'N/A',
          DOCENTE: personaEncontrada.nombre1 + ' ' + personaEncontrada.nombre2 + ' ' + personaEncontrada.apellido1 + ' ' + personaEncontrada.apellido2 || 'N/A',
        });
        // Después de procesar todas las actividades, asignar el array acumulado a dataSource
        this.dataSourceTitulos = new MatTableDataSource<any>(dataArray);
        this.dataSourceTitulos.paginator = this.paginator;
        this.dataSourceTitulos.sort = this.sort;

      });

    });


  }



  buscarDistributivo(idPersona: number): void {
    //idPersona = this.authService.id_persona;
    this.distributivoService.getDistributivo().subscribe(data => {
      this.distributivos = data;
      this.distributivoFiltrado = this.distributivos.filter(
        (distributivo) => (distributivo.id_persona === idPersona && distributivo.id_periodo === this.idPeriodo && distributivo.estado === 'Aceptado'
        )
      );
      console.log('distributivos filtrados', this.distributivoFiltrado)

      this.distributivoFiltrado.forEach(distributivo => {

        this.buscarAsignatura(distributivo.id_distributivo);
        this.cargarDistributivo(distributivo.id_distributivo);

        setTimeout(() => {
          this.calcularHorasTotalesPorDocente(this.horasTotales, this.horasTotalesActividad);
        }, 100);
      });
    });
  }
  calcularHorasTotalesPorDocente(horasAsignatura: number, horasActividades: number): void {
    this.horasPorDocente = horasAsignatura + horasActividades;
  }
  buscarAsignatura(idDistributivo: number): void {
    this.horasTotales = 0;



    // Obtener distributivos de asignatura
    this.distributivoAsignaturaService.getDistributivoAsignatura().subscribe(distributivos => {
      this.distributivoAsignaturas = distributivos;

      // Filtrar distributivos por idDistributivo
      const asignaturasFiltradas = this.distributivoAsignaturas.filter(
        materiaAs => materiaAs.id_distributivo === idDistributivo
      );

      // Contador para manejar las suscripciones secuenciales
      let count = 0;
      const dataArray: any[] = [];
      // Iterar sobre cada asignatura filtrada
      asignaturasFiltradas.forEach(distAsig => {
        // Obtener la asignatura correspondiente
        this.asignaturaService.getAsignaturabyId(distAsig.id_asignatura).subscribe(asignatura => {
          const resultFinal = asignatura as Asignatura;
         
          // Calcular las horas totales
          this.calcularHorasTotales(resultFinal.horas_semanales);

          // Obtener la carrera correspondiente
          this.carreraService.getCarreraById(resultFinal.id_carrera).subscribe(carrera => {
            const final = carrera as Carrera;

            // Agregar datos al arreglo
            dataArray.push({
              CARRERA: final.nombre_carrera || 'N/A',
              CURSO: distAsig.acronimo || 'N/A',
              ASIGNATURA: resultFinal.nombre_asignatura || 'N/A',
              HORAS: resultFinal.horas_semanales || 'N/A',
            });

            // Incrementar el contador
            count++;

            // Si hemos procesado todas las asignaturas filtradas, actualizar el dataSourceAsig

            // Asignar el nuevo dataSourceAsig después de procesar todos los datos
            this.dataSourceAsig = new MatTableDataSource<any>(dataArray);
            this.dataSourceAsig.paginator = this.paginator;
            this.dataSourceAsig.sort = this.sort;

          });
        });
      });
    });
  }

  calcularHorasTotales(horas_semanales: number): void {
    this.horasTotales += horas_semanales;
  }

  calcularHorasTotalesActividad(horas_semanales: number): void {
    this.horasTotalesActividad += horas_semanales;
  }

  formatearFecha(fecha: Date): string {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
  }




  captureAndDownloadPdf() {
    const fechaActual = new Date();
   
    this.fechaDistributivo = this.formatearFecha(fechaActual);

    this.personaService.getPersonas().subscribe(data => {
      const personaEncontrados = data as Persona[];
      const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === this.authService.id_persona);

      if (usuarioEncontrado) {
        this.personaEncontrada = usuarioEncontrado;
        this.personas.push(this.personaEncontrada);
        this.cargarPeriodo();
        this.cargarTitulos(usuarioEncontrado);
        this.buscarDistributivo(usuarioEncontrado.id_persona);
        this.cargarRector();
        this.formatearFecha(new Date);
        setTimeout(() => {

          const doc = new jsPDF();
          let yPos = 5;
          const xPos = 20;
          const cellWidth = 45;
          const cellHeight = 9;

          const columnWidths = [135, 45]; // Ajusta los anchos según tus necesidades
          const columnWidthsAsig = [110, 15, 40, 15];
          const columnWidthsTitulo = [75, 105];
          const imgUrl = 'assets/img/logo.png';
          doc.addImage(imgUrl, 'PNG', xPos + 55, yPos, 75, 13);
          yPos += 27;
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
          doc.setFont('helvetica', 'normal');
          doc.text(`Docente`, xPos, yPos);
          doc.text(`${this.fechaDistributivo}`, xPos + 155, yPos);
          yPos += 6;
          doc.text(`${usuarioEncontrado.nombre1} ${usuarioEncontrado.apellido1}`, xPos, yPos);
          yPos += 6;
          doc.text(`A continuación se detalla su asignación de horas docentes y de gestión para el periodo académico`, xPos, yPos);
          yPos += 10;

          let currentXPosTitulo = xPos;

          this.displayedColumnsTitulo.forEach((header, index) => {
            if (index === 0) {
              doc.setFontSize(12);
              doc.setTextColor(255, 255, 255);  // Texto blanco
              doc.setFillColor(0, 102, 204);    // Fondo azul
              const cellWidth = 180;
              doc.rect(currentXPosTitulo, yPos, cellWidth, cellHeight, 'F');
              const textWidth = doc.getTextWidth(header);
              const textX = currentXPosTitulo + (cellWidth - textWidth) / 2;
              doc.text(header, textX, yPos + 7);
              currentXPosTitulo += cellWidth;
            }
          });

          yPos += cellHeight;

          // Dibujar datos de la tabla
          doc.setTextColor(0, 0, 0);  // Texto negro
          doc.setFontSize(8);
          // Dibujar la primera columna combinada
          const totalHeight = this.dataSourceTitulos.data.length * cellHeight;
          doc.setFillColor(240, 240, 240);  // Fondo gris claro para la celda combinada
          doc.rect(xPos, yPos, columnWidthsTitulo[0], totalHeight, 'D');

          // Texto centrado verticalmente en la celda combinada
          const textWidthTitulo = doc.getTextWidth(this.dataSourceTitulos.data[0][this.displayedColumnsTitulo[0]].toString());
          const textXTitulo = xPos + (columnWidthsTitulo[0] - textWidthTitulo) / 2;
          const textYTitulo = yPos + (totalHeight - cellHeight) / 2 + 7; // Ajuste vertical
          doc.text(this.dataSourceTitulos.data[0][this.displayedColumnsTitulo[0]].toString(), textXTitulo, textYTitulo);

          // Dibujar las celdas individuales de la segunda columna
          let currentYPosTitulo = yPos;

          this.dataSourceTitulos.data.forEach(row => {
            const currentXPosRowTitulo = xPos + columnWidthsTitulo[0]; // La posición X de la segunda columna
            const cellWidthTitulo = columnWidthsTitulo[1];
            doc.setFillColor(240, 240, 240);  // Fondo gris claro para las celdas
            doc.rect(currentXPosRowTitulo, currentYPosTitulo, cellWidthTitulo, cellHeight, 'D');
            if (row[this.displayedColumnsTitulo[1]] !== undefined) {
              const textWidth = doc.getTextWidth(row[this.displayedColumnsTitulo[1]].toString());
              const textXTitulo = currentXPosRowTitulo + (cellWidthTitulo - textWidth) / 2;
              doc.text(row[this.displayedColumnsTitulo[1]].toString(), textXTitulo, currentYPosTitulo + 7);
            }
            currentYPosTitulo += cellHeight;
            yPos += cellHeight;
          });
          yPos += 5;

          let currentXPosAsig = xPos;

          // Dibujar encabezados de la tabla
          this.displayedColumnsAsig.forEach((header, index) => {
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);  // Texto blanco
            doc.setFillColor(0, 102, 204);    // Fondo azul
            const cellWidth = columnWidthsAsig[index];
            doc.rect(currentXPosAsig, yPos, cellWidth, cellHeight, 'F');
            const textWidth = doc.getTextWidth(header);
            const textX = currentXPosAsig + (cellWidth - textWidth) / 2;
            doc.text(header, textX, yPos + 7);
            currentXPosAsig += cellWidth;
          });

          yPos += cellHeight;

          // Dibujar datos de la tabla
          doc.setTextColor(0, 0, 0);  // Texto negro
          this.dataSourceAsig.data.forEach(row => {
            currentXPosAsig = xPos;
            this.displayedColumnsAsig.forEach((column, index) => {
              const cellWidth = columnWidthsAsig[index];
              doc.setFillColor(240, 240, 240);  // Fondo gris claro para las celdas
              doc.rect(currentXPosAsig, yPos, cellWidth, cellHeight, 'D');
              if (row[column] !== undefined) {
                const textWidth = doc.getTextWidth(row[column].toString());
                const textX = currentXPosAsig + (cellWidth - textWidth) / 2;
                doc.text(row[column].toString(), textX, yPos + 7);
              }
              currentXPosAsig += cellWidth;
            });
            yPos += cellHeight;
          });

          // Primer cuadro para "total" (combinando 3 celdas)
          const totalCellWidth = columnWidthsAsig.slice(0, 3).reduce((acc, val) => acc + val, 0);
          const textWidthTotalAsig = doc.getTextWidth('TOTAL');
          const textXTotalAsig = xPos + totalCellWidth - textWidthTotalAsig - 5; // 5 es el margen de la derecha
          doc.setFillColor(255, 255, 255);  // Fondo blanco para la nueva fila
          doc.rect(xPos, yPos, totalCellWidth, cellHeight, 'D');
          doc.text('TOTAL', textXTotalAsig, yPos + 7);

          // Segunda celda para mostrar las horas totales
          const lastCellWidth = columnWidthsAsig[3];
          const textWidthAsig = doc.getTextWidth(`${this.horasTotales}`);
          const textXAsig = xPos + totalCellWidth + (lastCellWidth - textWidthAsig) / 2;
          doc.rect(xPos + totalCellWidth, yPos, lastCellWidth, cellHeight, 'D');
          doc.setFontSize(8);
          doc.setTextColor(60, 60, 60);
          doc.text(`${this.horasTotales}`, textXAsig, yPos + 7);
          yPos += 15;

          // Dibujar los encabezados de la tabla Actividades
          let currentXPos = xPos;
          this.displayedColumns.forEach((header, index) => {
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);  // Texto blanco
            doc.setFillColor(0, 102, 204);    // Fondo azul
            const cellWidth = columnWidths[index];
            doc.rect(currentXPos, yPos, cellWidth, cellHeight, 'F');
            const textWidth = doc.getTextWidth(header);
            const textX = currentXPos + (cellWidth - textWidth) / 2;
            doc.text(header, textX, yPos + 7);
            currentXPos += cellWidth;
          });

          yPos += cellHeight;

          // Dibujar datos de la tabla
          doc.setTextColor(0, 0, 0);  // Texto negro
          this.dataSource.data.forEach(row => {
            currentXPos = xPos;
            this.displayedColumns.forEach((column, index) => {
              const cellWidth = columnWidths[index];
              doc.setFillColor(240, 240, 240);  // Fondo gris claro para las celdas
              doc.rect(currentXPos, yPos, cellWidth, cellHeight, 'D');
              if (row[column] !== undefined) {
                const textWidth = doc.getTextWidth(row[column].toString());
                const textX = currentXPos + (cellWidth - textWidth) / 2;
                doc.text(row[column].toString(), textX, yPos + 7);
              }
              currentXPos += cellWidth;
            });
            yPos += cellHeight;
          });



          const textWidthTotal = doc.getTextWidth('TOTAL');
          const textXTotal = xPos + cellWidth * 3 - textWidthTotal - 5; // 5 es el margen de la derecha

          // Primer cuadro para "total" (combinando 3 celdas)
          doc.setFillColor(255, 255, 255);  // Fondo blanco para la nueva fila
          doc.rect(xPos, yPos, cellWidth * 3, cellHeight, 'D');
          doc.text('TOTAL', textXTotal, yPos + 7);

          const textWidth = doc.getTextWidth(`${this.horasTotalesActividad}`);
          const textX = xPos + cellWidth * 3 + (cellWidth - textWidth) / 2;
          doc.rect(xPos + cellWidth * 3, yPos, cellWidth, cellHeight, 'D');
          doc.setFontSize(8);
          doc.setTextColor(60, 60, 60);
          doc.text(`${this.horasTotalesActividad}`, textX, yPos + 7);
          yPos += cellHeight;
          yPos += cellHeight;
          doc.setFontSize(8);
          doc.setTextColor(60, 60, 60);
          doc.setFont('helvetica', 'bold');
          yPos += 6;
          const pageWidthHora = doc.internal.pageSize.getWidth();
          const textHoras = `HORAS TOTALES DEL DOCENTE: ${this.horasPorDocente}`;
          const textWidthHora = doc.getTextWidth(textHoras);
          const textXHora = (pageWidthHora - textWidthHora) / 2;
          doc.setFont('helvetica', 'bold');
          doc.text(textHoras, textXHora, yPos);
          yPos += 6;
          doc.setFont('helvetica', 'normal');
          doc.text(`Agredecidos con su aporte a la institucion, suscribimos de usted`, xPos, yPos);
          yPos += 6;
          doc.text(`Atentamente`, xPos, yPos);
          yPos += 6;
          yPos += cellHeight;
          yPos += cellHeight;
          yPos += cellHeight;
          const pageWidth = doc.internal.pageSize.getWidth();
          const text = `Mgtr.${this.nomreRector}`;
          const textWidthRec = doc.getTextWidth(text);
          const textXRec = (pageWidth - textWidthRec) / 2;
          doc.setFont('helvetica', 'bold');
          doc.text(text, textXRec, yPos);
          yPos += 6;
          const pageWidthfinal = doc.internal.pageSize.getWidth();
          const textFinal = `Rector`;
          const textWidthRecFinal = doc.getTextWidth(textFinal);
          const textXRecFinal = (pageWidthfinal - textWidthRecFinal) / 2;
          doc.setFont('helvetica', 'bold');
          doc.text(textFinal, textXRecFinal, yPos);
          // Guardar el documento PDF
          doc.save('reporte.pdf');
        }, 500);
      }
    });
  }

  cargarDistributivo(id: any): void {
   
    this.horasTotalesActividad = 0;
    this.distributivoActividadService.getDistributivoActividad().subscribe(data => {
      const distributivoActividad = data as DistributivoActividad[];
      const resultaAct = distributivoActividad.filter(resultado => resultado.id_distributivo === id);

      // Array para acumular los resultados
      const dataArray: any[] = [];
      resultaAct.forEach(actividadEncontrada => {
        this.actividadService.getActividad().subscribe(dataAct => {
          const actividades = dataAct as Actividad[];
          const ActividadFiltrada = actividades.filter(actividad => actividad.id_actividad === actividadEncontrada.id_actividad);
          this.calcularHorasTotalesActividad(actividadEncontrada.hora_no_docente);
          ActividadFiltrada.forEach(combiAct => {
            dataArray.push({
              ACTIVIDAD: combiAct.descripcion_actividad || 'n/a',
              HORAS: actividadEncontrada.hora_no_docente || 'n/a'
            });
          });

          // Después de procesar todas las actividades, asignar el array acumulado a dataSource
          this.dataSource = new MatTableDataSource<any>(dataArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

      });
    });
  }


  cargarRector(): void {
    this.rector.getRector().subscribe(respuesta => {
      respuesta.forEach(restores => {
        this.personaService.getPersonaById(restores.id_persona).forEach(persona => {
          this.nomreRector = persona.nombre1 + ' ' + persona.nombre2 + ' ' + persona.apellido1 + ' ' + persona.apellido2;
        });
      });

    });

  }



  prepararPersonasParaDescarga(id_persona: any): Promise<Blob> {

    return new Promise((resolve, reject) => {

      const fechaActual = new Date();
      this.cargarPeriodo();
      this.fechaDistributivo = this.formatearFecha(fechaActual);

      this.personaService.getPersonas().subscribe(data => {
        const personaEncontrados = data as Persona[];
        const usuarioEncontrado = personaEncontrados.find(persona => persona.id_persona === id_persona);

        if (usuarioEncontrado) {
          this.personaEncontrada = usuarioEncontrado;
          this.descargartitutulos(id_persona);
          this.buscarDistributivo(id_persona);
          this.cargarRector();
          this.formatearFecha(new Date());
          const doc = new jsPDF();
          setTimeout(() => {

            let yPos = 5;
            const xPos = 20;
            const cellWidth = 45;
            const cellHeight = 9;

            const columnWidths = [135, 45];
            const columnWidthsAsig = [110, 15, 40, 15];
            const columnWidthsTitulo = [75, 105];
            const imgUrl = 'assets/img/logo.png';
            doc.addImage(imgUrl, 'PNG', xPos + 55, yPos, 75, 13);
            yPos += 27;
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(`Docente`, xPos, yPos);
            doc.text(`${this.fechaDistributivo}`, xPos + 155, yPos);
            yPos += 6;
            doc.text(`${usuarioEncontrado.nombre1} ${usuarioEncontrado.apellido1}`, xPos, yPos);
            yPos += 6;
            doc.text(`A continuación se detalla su asignación de horas docentes y de gestión para el periodo académico`, xPos, yPos);
            yPos += 10;

            let currentXPosTitulo = xPos;

            this.displayedColumnsTitulo.forEach((header, index) => {
              if (index === 0) {
                doc.setFontSize(12);
                doc.setTextColor(255, 255, 255);
                doc.setFillColor(0, 102, 204);
                const cellWidth = 180;
                doc.rect(currentXPosTitulo, yPos, cellWidth, cellHeight, 'F');
                const textWidth = doc.getTextWidth(header);
                const textX = currentXPosTitulo + (cellWidth - textWidth) / 2;
                doc.text(header, textX, yPos + 7);
                currentXPosTitulo += cellWidth;
              }
            });

            yPos += cellHeight;

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);

            const totalHeight = this.dataSourceTitulos.data.length * cellHeight;
            doc.setFillColor(240, 240, 240);
            doc.rect(xPos, yPos, columnWidthsTitulo[0], totalHeight, 'D');

            const textWidthTitulo = doc.getTextWidth(this.dataSourceTitulos.data[0][this.displayedColumnsTitulo[0]].toString());
            const textXTitulo = xPos + (columnWidthsTitulo[0] - textWidthTitulo) / 2;
            const textYTitulo = yPos + (totalHeight - cellHeight) / 2 + 7;
            doc.text(this.dataSourceTitulos.data[0][this.displayedColumnsTitulo[0]].toString(), textXTitulo, textYTitulo);

            let currentYPosTitulo = yPos;

            this.dataSourceTitulos.data.forEach(row => {
              const currentXPosRowTitulo = xPos + columnWidthsTitulo[0];
              const cellWidthTitulo = columnWidthsTitulo[1];
              doc.setFillColor(240, 240, 240);
              doc.rect(currentXPosRowTitulo, currentYPosTitulo, cellWidthTitulo, cellHeight, 'D');
              if (row[this.displayedColumnsTitulo[1]] !== undefined) {
                const textWidth = doc.getTextWidth(row[this.displayedColumnsTitulo[1]].toString());
                const textXTitulo = currentXPosRowTitulo + (cellWidthTitulo - textWidth) / 2;
                doc.text(row[this.displayedColumnsTitulo[1]].toString(), textXTitulo, currentYPosTitulo + 7);
              }
              currentYPosTitulo += cellHeight;
              yPos += cellHeight;
            });
            yPos += 5;

            let currentXPosAsig = xPos;

            this.displayedColumnsAsig.forEach((header, index) => {
              doc.setFontSize(8);
              doc.setTextColor(255, 255, 255);
              doc.setFillColor(0, 102, 204);
              const cellWidth = columnWidthsAsig[index];
              doc.rect(currentXPosAsig, yPos, cellWidth, cellHeight, 'F');
              const textWidth = doc.getTextWidth(header);
              const textX = currentXPosAsig + (cellWidth - textWidth) / 2;
              doc.text(header, textX, yPos + 7);
              currentXPosAsig += cellWidth;
            });

            yPos += cellHeight;

            doc.setTextColor(0, 0, 0);
            this.dataSourceAsig.data.forEach(row => {
              currentXPosAsig = xPos;
              this.displayedColumnsAsig.forEach((column, index) => {
                const cellWidth = columnWidthsAsig[index];
                doc.setFillColor(240, 240, 240);
                doc.rect(currentXPosAsig, yPos, cellWidth, cellHeight, 'D');
                if (row[column] !== undefined) {
                  const textWidth = doc.getTextWidth(row[column].toString());
                  const textX = currentXPosAsig + (cellWidth - textWidth) / 2;
                  doc.text(row[column].toString(), textX, yPos + 7);
                }
                currentXPosAsig += cellWidth;
              });
              yPos += cellHeight;
            });

            const totalCellWidth = columnWidthsAsig.slice(0, 3).reduce((acc, val) => acc + val, 0);
            const textWidthTotalAsig = doc.getTextWidth('TOTAL');
            const textXTotalAsig = xPos + totalCellWidth - textWidthTotalAsig - 5;
            doc.setFillColor(255, 255, 255);
            doc.rect(xPos, yPos, totalCellWidth, cellHeight, 'D');
            doc.text('TOTAL', textXTotalAsig, yPos + 7);

            const lastCellWidth = columnWidthsAsig[3];
            const textWidthAsig = doc.getTextWidth(`${this.horasTotales}`);
            const textXAsig = xPos + totalCellWidth + (lastCellWidth - textWidthAsig) / 2;
            doc.rect(xPos + totalCellWidth, yPos, lastCellWidth, cellHeight, 'D');
            doc.setFontSize(8);
            doc.setTextColor(60, 60, 60);
            doc.text(`${this.horasTotales}`, textXAsig, yPos + 7);
            yPos += 15;

            let currentXPos = xPos;
            this.displayedColumns.forEach((header, index) => {
              doc.setFontSize(8);
              doc.setTextColor(255, 255, 255);
              doc.setFillColor(0, 102, 204);
              const cellWidth = columnWidths[index];
              doc.rect(currentXPos, yPos, cellWidth, cellHeight, 'F');
              const textWidth = doc.getTextWidth(header);
              const textX = currentXPos + (cellWidth - textWidth) / 2;
              doc.text(header, textX, yPos + 7);
              currentXPos += cellWidth;
            });

            yPos += cellHeight;

            doc.setTextColor(0, 0, 0);
            this.dataSource.data.forEach(row => {
              currentXPos = xPos;
              this.displayedColumns.forEach((column, index) => {
                const cellWidth = columnWidths[index];
                doc.setFillColor(240, 240, 240);
                doc.rect(currentXPos, yPos, cellWidth, cellHeight, 'D');
                if (row[column] !== undefined) {
                  const textWidth = doc.getTextWidth(row[column].toString());
                  const textX = currentXPos + (cellWidth - textWidth) / 2;
                  doc.text(row[column].toString(), textX, yPos + 7);
                }
                currentXPos += cellWidth;
              });
              yPos += cellHeight;
            });

            const textWidthTotal = doc.getTextWidth('TOTAL');
            const textXTotal = xPos + cellWidth * 3 - textWidthTotal - 5;
            doc.setFillColor(255, 255, 255);
            doc.rect(xPos, yPos, cellWidth * 3, cellHeight, 'D');
            doc.text('TOTAL', textXTotal, yPos + 7);

            const textWidth = doc.getTextWidth(`${this.horasTotalesActividad}`);
            const textX = xPos + cellWidth * 3 + (cellWidth - textWidth) / 2;
            doc.rect(xPos + cellWidth * 3, yPos, cellWidth, cellHeight, 'D');
            doc.setFontSize(8);
            doc.setTextColor(60, 60, 60);
            doc.text(`${this.horasTotalesActividad}`, textX, yPos + 7);
            yPos += cellHeight;
            yPos += cellHeight;
            doc.setFontSize(8);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'bold');
            yPos += 6;
            const pageWidthHora = doc.internal.pageSize.getWidth();
            const textHoras = `HORAS TOTALES DEL DOCENTE: ${this.horasPorDocente}`;
            const textWidthHora = doc.getTextWidth(textHoras);
            const textXHora = (pageWidthHora - textWidthHora) / 2;
            doc.setFont('helvetica', 'bold');
            doc.text(textHoras, textXHora, yPos);
            yPos += 6;
            doc.setFont('helvetica', 'normal');
            doc.text(`Agredecidos con su aporte a la institucion, suscribimos de usted`, xPos, yPos);
            yPos += 6;
            doc.text(`Atentamente`, xPos, yPos);
            yPos += 6;
            yPos += cellHeight;
            yPos += cellHeight;
            yPos += cellHeight;
            const pageWidth = doc.internal.pageSize.getWidth();
            const text = `Mgtr.${this.nomreRector}`;
            const textWidthRec = doc.getTextWidth(text);
            const textXRec = (pageWidth - textWidthRec) / 2;
            doc.setFont('helvetica', 'bold');
            doc.text(text, textXRec, yPos);
            yPos += 6;
            const pageWidthfinal = doc.internal.pageSize.getWidth();
            const textFinal = `Rector`;
            const textWidthRecFinal = doc.getTextWidth(textFinal);
            const textXRecFinal = (pageWidthfinal - textWidthRecFinal) / 2;
            doc.setFont('helvetica', 'bold');
            doc.text(textFinal, textXRecFinal, yPos);
            resolve(doc.output('blob'));


          }, 500);
        } else {
          reject('Usuario no encontrado');
        }
      }, error => {
        reject(error);
      });
    });
  }

  createZipWithPdfs(pdfBlob: Blob) {
    const zip = new JSZip();
    zip.file('reporte.pdf', pdfBlob, { binary: true });

    zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
      saveAs(zipBlob, 'reportes.zip');
    }).catch((error) => {
      console.error('Error al crear el ZIP:', error);
    });
  }

  generatePdfAndCreateZip(): void {

    this.personaService.getPersonas().subscribe(respuesta => {
      respuesta.forEach(final => {
        this.prepararPersonasParaDescarga(final.id_persona).then((pdfBlob): void => {
          this.createZipWithPdfs(pdfBlob);
        }).catch((error) => {
          console.error('Error al generar el PDF:', error);
        });
      });
    });

  }

  descargartitutulos(id: any): void {
    // Llama al servicio para obtener todos los títulos
    const dataArray: any[] = [];

    this.tituloService.getTitulo().subscribe(respuest => {
      const titulos = respuest as Titulo_profesional[];
      const filTitllo = titulos.filter(titulo => titulo.id_persona === id);
      this.personaService.getPersonaById(id).subscribe(resultado => {
        filTitllo.forEach(final => {
          dataArray.push({
            TITULOS: final.nombre_titulo || 'N/A',
            DOCENTE: resultado.nombre1 + ' ' + resultado.nombre2 + ' ' + resultado.apellido1 + ' ' + resultado.apellido2 || 'N/A',
          });
          // Después de procesar todas las actividades, asignar el array acumulado a dataSource
          this.dataSourceTitulos = new MatTableDataSource<any>(dataArray);
          this.dataSourceTitulos.paginator = this.paginator;
          this.dataSourceTitulos.sort = this.sort;

        });
      });


    });
  }

}





