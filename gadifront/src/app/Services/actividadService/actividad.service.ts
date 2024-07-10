import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { Actividad } from './actividad';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  getActividad(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.urlEndPoint}/actividad`)
  }

  create(actividad: Actividad): Observable<Actividad> {
    return this.http.post<Actividad>(`${this.urlEndPoint}/actividad`, actividad, { headers: this.httpHeaders })
  }

  getActividadbyId(id: any): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.urlEndPoint}/actividad/${id}`);
  }
  
  update(actividad: Actividad): Observable<Actividad> {
    return this.http.put<Actividad>(`${this.urlEndPoint}/actividad/${actividad.id_actividad}`, actividad, { headers: this.httpHeaders });
  }

  deleteid(id: any): Observable<Actividad> {
    return this.http.delete<Actividad>(`${this.urlEndPoint}/actividad/${id}`);
  }
  
}