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
    listPrivacy = [
        { name: "Công khai", key: "public" },
        { name: "Không công khai", key: "unlisted" },
        { name: "Riêng tư", key: "private" }
    ];
    selectPrivacy = this.listPrivacy[0];
    listLanguage = [
        { name: "Tiếng Việt", key: "vietnamese" },
        { name: "English", key: "english" }
    ];
    selectLanguage = this.listLanguage[0];
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
        { name: "Ký tự ngẫu nhiên", key: "ngaunhien" },
        { name: "Ký tự gạch dọc |", key: "doc" },
        { name: "Ký tự gạch dọc -", key: "ngang" },
        { name: "Ký tự tim ♥", key: "tim" },
        { name: "Ký tự ngã ~", key: "nga" },
        { name: "Ký tự sao *", key: "sao" },
        { name: "Không dùng", key: "" }
    ];
    selectLineTitle = this.listLineTitle[0];
    listKeys = "";
    listKeysUsed = "";
    idVideo = "";

    constructor(private _eventService: EventService,
        private _playListService: PlayListService) {
        var that = this;
        this.subs = _eventService.componentSaid$.subscribe(mess => {
            if (mess.talkTo === "rightComponent") {
                if (mess.mess === "get key list") {
                    var names = $("#names")[0].value.split("\n");
                    var searchVideoSetting = {
                        "minResults": $("#minResults")[0].value,
                        "maxResults": $("#maxResults")[0].value,
                        "order": that.selectOrder.key,
                        "publishedAfter": that.selectPubAfter.key,
                        "videoDuration": that.selectVideoDur.key,
                        "videoDefinition": that.selectVideoDef.key,
                        "eventType": that.selectEventType.key,
                        "videoType": that.selectVideoType.key
                    }
                    var titleSetting = {
                        "isAddRandomKeyWord": $("#isAddRandomKeyWord")[0].checked,
                        "isAddRandomNumber": $("#isAddRandomNumber")[0].checked,
                        "number": Number($("#number")[0].value),
                        "isNeverDie": $("#isNeverDie")[0].checked,
                        "concatKeyword": that.selectLineTitle.key
                    };
                    var descriptionSetting = {
                        "isAddRandomVideoTitle": $("#inAddRandTile")[0].checked,
                        "isAutoAddDescription": $("#inAddDesAuto")[0].checked,
                        "description": $("#areaDescription")[0].value
                    }
                    var generalSetting = {
                        "privacy": that.selectPrivacy.key,
                        "language": that.selectLanguage.key,
                        "maxPlaylistNumberPerChannel": $("#maxPlaylistNumberPerChannel")[0].value,
                        "useAllKeyword": $("#useAllKeyword")[0].checked,
                        "skipSensitiveKeyword": $("#skipSensitiveKeyword")[0].checked,
                        "autoChangeChannel": $("#autoChangeChannel")[0].checked

                    };
                    var videos = $("#videos")[0].value.split("\n");
                    var insertVideoSetting = {
                        "noInsertVideo": $("#noInsertVideo")[0].checked,
                        "yesInsertVideo": $("#yesInsertVideo")[0].checked,
                        "videoNumber": $("#videoNumber")[0].value,
                        "videos": videos,
                        "autoChooseVideoID": $("#autoChooseVideoID")[0].checked,
                        "addPositionRandom": $("#addPositionRandom")[0].checked,
                        "insert1ID": $("#insert1ID")[0].checked
                    }
                    var mes = {
                        talkTo: "leftComponent",
                        mess: "get key list",
                        data: {
                            names: names,
                            searchVideoSetting: searchVideoSetting,
                            titleSetting: titleSetting,
                            descriptionSetting: descriptionSetting,
                            generalSetting: generalSetting,
                            insertVideoSetting: insertVideoSetting
                        }
                    }
                    _eventService.componentSay(mes);
                }
                if (mess.mess === "set cookie") {
                    //that.getSetting(mess.chanelId);
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

}
