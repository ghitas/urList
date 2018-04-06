import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EventService } from '../../services/event.service';
import { PlayListService } from '../../services/playlist.service';
declare var $: any;

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
    urlChanel: string;

    constructor(private _eventService: EventService) {
        if (window.location.href.indexOf("code=") > 0) {
            this.autho = window.location.href.split("code=")[1];
            this.autho = this.autho.slice(4, this.autho.length);
            this.autho = "4/" + this.autho;
            this.autho += "#";
            window.history.pushState("", "", "/autoplaylist/callback");
        }
        this.urlChanel = "https://accounts.google.com/o/oauth2/auth?" +
            "redirect_uri=http://test.tokybook.com:8081/autoplaylist/callback&" +
            "response_type=code&" +
            "client_id=123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com&" +
            "scope=https://www.googleapis.com/auth/youtube&" +
            "approval_prompt=force&" +
            "access_type=offline";
    }

    ngOnInit() { }

    createList() {
        var that = this;
        this.onProcess = true;
        var name = $("#areaKey").val().split("\n")[0];
        var desc = $("#areaDesc").val();
        var url = "http://test.tokybook.com:8080/youtube/addPlaylist";
        var method = "POST";
        var postData = {
            "name": name,
            "privacy": "public",
            "description": desc,
            "authCode": this.autho
        };
        var xhr = new XMLHttpRequest();
        debugger;
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
