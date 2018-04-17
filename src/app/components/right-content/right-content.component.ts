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
        { name: "Mức độ liên quan đến từ khóa", key: "sort1" },
        { name: "Thời gian đăng mới nhất", key: "sort2" },
        { name: "Số view cao tới thấp", key: "sort3" },
        { name: "Kênh nhiều video tới ít", key: "sort4" },
        { name: "Đánh giá cao tới thấp", key: "sort5" },
        { name: "Theo bảng chữ cái", key: "sort6" }
    ];
    selectedSort = this.sortVideo[0];

    uploadTime = [
        { name: "Không xác định", key: "sort1" },
        { name: "Hôm nay", key: "sort2" },
        { name: "3 ngày gần đây", key: "sort3" },
        { name: "7 ngày gần đây", key: "sort4" },
        { name: "15 ngày gần đây", key: "sort5" },
        { name: "1 tháng gần đây", key: "sort6" },
        { name: "3 tháng gần đây", key: "sort7" },
        { name: "6 tháng gần đây", key: "sort8" },
        { name: "1 năm gần đây", key: "sort9" }
    ];
    selectedUpload = this.uploadTime[0];

    viewTime = [
        { name: "Không giới hạn", key: "sort1" },
        { name: "Hôm nay", key: "sort2" },
        { name: "3 ngày gần đây", key: "sort3" },
        { name: "7 ngày gần đây", key: "sort4" },
        { name: "15 ngày gần đây", key: "sort5" },
    ];
    selectedTime = this.viewTime[0];

    qualityVideo = [
        { name: "Mọi chất lượng", key: "sort1" },
        { name: "HD", key: "sort2" },
        { name: "Bình thường", key: "sort3" }
    ];
    selectedQuality = this.qualityVideo[0];

    liveVideo = [
        { name: "Bất kỳ", key: "sort1" },
        { name: "Đã live xong", key: "sort2" },
        { name: "Đang live", key: "sort3" },
        { name: "Sẽ live", key: "sort4" }
    ];
    selectedLive = this.liveVideo[0];

    styleVideo = [
        { name: "Tất cả", key: "sort1" },
        { name: "Tập phim (episode)", key: "sort2" },
        { name: "Full phim (movie)", key: "sort3" }
    ];
    selectedStyle = this.styleVideo[0];
    listKeys = "test thu xem\nnhu the nao la duoc\ndi choi ko em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em\nvui len di em";
    listKeysUsed = "mieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke\nmieu ta mot hang ke";
    idVideo = "ob3RvLmpwZyIsImdpdmVuX25h\nuZyBxdWF5IiwiZmFtaWx5X25\niLCJsb2NhbGUiOiJ2aSJ9";

    setVideoRadio = "true";

    constructor(private _eventService: EventService,
        private _playListService: PlayListService) {
        this.subs = _eventService.componentSaid$.subscribe(mess => {
            if (mess.talkTo === "rightComponent")
                if (mess.mess === "get key list") {
                    var mes = {
                        talkTo: "leftComponent",
                        mess: "get key list",
                        data: {
                            keys: this.listKeys
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
