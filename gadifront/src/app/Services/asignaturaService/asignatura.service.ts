import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { Asignatura } from './asignatura';
import { Ciclo } from '../cicloService/ciclo';
import { Observable, forkJoin, map} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Carrera } from '../carreraService/carrera';

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

  getAsignaturasCrud(): Observable<Asignatura[]> {
    const asignaturas$ = this.http.get<Asignatura[]>(`${this.urlEndPoint}/asignatura`);
    const ciclos$ = this.http.get<Ciclo[]>(`${this.urlEndPoint}/ciclo`);
    const carreras$ = this.http.get<Carrera[]>(`${this.urlEndPoint}/carrera`);

    return forkJoin([asignaturas$, ciclos$, carreras$]).pipe(
      map(([asignaturas, ciclos, carreras]) => {
        return asignaturas.map(asignatura => {
          const carrera = carreras.find(ca => ca.id_carrera == asignatura.id_carrera);
          const ciclo = ciclos.find(c => c.id_ciclo === asignatura.id_ciclo);
          return { ...asignatura, nombre_ciclo: ciclo ? ciclo.nombre_ciclo : '', nombre_carrera: carrera ? carrera.nombre_carrera : '' };
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