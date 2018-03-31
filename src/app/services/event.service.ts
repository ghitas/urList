import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';


@Injectable()
export class EventService {
  startPlaylist = new Subject<boolean>();
  startPlaylist$ = this.startPlaylist.asObservable();

  creatingPlaylist = new Subject<boolean>();
  creatingPlaylist$ = this.creatingPlaylist.asObservable();

  public isUserLoggedIn = false;

  constructor(private http: Http, private router: Router) {
    this.isUserLoggedIn = false;
  }

  setUserLoggedIn(id, pass) {
    this.isUserLoggedIn = false;
    var data = { "userId": id, "password": pass };
    this.post("http://45.77.247.155:8080/youtube/login", data).subscribe((res) => {
      if (res.code === 0) {
        this.isUserLoggedIn = true;
        localStorage.setItem("autho","yes");
        this.getUserLoggedIn();
        this.router.navigate(['/dashboard']);
      }else{
        this.isUserLoggedIn = false;
        localStorage.clear();
        console.log('teo');
        this.showPopup("thong bao", "invalid username or password", true,"Yes","No","del");
      }
    }, (err) => err);
  }

  getUserLoggedIn() {
    return this.isUserLoggedIn;
  }

  post(url: string, json: any): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json;charset=UTF-8");
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(json), { headers })
      .map(res => res.json())
      .catch(err => err);
  }
  // communication with dialog
  private componentSaySource = new Subject<any>();
  private dialogSaySource = new Subject<any>();
  //listen
  componentSaid$ = this.componentSaySource.asObservable();
  dialogSaid$ = this.dialogSaySource.asObservable();
  //say
  componentSay(message: any) {
    this.componentSaySource.next(message);
  }
  dialogSay(message: any) {
    this.dialogSaySource.next(message);
  }
  
  showPopup(title: string, content: string, btnYN: boolean, yesFun: string, noFun: string, choose: string) {
		var dialog = {
			title: title,
			content: content,
			btnYN: btnYN,
			access: {
				yes: yesFun,
				no: noFun,
				choose: choose
			}
		};
		this.componentSay(dialog);
  };
}
