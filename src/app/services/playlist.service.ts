import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class PlayListService {
  private root = 'http://45.77.247.155:8080/youtube/';  // URL to web api
  private ADD_PLAYLIST = 'addPlaylist';

  constructor(
    private http: Http) { 

    }

    
  addPlaylist (playListName) {
    let body={
      "name": playListName
    }

    return this.http.post(this.root + this.ADD_PLAYLIST, body)
                    .map((res: any) =>{
      return res;
    });
  }
}
