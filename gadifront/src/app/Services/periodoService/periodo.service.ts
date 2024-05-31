import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../../environment/appConfig';
import { Periodo } from './periodo';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  getPeriodo():Observable<Periodo[]>{
    return this.http.get<Periodo[]>(`${this.urlEndPoint}/periodo`)
  }

  create(periodo: Periodo): Observable<Periodo> {
    return this.http.post<Periodo>(`${this.urlEndPoint}/periodo`, periodo, { headers: this.httpHeaders })
  }

  getPeriodobyId(id: any): Observable<Periodo> {
    return this.http.get<Periodo>(`${this.urlEndPoint}/periodo/${id}`);
  }
}
