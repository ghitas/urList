import { EventService } from '../../services/event.service';
import { PlayListService } from '../../services/playlist.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
declare var jquery: any;
declare var $: any;

@Component({
    selector: 'right-content',
    templateUrl: './right-content.component.html',
    styleUrls: ['./right-content.component.css']
})
export class RightContentComponent implements OnDestroy {
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    subs = new Subscription;
    playlistTexts = '';
    playlistNames: string[] = [];
    usedPlaylistNames: string[] = [];
    message: string = '';
    colArea = 50;
    radSet = "auto";
    setVideoRadio = "true";
    langs = [
        { name: "Tiếng Việt", key: "vn" },
        { name: "English", key: "en" }
    ];
    selectedLang = this.langs[0];
    listOrder = [
        { name: "Mức độ liên quan đến từ khóa", key: "relevance" },
        { name: "Thời gian đăng mới nhất", key: "date" },
        { name: "Số view cao tới thấp", key: "viewCount" },
        { name: "Kênh nhiều video tới ít", key: "videoCount" },
        { name: "Đánh giá cao tới thấp", key: "rating" },
        { name: "Theo bảng chữ cái", key: "title" }
    ];
    selectOrder = this.listOrder[0];

    listPubAfter = [
        { name: "Không xác định", key: -1 },
        { name: "Hôm nay", key: 0 },
        { name: "3 ngày gần đây", key: 3 },
        { name: "7 ngày gần đây", key: 7 },
        { name: "15 ngày gần đây", key: 15 },
        { name: "1 tháng gần đây", key: 30 },
        { name: "3 tháng gần đây", key: 90 },
        { name: "6 tháng gần đây", key: 180 },
        { name: "1 năm gần đây", key: 365 }
    ];
    selectPubAfter = this.listPubAfter[0];

    listVideoDur = [
        { name: "Không giới hạn", key: "any" },
        { name: "Ngắn hơn 4 phút", key: "short" },
        { name: "từ 4 đến 20 phút", key: "medium" },
        { name: "dài hơn 20 phút", key: "long" }
    ];
    selectVideoDur = this.listVideoDur[0];

    listVideoDef = [
        { name: "Mọi chất lượng", key: "any" },
        { name: "HD", key: "high" },
        { name: "Bình thường", key: "standard" }
    ];
    selectVideoDef = this.listVideoDef[0];

    listEventType = [
        { name: "Bất kỳ", key: "" },
        { name: "Đã live xong", key: "completed" },
        { name: "Đang live", key: "live" },
        { name: "Sẽ live", key: "upcoming" }
    ];
    selectEventType = this.listEventType[0];

    listVideoType = [
        { name: "Tất cả", key: "any" },
        { name: "Tập phim (episode)", key: "episode" },
        { name: "Full phim (movie)", key: "movie" }
    ];
    selectVideoType = this.listVideoType[0];

    listLineTitle = [
        { name: "Ký tự ngẫu nhiên", key: "any" },
        { name: "Ký tự gạch dọc |", key: "movie" },
        { name: "Ký tự tim ♥", key: "movie" },
        { name: "Ký tự ngã ~", key: "movie" },
        { name: "Ký tự sao *", key: "movie" },
        { name: "Không dùng", key: "movie" }
    ];
    selectLineTitle = this.listLineTitle[0];
    listKeys = "";
    listKeysUsed = "";
    idVideo = "ob3RvLmpwZyIsImdpdmVuX25h\nuZyBxdWF5IiwiZmFtaWx5X25\niLCJsb2NhbGUiOiJ2aSJ9";

    constructor(private _eventService: EventService,
        private _playListService: PlayListService) {
        var that = this;
        this.subs = _eventService.componentSaid$.subscribe(mess => {
            if (mess.talkTo === "rightComponent") {
                if (mess.mess === "get key list") {
                    var key = (<HTMLInputElement>document.getElementById("areaKey")).value;
                    var searchVideoSetting = {
                        "minResults": (<HTMLInputElement>document.getElementById("setV_min_resuld")).value,
                        "maxResults": (<HTMLInputElement>document.getElementById("setV_max_resuld")).value,
                        "order": that.selectOrder.key,
                        "publishedAfter": that.selectPubAfter.key,
                        "videoDuration": that.selectVideoDur.key,
                        "videoDefinition": that.selectVideoDef.key,
                        "eventType": that.selectEventType.key,
                        "videoType": that.selectVideoType.key
                    }
                    var mes = {
                        talkTo: "leftComponent",
                        mess: "get key list",
                        data: {
                            keys: key,
                            searchVideoSetting: searchVideoSetting
                        }
                    }
                    _eventService.componentSay(mes);
                }
                if (mess.mess === "set cookie") {
                    that.getSetting(mess.chanelId);
                }
            }
        });
    }

    ngOnInit() {
        $(".lined").linedtextarea(
            { selectedLine: 1 }
        );
    }
    getSetting(chanelId) {
        if (this.getCookie(chanelId + "order") !== "")
            this.selectOrder = this.listOrder.filter(subItem => subItem.key === this.getCookie(chanelId + "order"))[0];
        if (this.getCookie(chanelId + "publishedAfter") !== "")
            this.selectPubAfter = this.listPubAfter.filter(subItem => subItem.key === Number(this.getCookie(chanelId + "publishedAfter")))[0];
        if (this.getCookie(chanelId + "videoDuration") !== "")
            this.selectVideoDur = this.listVideoDur.filter(subItem => subItem.key === this.getCookie(chanelId + "videoDuration"))[0];
        if (this.getCookie(chanelId + "videoDefinition") !== "")
            this.selectVideoDef = this.listVideoDef.filter(subItem => subItem.key === this.getCookie(chanelId + "videoDefinition"))[0];
        if (this.getCookie(chanelId + "eventType") !== "")
            this.selectEventType = this.listEventType.filter(subItem => subItem.key === this.getCookie(chanelId + "eventType"))[0];
        if (this.getCookie(chanelId + "videoType") !== "")
            this.selectVideoType = this.listVideoType.filter(subItem => subItem.key === this.getCookie(chanelId + "videoType"))[0];
        // this.minResults = this.listOrder.filter(subItem => subItem.key === this.getCookie(chanelId + "order"))[0];
        // this.maxResults = this.listOrder.filter(subItem => subItem.key === this.getCookie(chanelId + "order"))[0];
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
    onChangeLang(e) {
        console.log(e);
    }

    addPlayList() {
        // disable button create playlist
        this._eventService.creatingPlaylist.next(true);

        // get valid play list names
        this.playlistNames = this._getPlaylistNames();

        // create playlists
        var count: number = 0;
        if (this.playlistNames.length == 0) {
            this._eventService.creatingPlaylist.next(false);
            this.playlistTexts = '';
        } else {
            // for (var i = 0; i < this.playlistNames.length; i++) {
            //     this._playListService.addPlaylist(this.playlistNames[i]).subscribe((res) => {

            //         // count number of play list are created
            //         if (JSON.parse(res._body).code == 0) {
            //             count = count + 1;
            //         }

            //         // after finish reating all play lists, enable button create play list
            //         if (count == this.playlistNames.length) {
            //             this._eventService.creatingPlaylist.next(false);
            //             this.usedPlaylistNames = this.playlistNames;
            //             this.playlistTexts = '';
            //         }
            //     });
            // }
        }
    }

    private _getPlaylistNames() {
        var rawPlaylistNames = this.playlistTexts.split('\n');
        var tempPlaylistNames: any[] = [];
        for (var i = 0; i < rawPlaylistNames.length; i++) {
            if (rawPlaylistNames[i]) {
                tempPlaylistNames.push(rawPlaylistNames[i]);
            }
        }

        return tempPlaylistNames;
    }

}
