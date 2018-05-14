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
    onProcess = false;
    urlChanel: string;
    userInfo: string;
    userNm = "unknow";
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
                }
            }
        }, err => console.log(err));
        if (window.location.href.indexOf("code=") > 0) {
            this.autho = window.location.href.split("code=")[1];
            this.autho = this.autho.slice(4, this.autho.length);
            this.autho = "4/" + this.autho;
            this.autho += "#";
            console.log(this.autho);
            window.history.pushState("", "", "/autoplaylist/callback");
            this._eventService.post("http://45.77.247.155:8081/youtube/getUserInfor", { "authCode": this.autho }).subscribe(res => {
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
        /**
         * this code use for test
         */
        this.user = {"channelId":"UCz7R8tm_OXURNojRS7g0v3g","channelTitle":"nguyen phuong","playlistNumber":10,"playList":[{"id":"PLTDiZ2RBV545Tz5mId7Z_ThnpCI5ULW13","title":"Gửi Tuổi Thanh Xuân★AAA★1046","videoNumber":10},{"id":"PLTDiZ2RBV547HP3cndicumnRBty98uSQu","title":"Cô gái năm ấy chúng ta cùng theo đuổi★AAA★8485","videoNumber":17},{"id":"PLTDiZ2RBV546O59eyxwSN--EPOpMD2dcW","title":"Điều tuyệt vời nhất của chúng ta★AAA★0265","videoNumber":14},{"id":"PLTDiZ2RBV547cDtAtVUZJEA6PAeFKqUgL","title":"Bí mật không thể nói★AAA★8532","videoNumber":10},{"id":"PLTDiZ2RBV5451M3ZX6vuZk0ymt3nTeYXS","title":"Children of Men★AAA★2044","videoNumber":13},{"id":"PLTDiZ2RBV546D-a0WWztFIxqiFZSLTYSM","title":"The Act of Killing★AAA★0881★AAA★4396","videoNumber":0},{"id":"PLTDiZ2RBV544HE8WEImldUXi5huwRUcVO","title":"The Act of Killing★AAA★0881","videoNumber":0},{"id":"PLTDiZ2RBV544T74_69TX0Qpk8m2Usvzt6","title":"Gửi Tuổi Thanh Xuân★AAA★5435","videoNumber":0},{"id":"PLTDiZ2RBV544U3HWr7Q79UfSXMOeNDmHR","title":"Cô gái năm ấy chúng ta cùng theo đuổi★AAA★1100","videoNumber":0},{"id":"PLTDiZ2RBV545XfBuJuvqEQd7CEicUL5x5","title":"Holy Motors★AAA★2875","videoNumber":0}]};
        var that = this;
        // end test
        (function loop(l) {
            const promise = new Promise((resolve, reject) => {
                var url = "http://45.77.247.155:8081/youtube/addMultiPlaylist";
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
                        if(res.code === 403){
                            that.handleError("Vượt quá số lượng pll được phép tạo trong ngày");
                            reject();
                        }else{
                            for (var i = 0; i < res.data.length; i++) {
                                that.user.playList.unshift(res.data[i]);
                                if (that.user.playList.length > 5)
                                    that.user.playList.pop();
                            }
                            that.setCookie("userInfo", JSON.stringify(that.user), 20);
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
                if(l < data.names.length - 1){
                    document.getElementById("processBar").style.width = (l+1)/data.names.length*100 + 20 + "%";
                    loop(l + 1);
                }
            }).catch(err => console.log("create pll err recieve promise"));
        })(0);
    }

    handleError(error: string) {
        var mess = {
            talkTo: "dialog",
            data: {
                title: "Warning",
                content: error
            }
        }
        this._eventService.componentSay(mess);
    }
}

