import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EventService } from '../../services/event.service';
import { PlayListService } from '../../services/playlist.service';
import { Subscription } from 'rxjs';
declare var $: any;
declare var gapi: any;

@Component({
    selector: 'left-content',
    templateUrl: './left-content.component.html',
    styleUrls: ['./left-content.component.css']
})
export class LeftContentComponent implements OnDestroy {
    message: string = '';
    disableCreatePlayListBtn: boolean = false;
    route: string;
    autho: string;
    onProcess: boolean = false;
    urlChanel: string;
    userInfo: string;
    userNm: string = "unknow";
    GoogleAuth: any;
    user = {
        channelTitle: "",
        channelId: "",
        playList: [],
        playlistNumber: 0
    };
    chanel: any;
    channelId: string;
    samplePLL = [];
    playlistNumber: number;
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    subs = new Subscription;
    constructor(
        private _eventService: EventService,
        private servicePlaylist: PlayListService,
    ) {
        var that = this;
        this.subs = this._eventService.componentSaid$.subscribe(mess => {
            if (mess.talkTo === "leftComponent") {
                if (mess.mess === "get key list") {
                    this.createMultiPlayList(mess.data);
                    console.log(mess.data);
                }
            }
        });
        // this.user = {
        //     channelId: "UC6rVB-_0m1hsn9iEp0YUtng",
        //     channelTitle: "chung quay lee",
        //     playList: [
        //         { id: "unknown", title: "this message " },
        //         { id: "unknown", title: "this message just" },
        //         { id: "unknown", title: "this message just for test" },
        //         { id: "unknown", title: "this message just for" },
        //         { id: "unknown", title: "this just for test" }
        //     ],
        //     playlistNumber: 163
        // };
        // this.setCookie("userInfo", JSON.stringify(this.user), 20);
        if (window.location.href.indexOf("code=") > 0) {
            this.autho = window.location.href.split("code=")[1];
            this.autho = this.autho.slice(4, this.autho.length);
            this.autho = "4/" + this.autho;
            this.autho += "#";
            console.log(this.autho);
            window.history.pushState("", "", "/autoplaylist/callback");
            this._eventService.post("http://45.77.247.155:8080/youtube/getUserInfor", { "authCode": this.autho }).subscribe(res => {
                that.user = res.data;   
                that.setCookie("userInfo", JSON.stringify(res.data), 20);
                console.log(document.cookie);
            }, err => err);
        }
        this.urlChanel = "https://accounts.google.com/o/oauth2/auth?" +
            "redirect_uri=http://test.tokybook.com:8081/autoplaylist/callback&" +
            "response_type=code&" +
            "client_id=123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com&" +
            "scope=https://www.googleapis.com/auth/youtube&" +
            "approval_prompt=force&" +
            "access_type=offline";
    }
    ngOnInit() {
        var userSetting = this.getCookie("userInfo");
        if (userSetting !== "") {
            this.user = JSON.parse(this.getCookie("userInfo"));
            console.log(this.user);
            //this.findSettingForUser(this.user.channelId);
        }
    }
    findSettingForUser(chanelId){
        var mess = {
            talkTo: "rightComponent",
            mess: "set cookie",
            chanelId: chanelId
        }
        this._eventService.componentSay(mess);
    }
    getListKeys() {
        var mess = {
            talkTo: "rightComponent",
            mess: "get key list"
        }
        this._eventService.componentSay(mess);
    }
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

    createMultiPlayList(data) {
        var url = "http://45.77.247.155:8080/youtube/addMultiPlaylist";
        var body = {
            "names": data.names,
            "privacy": "public",
            "description": "Thong test testing",
            "chanel": this.user.channelId,
            "searchVideoSetting": data.searchVideoSetting,
            "descriptionSetting": data.descriptionSetting,
            "titleSetting": data.titleSetting
        }
        console.log(body);
        this.onProcess = true;
        var that = this;
        this._eventService.post(url, body).subscribe(
            res => {
                that.onProcess = false;
                console.log(res);
                for (var i = 0; i < res.data.length; i++) {
                    that.user.playList.unshift(res.data[i]);
                    if (that.user.playList.length > 5)
                        that.user.playList.pop();
                }
                this.setCookie("userInfo", JSON.stringify(this.user), 20);
            },
            err => {
                console.log(err);
                that.onProcess = false;
            }
        )
    }
}

