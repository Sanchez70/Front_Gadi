import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Rector } from './rector';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RectorService {
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  create(rector: Rector): Observable<Rector> {
    return this.http.post<Rector>(`${this.urlEndPoint}/rector`, rector, { headers: this.httpHeaders })
  }

  getRector():Observable<Rector[]>{
    return this.http.get<Rector[]>(`${this.urlEndPoint}/rector`);
  }

  getRectorbyId(id: any): Observable<Rector> {
    return this.http.get<Rector>(`${this.urlEndPoint}/rector/${id}`);
  }

  update(rector: Rector): Observable<Rector> {
    return this.http.put<Rector>(`${this.urlEndPoint}/rector/${rector.id_director}`, rector, { headers: this.httpHeaders });
  }
}
