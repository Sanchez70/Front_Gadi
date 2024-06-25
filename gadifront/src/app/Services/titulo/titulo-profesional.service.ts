import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Titulo_profesional } from './titulo_profesional';

@Injectable({
  providedIn: 'root'
})
export class TituloProfesionalService {
  private urlBase =  appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  getTitulo():Observable<Titulo_profesional[]>{
    return this.http.get<Titulo_profesional[]>(`${this.urlBase}/titulo_profesional`)
  }

  create(titulo_profesional: Titulo_profesional): Observable<Titulo_profesional> {
    return this.http.post<Titulo_profesional>(`${this.urlBase}/titulo_profesional`, titulo_profesional, { headers: this.httpHeaders})
  }

  getTitulobyId(id: any): Observable<Titulo_profesional> {
    return this.http.get<Titulo_profesional>(`${this.urlBase}/titulo_profesional/${id}`);
  }
  
}
