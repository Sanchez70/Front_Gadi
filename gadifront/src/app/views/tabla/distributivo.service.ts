// distributivo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistributivoService {
  private baseUrl = 'http://localhost:8081/api/distributivo';

  constructor(private http: HttpClient) {}

  getDistributivos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
