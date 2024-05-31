import { Injectable } from '@angular/core';
import { Observable, map, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../../environment/appConfig';
import { Ciclo } from './ciclo';

@Injectable({
  providedIn: 'root'
})
export class CicloService {
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  getCiclo():Observable<Ciclo[]>{
    return this.http.get<Ciclo[]>(`${this.urlEndPoint}/ciclo`)
  }

  create(ciclo: Ciclo): Observable<Ciclo> {
    return this.http.post<Ciclo>(`${this.urlEndPoint}/ciclo`, ciclo, { headers: this.httpHeaders })
  }

  getCiclobyId(id: any): Observable<Ciclo> {
    return this.http.get<Ciclo>(`${this.urlEndPoint}/ciclo/${id}`);
  }

}
