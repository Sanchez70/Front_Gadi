import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from './persona';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private urlBase =  appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  getPersona():Observable<Persona[]>{
    return this.http.get<Persona[]>(`${this.urlBase}/persona`)
  }

  create(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(`${this.urlBase}/persona`, persona, { headers: this.httpHeaders})
  }

  getpersonabyId(id: any): Observable<Persona> {
    return this.http.get<Persona>(`${this.urlBase}/persona/${id}`);
  }
}
