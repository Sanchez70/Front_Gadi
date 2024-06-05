import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { Observable } from 'rxjs';
import { Grado_ocupacional } from './grado_ocupacional';

@Injectable({
  providedIn: 'root'
})
export class GradoOcupacionalService {
  private urlBase =  appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  getGrado():Observable<Grado_ocupacional[]>{
    return this.http.get<Grado_ocupacional[]>(`${this.urlBase}/grado_ocupacional`)
  }

  create(grado_ocupacional: Grado_ocupacional): Observable<Grado_ocupacional> {
    return this.http.post<Grado_ocupacional>(`${this.urlBase}/grado_ocupacional`, grado_ocupacional, { headers: this.httpHeaders})
  }

  getGradobyId(id: any): Observable<Grado_ocupacional> {
    return this.http.get<Grado_ocupacional>(`${this.urlBase}/grado_ocupacional/${id}`);
  }
}
