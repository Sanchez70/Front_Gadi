import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../../environment/appConfig';
import { DistributivoAsignatura } from './distributivo-asignatura';

@Injectable({
  providedIn: 'root'
})
export class DistributivoAsignaturaService {
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  getDistributivoAsignatura():Observable<DistributivoAsignatura[]>{
    return this.http.get<DistributivoAsignatura[]>(`${this.urlEndPoint}/distributivo_asignatura`)
  }

  create(distributivoAsignatura: DistributivoAsignatura): Observable<DistributivoAsignatura> {
    return this.http.post<DistributivoAsignatura>(`${this.urlEndPoint}/distributivo_asignatura`, distributivoAsignatura, { headers: this.httpHeaders })
  }

  getDistributivobyId(id: any): Observable<DistributivoAsignatura> {
    return this.http.get<DistributivoAsignatura>(`${this.urlEndPoint}/distributivo_asignatura/${id}`);
  }

  updateDistributivo(distributivoAsignatura: DistributivoAsignatura): Observable<DistributivoAsignatura> {
    const url = `${this.urlEndPoint}/distributivo_asignatura/${distributivoAsignatura.id_distributivo_asig}`;
    return this.http.put<DistributivoAsignatura>(url, distributivoAsignatura, { headers: this.httpHeaders })
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/distributivo_asignatura/${id}`, { headers: this.httpHeaders });
  } 
}
