import { EventService } from '../../services/event.service';
import { PlayListService } from '../../services/playlist.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
declare var jquery: any;
declare var $: any;

@Component({
    selector: 'right-content',
    templateUrl: './right-content.component.html',
    styleUrls: ['./right-content.component.css']
})
export class RightContentComponent implements OnDestroy {
    chanelId: string;
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    subs = new Subscription;
    setVideoRadio = "noInsertVideo";
    setDescriptRadio = "isManualAddDescription";
    listPrivacy = [];
    selectPrivacy = this.listPrivacy[0];

    listLanguage = [];
    selectLanguage = this.listLanguage[0];

    listOrder = [];
    selectOrder = this.listOrder[0];

    listPublishedAfter = [];
    selectPublishedAfter = this.listPublishedAfter[0];

    listVideoDuration = [];
    selectVideoDuration = this.listVideoDuration[0];

    listVideoDefinition = [];
    selectVideoDefinition = this.listVideoDefinition[0];

    listEventType = [];
    selectEventType = this.listEventType[0];

    listVideoType = [];
    selectVideoType = this.listVideoType[0];

    listConcatKeyword = [];
    selectConcatKeyword = this.listConcatKeyword[0];

    setting: any;
    //input setting
    minResults: any;
    maxResults: any;
    videoNumber: any;
    maxPlaylistNumberPerChannel: any;
    number: any;
    //textarea setting
    videos: any;
    description: any;
    //tab control
    flagKeyTab: string = 'tabKey1';
    flagSetTab: string = "tabSet1";

    constructor(private _eventService: EventService,
        private _playListService: PlayListService) {
        this.initSetting();
        var that = this;
        this.subs = _eventService.componentSaid$.subscribe(mess => {
            if (mess.talkTo === "rightComponent") {
                if (mess.mess === "get key list") {
                    that.setting = that.mySetting();
                    _eventService.componentSay(that.setting);
                }
                if (mess.mess === "successKey") {
                    that.moveKeyWord(mess.key, "keyUsing");
                }
                if (mess.mess === "failKey") {
                    that.moveKeyWord(mess.key, "keyPassing");
                }
                // if (mess.mess === "set cookie") {
                //     that.chanelId = mess.chanelId;
                //     that.getChanelId();
                // }
            }
        });
    }
    moveKeyWord(key: string, des: string) {
        $("#" + des)[0].value += (key + "\n");
        var names = $("#names")[0].value.split("\n");
        names.shift();
        $("#names")[0].value = names.join("\n");
    }
    mySetting() {
        var names = $("#names")[0].value.split("\n");
        names.forEach((value, index) => {
            if (value === "")
                names.splice(index, 1);
            else
                value = value.trim();
        })
        var searchVideoSetting = {
            "minResults": $("#minResults")[0].value,
            "maxResults": $("#maxResults")[0].value,
            "order": this.selectOrder.key,
            "publishedAfter": this.selectPublishedAfter.key,
            "videoDuration": this.selectVideoDuration.key,
            "videoDefinition": this.selectVideoDefinition.key,
            "eventType": this.selectEventType.key,
            "videoType": this.selectVideoType.key
        }
        var titleSetting = {
            "isAddRandomKeyWord": $("#isAddRandomKeyWord")[0].checked,
            "isAddRandomNumber": $("#isAddRandomNumber")[0].checked,
            "number": $("#number")[0].value,
            "isNeverDie": $("#isNeverDie")[0].checked,
            "concatKeyword": this.selectConcatKeyword.key
        };
        var descriptionSetting = {
            "isAddRandomVideoTitle": $("#isAddRandomVideoTitle")[0].checked,
            "isAutoAddDescription": $("#isAutoAddDescription")[0].checked,
            "description": $("#description")[0].value
        }
        var generalSetting = {
            "privacy": this.selectPrivacy.key,
            "language": this.selectLanguage.key,
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
        return mes;
    }
    ngOnInit() {
        $(".lined").linedtextarea(
            { selectedLine: 1 }
        );
        var userSetting = this.getCookie("userSetting");
        if (userSetting !== "") {
            this.setting = JSON.parse(userSetting);
            this.getSetting(this.setting);
            console.log(this.setting);
        }
    }
    getSetting(data) {
        data = data.data;
        /**
         * searchVideoSetting
         */
        this.minResults = data.searchVideoSetting.minResults;
        this.maxResults = data.searchVideoSetting.maxResults;
        this.selectOrder = this.listOrder.filter(subItem => subItem.key === data.searchVideoSetting.order)[0];
        this.selectPublishedAfter = this.listPublishedAfter.filter(subItem => subItem.key === data.searchVideoSetting.publishedAfter)[0];
        this.selectVideoDuration = this.listVideoDuration.filter(subItem => subItem.key === data.searchVideoSetting.videoDuration)[0];
        this.selectVideoDefinition = this.listVideoDefinition.filter(subItem => subItem.key === data.searchVideoSetting.videoDefinition)[0];
        this.selectEventType = this.listEventType.filter(subItem => subItem.key === data.searchVideoSetting.eventType)[0];
        this.selectVideoType = this.listVideoType.filter(subItem => subItem.key === data.searchVideoSetting.videoType)[0];
        /**
         * titleSetting
         */
        $("#isAddRandomKeyWord")[0].checked = data.titleSetting.isAddRandomKeyWord;
        $("#isAddRandomNumber")[0].checked = data.titleSetting.isAddRandomNumber;
        this.number = data.titleSetting.number;
        $("#isNeverDie")[0].checked = data.titleSetting.isNeverDie;
        this.selectConcatKeyword = this.listConcatKeyword.filter(subItem => subItem.key === data.titleSetting.concatKeyword)[0];
        /**
         * descriptionSetting
         */
        $("#isAddRandomVideoTitle")[0].checked = data.descriptionSetting.isAddRandomVideoTitle;
        $("#isAutoAddDescription")[0].checked = data.descriptionSetting.isAutoAddDescription;
        this.description = data.descriptionSetting.description;
        if (data.descriptionSetting.isAutoAddDescription)
            this.setDescriptRadio = "isAutoAddDescription";
        else
            this.setDescriptRadio = "isManualAddDescription";
        /**
         * generalSetting
         */
        this.selectPrivacy = this.listPrivacy.filter(subItem => subItem.key === data.generalSetting.privacy)[0];
        this.selectLanguage = this.listLanguage.filter(subItem => subItem.key === data.generalSetting.language)[0];
        this.maxPlaylistNumberPerChannel = data.generalSetting.maxPlaylistNumberPerChannel;
        $("#useAllKeyword")[0].checked = data.generalSetting.useAllKeyword;
        $("#skipSensitiveKeyword")[0].checked = data.generalSetting.skipSensitiveKeyword;
        $("#autoChangeChannel")[0].checked = data.generalSetting.autoChangeChannel;
        /**
         * insertVideoSetting
         */
        $("#noInsertVideo")[0].checked = data.insertVideoSetting.noInsertVideo;
        $("#yesInsertVideo")[0].checked = data.insertVideoSetting.yesInsertVideo;
        if (data.insertVideoSetting.noInsertVideo)
            this.setVideoRadio = "noInsertVideo";
        else
            this.setVideoRadio = "yesInsertVideo";
        this.videoNumber = data.insertVideoSetting.videoNumber;
        this.videos = data.insertVideoSetting.videos.join("\n");
        $("#autoChooseVideoID")[0].checked = data.insertVideoSetting.autoChooseVideoID;
        $("#addPositionRandom")[0].checked = data.insertVideoSetting.addPositionRandom;
        $("#insert1ID")[0].checked = data.insertVideoSetting.insert1ID;
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
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    onChangeLang(e) {
        console.log(e);
        var setting = this.mySetting();
        this.setCookie("userSetting", JSON.stringify(setting), 20);
        console.log(document.cookie);
    }
    btnResetDefaultSetting() {
        this.initSetting();
        this.setCookie("userSetting", "", 20);
    }
    initSetting() {
        this.setVideoRadio = "noInsertVideo";
        this.setDescriptRadio = "isManualAddDescription";
        this.listPrivacy = [
            { name: "Công khai", key: "public" },
            { name: "Không công khai", key: "unlisted" },
            { name: "Riêng tư", key: "private" }
        ];
        this.selectPrivacy = this.listPrivacy[0];

        this.listLanguage = [
            { name: "Tiếng Việt", key: "vietnamese" },
            { name: "English", key: "english" }
        ];
        this.selectLanguage = this.listLanguage[0];

        this.listOrder = [
            { name: "Mức độ liên quan đến từ khóa", key: "relevance" },
            { name: "Thời gian đăng mới nhất", key: "date" },
            { name: "Số view cao tới thấp", key: "viewCount" },
            { name: "Kênh nhiều video tới ít", key: "videoCount" },
            { name: "Đánh giá cao tới thấp", key: "rating" },
            { name: "Theo bảng chữ cái", key: "title" }
        ];
        this.selectOrder = this.listOrder[0];

        this.listPublishedAfter = [
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
        this.selectPublishedAfter = this.listPublishedAfter[0];

        this.listVideoDuration = [
            { name: "Không giới hạn", key: "any" },
            { name: "Ngắn hơn 4 phút", key: "short" },
            { name: "từ 4 đến 20 phút", key: "medium" },
            { name: "dài hơn 20 phút", key: "long" }
        ];
        this.selectVideoDuration = this.listVideoDuration[0];

        this.listVideoDefinition = [
            { name: "Mọi chất lượng", key: "any" },
            { name: "HD", key: "high" },
            { name: "Bình thường", key: "standard" }
        ];
        this.selectVideoDefinition = this.listVideoDefinition[0];

        this.listEventType = [
            { name: "Bất kỳ", key: "" },
            { name: "Đã live xong", key: "completed" },
            { name: "Đang live", key: "live" },
            { name: "Sẽ live", key: "upcoming" }
        ];
        this.selectEventType = this.listEventType[0];

        this.listVideoType = [
            { name: "Tất cả", key: "any" },
            { name: "Tập phim (episode)", key: "episode" },
            { name: "Full phim (movie)", key: "movie" }
        ];
        this.selectVideoType = this.listVideoType[0];

        this.listConcatKeyword = [
            { name: "Ký tự ngẫu nhiên", key: "ngaunhien" },
            { name: "Ký tự gạch dọc |", key: "doc" },
            { name: "Ký tự gạch dọc -", key: "ngang" },
            { name: "Ký tự tim ♥", key: "tim" },
            { name: "Ký tự ngã ~", key: "nga" },
            { name: "Ký tự sao *", key: "sao" },
            { name: "Không dùng", key: "" }
        ];
        this.selectConcatKeyword = this.listConcatKeyword[0];
        this.setting = {};
        this.minResults = 30;
        this.maxResults = 50;
        this.videoNumber = 10;
        this.maxPlaylistNumberPerChannel = 50;
        this.number = 4;
        this.videos = "";
        this.description = "";
    }
    tabControl(loc, tabId): void {
        if (loc === 'key')
            this.flagKeyTab = tabId;
        if (loc === 'set')
            this.flagSetTab = tabId;
    }
}
