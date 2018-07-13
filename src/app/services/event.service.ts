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
  public isUserLoggedIn = false;
  public user: string;
  public pass: string;
  public nm_domain = "http://FastY2B.com:8081";
  /**
   * service list
   */
  public nm_delPlaylist = "/youtube/deletePlaylist";
  public nm_viewPlaylist = "/youtube/getPlaylistsListByChannelId";
  public nm_getAllChannel = "/youtube/getAllChannelByUserId";
  public nm_getUserInfor = "/youtube/getUserInfor";
  public nm_createPlaylist = "/youtube/addMultiPlaylist";
  public nm_setSchedulerData = "/youtube/setSchedulerData";

  constructor(private http: Http, private router: Router) {
    this.isUserLoggedIn = false;
  }

  setUserLoggedIn(id, pass) {
    this.isUserLoggedIn = false;
    var data = { "userId": id, "password": pass };
    this.post(this.nm_domain + "/youtube/login", data).subscribe((res) => {
      if (res.code === 0) {
        this.isUserLoggedIn = true;
        localStorage.setItem("autho", "yes");
        localStorage.setItem("user", id);
        this.user = id;
        this.getUserLoggedIn();
        this.router.navigate(['/main-page']);
      } else {
        this.isUserLoggedIn = false;
        localStorage.clear();
        this.showPopup("Thông báo", "username hoặc password không chính xác", true, "Yes", "No", "del");
      }
    }, (err) => err);
  }

  getUserLoggedIn() {
    return this.isUserLoggedIn;
  }

  get(url: string): Observable<any> {
    return this.http.get(url);
  }
  post(url: string, json: any): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json;charset=UTF-8");
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(json), { headers })
      .map(res => res.json())
      .catch(err => err);
  }
  delete(url: string): Observable<number> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json;charset=UTF-8");
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(url)
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
    var data = {
      title: title,
      content: content,
      btnYN: btnYN,
      access: {
        yes: yesFun,
        no: noFun,
        choose: choose
      }
    };
    var mess = {
      talkTo: "dialog",
      data: data
    }
    this.componentSay(mess);
  };

  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  getRightSetting(){
    // return this.right.mySetting();
  }
}
