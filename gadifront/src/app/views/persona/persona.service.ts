// persona.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from './persona';
import { Periodo } from '../periodo/periodo';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.baseUrl}/persona`);
  }

  getPeriodos(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${this.baseUrl}/periodo`);
  }

  getGadosOcupacionales(): Observable<GradoOcupacional[]> {
    return this.http.get<GradoOcupacional[]>(`${this.baseUrl}/grado_ocupacional`);
  }
  getTiposContratos(): Observable<TipoContrato[]> {
    return this.http.get<TipoContrato[]>(`${this.baseUrl}/tipo_contrato`);
  }
  getTitulosProfecionales(): Observable<TituloProfecional[]> {
    return this.http.get<TituloProfecional[]>(`${this.baseUrl}/titulo_profesional`);
  }
}
