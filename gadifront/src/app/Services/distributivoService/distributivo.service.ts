import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../../environment/appConfig';
import { Distributivo } from './distributivo';

@Injectable({
  providedIn: 'root'
})
export class DistributivoService {
  // private baseUrl = 'http://localhost:8081/api';
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  getDistributivo():Observable<Distributivo[]>{
    return this.http.get<Distributivo[]>(`${this.urlEndPoint}/distributivo`)
  }

  create(distributivo: Distributivo): Observable<Distributivo> {
    return this.http.post<Distributivo>(`${this.urlEndPoint}/distributivo`, distributivo, { headers: this.httpHeaders })
  }

  getDistributivobyId(id: any): Observable<Distributivo> {
    return this.http.get<Distributivo>(`${this.urlEndPoint}/distributivo/${id}`);
  }

  updateDistributivo(distributivo: Distributivo): Observable<Distributivo> {
    const url = `${this.urlEndPoint}/distributivo/${distributivo.id_distributivo}`;
    return this.http.put<Distributivo>(url, distributivo, { headers: this.httpHeaders })
  }
 
  getDistributivoByPersonaId(id_persona: number): Observable<Distributivo> {
    return this.http.get<Distributivo>(`${this.urlEndPoint}/distributivo/persona/${id_persona}`);
  }
}
