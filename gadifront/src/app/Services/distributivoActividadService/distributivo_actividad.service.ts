import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../../environment/appConfig';
import { DistributivoActividad } from './distributivo_actividad';

@Injectable({
  providedIn: 'root'
})
export class DistributivoActividadService {
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  
  getDistributivoActividad():Observable<DistributivoActividad[]>{
    return this.http.get<DistributivoActividad[]>(`${this.urlEndPoint}/distributivo_actividad`)
  }

  create(distributivoActividad: DistributivoActividad): Observable<DistributivoActividad> {
    return this.http.post<DistributivoActividad>(`${this.urlEndPoint}/distributivo_actividad`, distributivoActividad, { headers: this.httpHeaders })
  }

  getActividadbyId(id: any): Observable<DistributivoActividad> {
    return this.http.get<DistributivoActividad>(`${this.urlEndPoint}/distributivo_actividad/${id}`);
  }

  updateDistributivo(distributivo_actividad: DistributivoActividad): Observable<DistributivoActividad> {
    const url = `${this.urlEndPoint}/distributivo_actividad/${distributivo_actividad.id_distributivo_actividad}`;
    return this.http.put<DistributivoActividad>(url, distributivo_actividad, { headers: this.httpHeaders })
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/distributivo_actividad/${id}`, { headers: this.httpHeaders });
  } 
}