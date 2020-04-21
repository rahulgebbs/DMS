import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
import { Token } from '../manager/token';
import { Router } from '@angular/router';
// import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BireportService {

  constructor(private router: Router,private http: Http) { }
   
  GetBiReport(formbody) {
    return this.http.post(environment.ApiUrl + '/api/client-bi-link', formbody);
  }
  
}
