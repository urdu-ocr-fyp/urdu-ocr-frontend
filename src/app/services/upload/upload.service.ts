// services/upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private apiUrl = environment.apiUrl; // e.g. http://localhost:3000/api

  constructor(private http: HttpClient) {}

  /**
   * Upload files and get batchId.
   * Returns an Observable that emits progress events and finally the batchId.
   */
  uploadFiles(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));

    const req = new HttpRequest('POST', `${this.apiUrl}/file/process`, formData, {
      reportProgress: true,
      withCredentials: true
    });

    return this.http.request(req);
  }

  /**
   * Listen to SSE for a given batchId.
   * Emits each message, and completes when processing finishes.
   */
  // listenToStatus(batchId: string): Observable<any> {
  //   const req = new HttpRequest('GET', `${this.apiUrl}/file/process`, formData, {
  //     reportProgress: true,
  //     withCredentials: true
  //   });
  //   // return new Observable(observer => {
  //   //   const eventSource = new EventSource(`${this.apiUrl}/file/stream/${batchId}`, {
  //   //     withCredentials: true
  //   //   });

  //   //   console.log('eventsource', eventSource)

  //   //   eventSource.onmessage = (event) => {
  //   //     try {
  //   //       console.log('event', event)
  //   //       const data = JSON.parse(event.data);
  //   //       observer.next(data);
  //   //       // If the server sends a final status, complete.
  //   //       if (data.status === 'completed' || data.status === 'failed') {
  //   //         observer.complete();
  //   //         eventSource.close();
  //   //       }
  //   //     } catch (err) {
  //   //       observer.error(err);
  //   //     }
  //   //   };

  //   //   eventSource.onerror = (err) => {
  //   //     observer.error(err);
  //   //     eventSource.close();
  //   //   };

  //   //   return () => eventSource.close();
  //   // });
  // }

  listenToStatus(batchId: string): Observable<any> {
  return new Observable(observer => {
    const url = `${this.apiUrl}/file/stream/${batchId}`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.onmessage = (event) => {
      try {
        console.log("event", event)
        const data = JSON.parse(event.data);
        observer.next(data);
        // You can decide when to complete based on your backend event
        // For example, if data.status === 'completed' or data.batchId
        if (data.status === 'completed' || data.batchId) {
          observer.complete();
          eventSource.close();
        }
      } catch (err) {
        observer.error(err);
      }
    };

    eventSource.onerror = (err) => {
      observer.error(err);
      eventSource.close();
    };

    return () => eventSource.close();
  });
}
}
