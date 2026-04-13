import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

fetchResult(batchId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/file/${batchId}`);
}

getAllDocs(): Observable<any> {
  return this.http.get(`${this.apiUrl}/file/`);
}
getHistory(): Observable<any> {
  return this.http.get(`${this.apiUrl}/file/history`);
}
}
