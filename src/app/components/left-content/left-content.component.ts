import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EventService } from '../../services/event.service';
import { PlayListService } from '../../services/playlist.service';

@Component({
    selector: 'left-content',
    templateUrl: './left-content.component.html',
    styleUrls: ['./left-content.component.css']
})
export class LeftContentComponent implements OnInit {
    message: string = '';
    disableCreatePlayListBtn: boolean = false;
    route: string;
    autho: string;
    onProcess: boolean = false;

    constructor(private _eventService: EventService) {
        if (window.location.href.indexOf("code=") > 0) {
            this.autho = window.location.href.split("code=")[1];
            this.autho = this.autho.slice(4, this.autho.length);
            this.autho = "4/" + this.autho;
            this.autho += "#";
        }
    }

    ngOnInit() {
        // this._eventService.creatingPlaylist$.subscribe(event => {
        //     this.disableCreatePlayListBtn = event;
        //     if (!this.disableCreatePlayListBtn) {
        //         this.message = 'Đã tạo play list thành công !!!!!!!';
        //         setTimeout(() => {
        //             this.message = '';
        //         }, 2000);
        //     }
        // });
    }

    Oauth2(): void {
        var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?';
        var VALIDURL = 'https://accounts.google.com/o/oauth2/token';
        var SCOPE = 'https://www.googleapis.com/auth/youtube';
        var CLIENTID = '364602988528-7nbkl7eertpdfomppohbcrosdte8snln.apps.googleusercontent.com';
        var REDIRECT = 'http://localhost:8080/callback'
        var LOGOUT = 'http://accounts.google.com/Logout';
        var TYPE = 'token';
        var _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
        var acToken;
        var tokenType;
        var expiresIn;
        var user;
        var loggedIn = false;
        login();
        function login() {
            _url = "https://accounts.google.com/o/oauth2/auth?" +
                "redirect_uri=http://localhost:8080/autoplaylist/callback&" +
                "response_type=code&" +
                "client_id=123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com&" +
                "scope=https://www.googleapis.com/auth/youtube&" +
                "approval_prompt=force&" +
                "access_type=offline";
            window.location.href = _url;
        }
    }
    createList(){
        var that = this;
        this.onProcess = true;
        var url = "http://45.77.247.155:8080/youtube/addPlaylist";
        var method = "POST";
        var postData = {
            "name": "Xin Chao",
            "privacy": "public",
            "description": "testing",
            "authCode": this.autho
        };
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.responseType = 'text';
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = processRequest;
        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
                that.onProcess = false;
            }
        }
        xhr.send(JSON.stringify(postData));
    }
}
