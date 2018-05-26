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
    username: string;
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
    listChannel = [];
    selectChannel = this.listChannel[0];
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
                }
            }
        }, err => console.log(err));
        /**
         * get list channel of user
         */
        this._eventService.get(this._eventService.nm_domain + this._eventService.nm_getAllChannel + "?userId=" + this.username).subscribe(res => { 
            console.log(res);
            this.listChannel = JSON.parse(res._body).data;
            that.setCookie("userChannel", res._body, 20);
        }, err => {
            this.handleError("Can't list channel");
        });

        if (window.location.href.indexOf("code=") > 0) {
            this.autho = window.location.href.split("code=")[1];
            this.autho = this.autho.slice(4, this.autho.length);
            this.autho = "4/" + this.autho;
            this.autho += "#";
            this.username = localStorage.getItem("user");
            console.log(this.autho);
            window.history.pushState("", "", "/autoplaylist/dashboard");
            this._eventService.post(this._eventService.nm_domain + this._eventService.nm_getUserInfor, {
                "authCode": this.autho,
                "userId": this.username
            }).subscribe(res => {
                that.user = res.data;
                var playList = [];
                res.data.playList.forEach(element => {
                    if (element !== null) {
                        playList.push({
                            "id": element.id,
                            "title": element.title,
                            "videoNumber": element.videoNumber
                        });
                    }
                });
                that.user.playList = playList;
                that.setCookie("userInfo", JSON.stringify(that.user), 20);
            }, err => {
                that.handleError("Can't get user info");
            });
        }
        this.urlChanel = "https://accounts.google.com/o/oauth2/auth?" +
            "redirect_uri=http://fasty2b.com:8080/autoplaylist/dashboard&" +
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
    findSettingForUser(chanelId) {
        var mess = {
            talkTo: "rightComponent",
            mess: "set cookie",
            chanelId: chanelId
        }
        this._eventService.componentSay(mess);
    }
    getListKeys() {
        // var mess = {
        //     talkTo: "rightComponent",
        //     mess: "get key list"
        // }
        // this._eventService.componentSay(mess);
        var data = this._eventService.getRightSetting();
        console.log(data);
        // this.createMultiPlayList(data);
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
        // var url = this._eventService.nm_domain + this._eventService.nm_createPlaylist;
        // var body = {
        //     "names": data.names,
        //     "privacy": "public",
        //     "description": "Thong test testing",
        //     "chanel": this.user.channelId,
        //     "searchVideoSetting": data.searchVideoSetting,
        //     "descriptionSetting": data.descriptionSetting,
        //     "titleSetting": data.titleSetting
        // }
        // console.log(body);
        // this.onProcess = true;
        var that = this;
        (function loop(l) {
            const promise = new Promise((resolve, reject) => {
                var url = that._eventService.nm_domain + that._eventService.nm_createPlaylist;
                var body = {
                    "names": [data.names[l]],
                    "privacy": "public",
                    "chanel": that.user.channelId,
                    "searchVideoSetting": data.searchVideoSetting,
                    "descriptionSetting": data.descriptionSetting,
                    "titleSetting": data.titleSetting
                }
                that.onProcess = true;
                that._eventService.post(url, body).subscribe(
                    res => {
                        that.onProcess = false;
                        console.log(res);
                        if (res.code === 403) {
                            that.handleError("Vượt quá số lượng 10pll được tạo trong ngày");
                            reject();
                        } else {
                            for (var i = 0; i < res.data.length; i++) {
                                that.user.playList.unshift(res.data[i]);
                                if (that.user.playList.length > 5)
                                    that.user.playList.pop();
                            }
                            that.setCookie("userInfo", JSON.stringify(that.user), 20);
                            that.moveKeyWord(data.names[l],"successKey");
                            resolve();
                        }

                    },
                    err => {
                        console.log(err);
                        that.onProcess = false;
                        reject();
                    }
                )
            }).then(() => {
                if (l < data.names.length - 1) {
                    document.getElementById("processBar").style.width = (l + 1) / data.names.length * 100 + 20 + "%";
                    loop(l + 1);
                }
            }).catch(err => console.log("create pll err recieve promise"));
        })(0);
    }

    moveKeyWord(key, ctrl){
        var mess = {
            talkTo: "rightComponent",
            mess: ctrl,
            key: key
        }
        this._eventService.componentSay(mess);
    }

    btnLineChannel(){
        var that = this;
        (function loop(k) {
            const promise = new Promise((resolve, reject) => {
                that.user.channelId = that.listChannel[k].channelId;
                that.getListKeys();//bug here
                resolve();
            }).then(() => {
                if (k < that.listChannel.length) {
                    loop(k + 1);
                }
            }).catch(err => console.log("line channel is error"));
        })(0);
    }

    handleError(error: string) {
        var mess = {
            talkTo: "dialog",
            data:
                {
                    title: "Warning",
                    content: error
                }
        }
        this._eventService.componentSay(mess);
    }
}

