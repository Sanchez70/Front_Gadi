import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { tipo_actividad } from './tipo_actividad';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class tipo_actividadService {

  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  gettipoActividad(): Observable<tipo_actividad[]> {
    return this.http.get<tipo_actividad[]>(`${this.urlEndPoint}/tipo_actividad`)
  }

  create(tipo_actividad: tipo_actividad): Observable<tipo_actividad> {
    return this.http.post<tipo_actividad>(`${this.urlEndPoint}/tipo_actividad`, tipo_actividad, { headers: this.httpHeaders })
  }

  gettipoActividadbyId(id: any): Observable<tipo_actividad> {
    return this.http.get<tipo_actividad>(`${this.urlEndPoint}/tipo_actividad/${id}`);
  }

  update(tipo_actividad: tipo_actividad): Observable<tipo_actividad> {
    const url = `${this.urlEndPoint}/tipo_actividad/${tipo_actividad.id_tipo_actividad}`;
    return this.http.put<tipo_actividad>(url, tipo_actividad, { headers: this.httpHeaders });
  }

  deleteid(id: any): Observable<tipo_actividad> {
    return this.http.delete<tipo_actividad>(`${this.urlEndPoint}/tipo_actividad/${id}`);
  }

}
