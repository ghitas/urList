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
    langs = [
        { name: "Tiếng Việt", key: "vn" },
        { name: "English", key: "en" }
    ];
    selectedLang = this.langs[0];
    sortVideo = [
        { name: "Mức độ liên quan đến từ khóa", key: "relevance" },
        { name: "Thời gian đăng mới nhất", key: "date" },
        { name: "Số view cao tới thấp", key: "viewCount" },
        { name: "Kênh nhiều video tới ít", key: "videoCount" },
        { name: "Đánh giá cao tới thấp", key: "rating" },
        { name: "Theo bảng chữ cái", key: "title" }
    ];
    selectedSort = this.sortVideo[0];

    uploadTime = [
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
    selectedUpload = this.uploadTime[0];

    viewTime = [
        { name: "Không giới hạn", key: "any" },
        { name: "Ngắn hơn 4 phút", key: "short" },
        { name: "từ 4 đến 20 phút", key: "medium" },
        { name: "dài hơn 20 phút", key: "long" }
    ];
    selectedTime = this.viewTime[0];

    qualityVideo = [
        { name: "Mọi chất lượng", key: "any" },
        { name: "HD", key: "high" },
        { name: "Bình thường", key: "standard" }
    ];
    selectedQuality = this.qualityVideo[0];

    liveVideo = [
        { name: "Bất kỳ", key: "" },
        { name: "Đã live xong", key: "completed" },
        { name: "Đang live", key: "live" },
        { name: "Sẽ live", key: "upcoming" }
    ];
    selectedLive = this.liveVideo[0];

    styleVideo = [
        { name: "Tất cả", key: "any" },
        { name: "Tập phim (episode)", key: "episode" },
        { name: "Full phim (movie)", key: "movie" }
    ];
    selectedStyle = this.styleVideo[0];
    listKeys = "test thu xem\nnhu the nao la duoc\ndi choi ko em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em";
    listKeysUsed = "mieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke";
    idVideo = "ob3RvLmpwZyIsImdpdmVuX25h\nuZyBxdWF5IiwiZmFtaWx5X25\niLCJsb2NhbGUiOiJ2aSJ9";

    setVideoRadio = "true";

    constructor(
        private _eventService: EventService,
        private _playListService: PlayListService
    ) {
        var that = this;
        this.subs = _eventService.componentSaid$.subscribe(mess => {
            if (mess.talkTo === "rightComponent")
                if (mess.mess === "get key list") {
                    var key = (<HTMLInputElement>document.getElementById("areaKey")).value;
                    var searchVideoSetting = {
                        "minResults": (<HTMLInputElement>document.getElementById("setV_min_result")).value,
                        "maxResults": (<HTMLInputElement>document.getElementById("setV_max_result")).value,
                        "order": that.selectedSort.key,
                        "publishedAfter": that.selectedUpload.key,
                        "videoDuration": that.selectedTime.key,
                        "videoDefinition": that.selectedQuality.key,
                        "eventType": that.selectedLive.key,
                        "videoType": that.selectedStyle.key
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
        });
    }
    ngOnInit() {
        $(".lined").linedtextarea(
            { selectedLine: 1 }
        );
        this.colArea = 50;
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
