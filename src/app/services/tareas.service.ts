import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root',
})
export class TareasService {

  constructor(
    private http: HttpClient
  ) { }

  getTareas() {
    return this.http.get<any>('../../assets/data.json');
  }
}
