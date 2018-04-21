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
        this.subs = this._eventService.componentSaid$.subscribe(mess => {
            if (mess.talkTo === "leftComponent") {
                if (mess.mess === "get key list") {
                    // var set = mess.data.searchVideoSetting;
                    // var chanelID = "UC6rVB-_0m1hsn9iEp0YUtng"
                    // for (let item in set) {
                    //     this.setCookie(chanelID + item, set[item], 20);
                    // }
                    this.createMultiPlayList(mess.data);
                    console.log(mess.data);
                }
            }
        });
        if (window.location.href.indexOf("code=") > 0) {
            this.autho = window.location.href.split("code=")[1];
            this.autho = this.autho.slice(4, this.autho.length);
            this.autho = "4/" + this.autho;
            this.autho += "#";
            console.log(this.autho);
            window.history.pushState("", "", "/autoplaylist/callback");
            this._eventService.post("http://45.77.247.155:8080/youtube/getUserInfor", { "authCode": this.autho }).subscribe(res => {
                console.log(res);
                this.user = res.data;
                // this.setCookie("channelTitle", res.data.channelTitle, 20);
                // this.setCookie("channelId", res.data.channelId, 20);
                // this.setCookie("playlistNumber", res.data.playlistNumber, 20);
                // console.log(res.data.playlist);
                // res.data.playlist.forEach((index, item) => {
                //     this.setCookie("playlist" + index + "id", item.id, 20);
                //     this.setCookie("playlist" + index + "title", item.title, 20);
                // })
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
        // var mess = {
        //     talkTo: "rightComponent",
        //     mess: "set cookie",
        //     chanelId: this.channelId
        // }
        // this._eventService.componentSay(mess);
        // if (this.chanel !== null) {
        //     this.getCurrentUser();
        // }
        // this.user = {
        //     channelTitle: "",
        //     channelId: "",
        //     playList: [
        //         { id: "unknown", title: "this message " },
        //         { id: "unknown", title: "this message just" },
        //         { id: "unknown", title: "this message just for test" },
        //         { id: "unknown", title: "this message just for" },
        //         { id: "unknown", title: "this just for test" }
        //     ],
        //     playlistNumber: 0
        // };
    }
    getListKeys() {
        var mess = {
            talkTo: "rightComponent",
            mess: "get key list"
        }
        this._eventService.componentSay(mess);
    }
    getCurrentUser() {
        this.user.channelId = this.getCookie("channelId");
        this.user.channelTitle = this.getCookie("channelTitle");
        this.user.playlistNumber = Number(this.getCookie("playlistNumber"));
        for (var i = 0; i < 5; i++) {
            this.user.playList[i] = {
                id: this.getCookie("playlist" + i + "id"),
                title: this.getCookie("playlist" + i + "title")
            }
        }
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
        var keys = data.keys.split("\n");
        var body = {
            "names": keys,
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
            },
            err => {
                console.log(err);
                that.onProcess = false;
            }
        )
    }
}

