import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EventService } from '../../services/event.service';
import { PlayListService } from '../../services/playlist.service';
import { Subscription } from 'rxjs';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { Observable } from 'rxjs/Observable';
declare var $: any;
declare var gapi: any;

@Component({
    selector: 'left-content',
    templateUrl: './left-content.component.html',
    styleUrls: ['./left-content.component.css']
})
export class LeftContentComponent implements OnDestroy {
    schedulerActive: boolean = false;
    myOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd 1:00:00',
    };

    // Initialized to specific date (09.10.2018)
    inputDateSche: any = { date: { year: 2018, month: 10, day: 9 } };

    // optional date changed callback
    onDateChanged(event: IMyDateModel): void {
        // date selected
        console.log(event);
    }
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
    listPllPerDay = [2, 4, 6, 8, 10];
    selectPllPerDay = this.listPllPerDay[4];
    scheduleEndDay = new Date().toLocaleDateString();
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    subs = new Subscription;
    constructor(
        private service: EventService,
        private servicePlaylist: PlayListService,
    ) {
        var that = this;
        this.username = localStorage.getItem("user");
        this.subs = this.service.componentSaid$.subscribe(mess => {
            if (mess.talkTo === "leftComponent") {
                if (this.user.channelId === "") {
                    this.handleError("Please choose the channel");
                } else if (mess.data.names.length === 0) {
                    this.handleError("Please insert key word first");
                } else {
                    var trim = [];
                    mess.data.names.forEach(item => {
                        if (item !== "")
                            trim.push(item);
                    })
                    mess.data.names = trim;
                    if (mess.mess === "get key list") {
                        this.createMultiPlayList(mess.data);
                    }
                    if (mess.mess === "scheduler call setting") {
                        this.setScheduler(mess.data);
                    }
                    if (mess.mess === "line channel") {
                        this.createPlaylistMultiChannel(mess.data);
                    }
                    if (mess.mess === "set end Date") {
                        this.setEndDateSchedule(mess.data);
                    }
                }
            }
        }, err => console.log(err));
        if (window.location.href.indexOf("code=") > 0) {
            this.autho = window.location.href.split("code=")[1];
            this.autho = this.autho.slice(4, this.autho.length);
            this.autho = "4/" + this.autho;
            this.autho += "#";
            console.log(this.autho);
            window.history.pushState("", "", "/autoplaylist/dashboard");
            this.service.post(this.service.nm_domain + this.service.nm_getUserInfor, {
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
                //bỏ mục vài pll mới tạo
                //that.user.playList = playList;
                var user = {
                    channelId:that.user.channelId,
                    channelTitle:that.user.channelTitle,
                    playlistNumber:that.user.playlistNumber
                }
                that.setCookie("userInfo", JSON.stringify(user), 20);
            }, err => {
                that.handleError("Can't get user info");
            });
        }
        this.urlChanel = "https://accounts.google.com/o/oauth2/auth?" +
            "redirect_uri=http://fasty2b.com:8080/autoplaylist/dashboard&" +
            "response_type=code&" +
            "client_id=123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com&" +
            "scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly&" +
            "approval_prompt=force&" +
            "access_type=offline";
        /**
         * get list channel of user
         */
        this.service.get(this.service.nm_domain + this.service.nm_getAllChannel + "?userId=" + this.username).subscribe(res => {
            console.log(res);
            that.listChannel = JSON.parse(res._body).data;
            that.setCookie("userChannel", res._body, 20);
        }, err => {
            this.handleError("Can't list channel");
        });
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
        this.service.componentSay(mess);
    }
    getListKeys() {
        var mess = {
            talkTo: "rightComponent",
            mess: "get key list"
        }
        this.service.componentSay(mess);
        // var data = this.service.getRightSetting();
        // console.log(data);
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
    btnLineChannel() {
        var mess = {
            talkTo: "rightComponent",
            mess: "line channel"
        }
        this.service.componentSay(mess);
    }
    // createPlaylistMultiChannel(data){
    //     this.listChannel.forEach(element => {
    //         this.createMultiPlayList(data, element.channelId);
    //     });
    // };

    createPlaylistMultiChannel(data) {
        var that = this;
        (function loop(l, k) {
            const promise = new Promise((resolve, reject) => {
                var url = "http://45.77.247.155:8081/youtube/addMultiPlaylist";
                var body = {
                    "names": [data.names[l]],
                    "privacy": "public",
                    "chanel": that.listChannel[k].channelId,
                    "searchVideoSetting": data.searchVideoSetting,
                    "descriptionSetting": data.descriptionSetting,
                    "titleSetting": data.titleSetting
                }
                that.onProcess = true;
                that.service.post(url, body).subscribe(
                    res => {
                        that.onProcess = false;
                        console.log(res);
                        if (res.code === 0) {
                            if (k === 0) {
                                // for (var i = 0; i < res.data.length; i++) {
                                //     that.user.playList.unshift(res.data[i]);
                                //     if (that.user.playList.length > 5)
                                //         that.user.playList.pop();
                                // }

                                //bỏ mục hiện pll mới tạo
                                // that.user.playList.unshift(res.data[0]);
                                // that.user.playList.pop();
                                that.setCookie("userInfo", JSON.stringify(that.user), 20);
                            }
                            resolve();
                        } else {
                            that.handleError("Kênh " + that.listChannel[k].channelTitle + " đã vượt quá số lượng pll được phép tạo trong ngày");
                            if (k === (that.listChannel.length - 1))
                                reject();
                            else
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
                    document.getElementById("processBar").style.width = ((l + 1) * (k + 1)) / (data.names.length * that.listChannel.length) * 100 + 20 + "%";
                    loop(l + 1, k);
                } else if (k < that.listChannel.length) {
                    k++;
                    l = 0;
                    loop(l, k);
                }
            }).catch(err => console.log("create pll err recieve promise"));
        })(0, 0);
    }

    createMultiPlayList(data) {
        // var url = this.service.nm_domain + this.service.nm_createPlaylist;
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
                var url = that.service.nm_domain + that.service.nm_createPlaylist;
                var body = {
                    "names": [data.names[l]],
                    "privacy": "public",
                    "chanel": that.user.channelId,
                    "searchVideoSetting": data.searchVideoSetting,
                    "descriptionSetting": data.descriptionSetting,
                    "titleSetting": data.titleSetting
                }
                that.onProcess = true;
                that.service.post(url, body).subscribe(
                    res => {
                        that.onProcess = false;
                        console.log(res);
                        if (res.code === 0) {
                            // bỏ mục hiện vài pll mới tạo
                            // for (var i = 0; i < res.data.length; i++) {
                            //     that.user.playList.unshift(res.data[i]);
                            //     if (that.user.playList.length > 5)
                            //         that.user.playList.pop();
                            // }
                            that.setCookie("userInfo", JSON.stringify(that.user), 20);
                            that.moveKeyWord(data.names[l], "successKey");
                            resolve();
                        } else {
                            that.handleError(res.message);
                            reject();
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

    btnSaveScheduler() {
        var mess = {
            talkTo: "rightComponent",
            mess: "scheduler call setting"
        }
        this.service.componentSay(mess);
    }

    setScheduler(data: any): any {
        var that = this;
        var url = this.service.nm_domain + this.service.nm_setSchedulerData;
        var body = {
            "names": data.names,
            "privacy": "public",
            "scheduler": {
                "schedulerStartTime": this.inputDateSche.formatted,
                "active": this.schedulerActive,
                "keyPerDay": this.selectPllPerDay
            },
            "chanel": this.user.channelId,
            "searchVideoSetting": data.searchVideoSetting,
            "descriptionSetting": data.descriptionSetting,
            "titleSetting": data.titleSetting
        }
        this.service.post(url, body).subscribe(
            res => {
                that.handleError("Lập lịch tạo pll thành công, ngày kết thúc là ngày " + that.scheduleEndDay);
            },
            err => {
                that.handleError(err.message);
            }
        )
    }


    selectCountPll(item) {
        var mess = {
            talkTo: "rightComponent",
            mess: "set end Date"
        }
        this.service.componentSay(mess);
    }
    setEndDateSchedule(data) {
        var day = new Date();
        var plus = data.names.length / this.selectPllPerDay;
        day.setDate(day.getDate() + plus);
        this.scheduleEndDay = day.toLocaleDateString();
    }

    moveKeyWord(key, ctrl) {
        var mess = {
            talkTo: "rightComponent",
            mess: ctrl,
            key: key
        }
        this.service.componentSay(mess);
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
        this.service.componentSay(mess);
    }
}
// Create an Observable that will start listening to geolocation updates
// when a consumer subscribes.
const locations = new Observable((observer) => {
    // Get the next and error callbacks. These will be passed in when
    // the consumer subscribes.
    const { next, error } = observer;
    // let watchId;

    // Simple geolocation API check provides values to publish
    // if ('geolocation' in navigator) {
    //     watchId = navigator.geolocation.watchPosition(next, error);
    // } else {
    //     error('Geolocation not available');
    // }

    // When the consumer unsubscribes, clean up data ready for next subscription.
    return { unsubscribe() { console.log("teo") } };
});

// Call subscribe() to start listening for updates.
const locationsSubscription = locations.subscribe({
    next(position) { console.log('Current Position: ', position); },
    error(msg) { console.log('Error Getting Location: ', msg); }
});

// Stop listening for location after 10 seconds
setTimeout(() => {
    locationsSubscription.unsubscribe();
}, 10000);
