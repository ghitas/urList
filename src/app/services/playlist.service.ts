import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';



@Injectable()
export class PlayListService {

  constructor(
    private http: Http
  ) { }

  createPlaylist(url: string, body: any): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(body), { headers })
      .map(res => res.json())
      .catch(err => err);
  }
}
