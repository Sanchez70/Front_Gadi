import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../../environment/appConfig';
import { Jornada } from './jornada';

@Injectable({
  providedIn: 'root'
})
export class JornadaService {
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  getJornada():Observable<Jornada[]>{
    return this.http.get<Jornada[]>(`${this.urlEndPoint}/jornada`)
  }

  create(jornada: Jornada): Observable<Jornada> {
    return this.http.post<Jornada>(`${this.urlEndPoint}/jornada`, jornada, { headers: this.httpHeaders })
  }

  getJornadabyId(id: any): Observable<Jornada> {
    return this.http.get<Jornada>(`${this.urlEndPoint}/jornada/${id}`);
  }
}
