import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { Observable } from 'rxjs';
import { Tipo_contrato } from './tipo_contrato';

@Injectable({
  providedIn: 'root'
})
export class TipoContratoService {
  private urlBase =  appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  getContrato():Observable<Tipo_contrato[]>{
    return this.http.get<Tipo_contrato[]>(`${this.urlBase}/tipo_contrato`)
  }

  create(tipo_contrato: Tipo_contrato): Observable<Tipo_contrato> {
    return this.http.post<Tipo_contrato>(`${this.urlBase}/tipo_contrato`, tipo_contrato, { headers: this.httpHeaders})
  }

  getcontratobyId(id: any): Observable<Tipo_contrato> {
    return this.http.get<Tipo_contrato>(`${this.urlBase}/tipo_contrato/${id}`);
  }
}
