import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { Asignatura } from './asignatura';
import { Ciclo } from '../cicloService/ciclo';
import { Observable, forkJoin, map} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  getAsignatura():Observable<Asignatura[]>{
    return this.http.get<Asignatura[]>(`${this.urlEndPoint}/asignatura`)
  }

  getAsignaturasConCiclos(): Observable<Asignatura[]> {
    const asignaturas$ = this.http.get<Asignatura[]>(`${this.urlEndPoint}/asignatura`);
    const ciclos$ = this.http.get<Ciclo[]>(`${this.urlEndPoint}/ciclox`);

    return forkJoin([asignaturas$, ciclos$]).pipe(
      map(([asignaturas, ciclos]) => {
        return asignaturas.map(asignatura => {
          const ciclo = ciclos.find(c => c.id_ciclo === asignatura.id_ciclo);
          return { ...asignatura, nombre_ciclo: ciclo ? ciclo.nombre_ciclo : '' };
        });
      })
    );
  }

  create(asignatura: Asignatura): Observable<Asignatura> {
    return this.http.post<Asignatura>(`${this.urlEndPoint}/asignatura`, asignatura, { headers: this.httpHeaders })
  }

  getAsignaturabyId(id: any): Observable<Asignatura> {
    return this.http.get<Asignatura>(`${this.urlEndPoint}/asignatura/${id}`);
  }

  update(asignatura: Asignatura): Observable<Asignatura> {
    return this.http.put<Asignatura>(`${this.urlEndPoint}/asignatura/${asignatura.id_asignatura}`, asignatura, { headers: this.httpHeaders });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/asignatura/${id}`, { headers: this.httpHeaders });
  }  
  
}