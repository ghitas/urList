import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { PlayListService } from '../services/playlist.service';
declare var $: any;

@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager.component.html',
  styleUrls: ['./playlist-manager.component.css']
})
export class PlaylistManagerComponent implements OnInit {
  listPLL = []
  selectPLL = this.listPLL[0];

  listCount = ["25", "50", "100", "1000"];
  countView = this.listCount[0];

  listVideo = [];
  prevClick: number;
  flagCheckAll: boolean = false;
  flagIcreaseVideo = false;
  flagIcreaseView = false;
  prevPageToken: string;
  nextPageToken: string;
  pageToken: string = "";

  constructor(
    private service: EventService
  ) { }

  ngOnInit() {
    $(".lined").linedtextarea(
      { selectedLine: 1 }
    );
    var listPLL = this.service.getCookie("userChannel");
    if (listPLL !== "") {
      this.listPLL = JSON.parse(this.service.getCookie("userChannel")).data;
      this.selectPLL = this.listPLL[0];
    }
  }

  changePlaylist(e) {
    this.selectPLL = e;
  }
  viewPlaylist() {
    this.listVideo = [];
    debugger;
    this.service.get(this.service.nm_domain + this.service.nm_viewPlaylist + "?channelId=" + this.selectPLL.channelId + "&maxResults=" + this.countView + "&pageToken=" + this.pageToken).subscribe(res => {
      console.log(JSON.parse(res._body));
      var listData = JSON.parse(res._body);
      if (!listData) return;
      if (listData.data["prevPageToken"] !== null)
        this.prevPageToken = listData.data.prevPageToken;
      if (listData.data["nextPageToken"] !== null)
        this.nextPageToken = listData.data.nextPageToken;
      if (listData.code === 0) {
        listData = listData.data.items;
        listData.forEach(item => {
          this.listVideo.push({
            thumbnails: item.snippet.thumbnails.default.url,
            title: item.snippet.title,
            description: item.snippet.description,
            itemCount: item.contentDetails.itemCount,
            dateUpdate: new Date(item.snippet.publishedAt.value),
            link: item.id,
            check: false,
            view: Number(item.etag.substring(1, item.etag.length - 1))
          });
        });
      } else {
        this.handleError(listData.message);
        return;
      }

    }, err => {
      this.handleError("Can't get playlist");
    });
  }

  selectVideo(item, index, $event) {
    console.log(index);
    item.check = !item.check;
    if ($event.shiftKey) {
      if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
          window.getSelection().removeAllRanges();
        }
      }
      if (index <= this.prevClick) {
        for (var i = index; i < this.prevClick; i++) {
          this.listVideo[i].check = this.listVideo[this.prevClick].check;
        }
      } else if (index > this.prevClick) {
        for (var j = this.prevClick; j < index; j++) {
          this.listVideo[j].check = this.listVideo[this.prevClick].check;
        }
      }
    }
    this.prevClick = index;
  }

  cboxCheckAll() {
    if (this.flagCheckAll) {
      this.listVideo.forEach(item => {
        item.check = true;
      });
    } else {
      this.listVideo.forEach(item => {
        item.check = false;
      });
    }
  }
  btnDelAll() {
    var delList = [];
    this.listVideo.forEach((item, index) => {
      if (item.check) {
        delList.push({
          item: item,
          index: index
        });
      }
    });
    delList.sort(function (a, b) {
      return Number(b.index) - Number(a.index);
    });
    var that = this;
    (function loop(l) {
      const promise = new Promise((resolve, reject) => {
        var url = that.service.nm_domain + that.service.nm_delPlaylist + "?channelId=" + that.selectPLL.channelId + "&playlistId=" + delList[l].item.link;
        that.service.delete(url).subscribe(res => {
          console.log(res);
          resolve();
        },
          err => {
            console.log(err);
            reject();
          }
        )
      }).then(() => {
        if (l < delList.length) {
          that.listVideo.splice(delList[l].index, 1);
          if (l < delList.length - 1)
            loop(l + 1);
        }
      }).catch(err => that.handleError("Can't delete"));
    })(0);
  }
  delPlaylist(item, index) {
    console.log(item);
    var url = this.service.nm_domain + this.service.nm_delPlaylist + "?channelId=" + this.selectPLL.channelId + "&playlistId=" + item.link;
    this.service.delete(url).subscribe(res => {
      console.log(res);
      this.listVideo.splice(index, 1);
    }
      , err => {
        this.handleError("Can't delete");
      });
  }

  editPlaylist(item, index) {
    var mess = {
      talkTo: "dialog",
      mess: "edit playlist",
      data: item
    }
    this.service.componentSay(mess);
  }

  sort(option: string) {
    switch (option) {
      case "countVideo":
        this.flagIcreaseVideo = !this.flagIcreaseVideo;
        if (this.flagIcreaseVideo)
          this.listVideo.sort(function (a, b) {
            return Number(a.itemCount) - Number(b.itemCount);
          });
        else
          this.listVideo.sort(function (b, a) {
            return Number(a.itemCount) - Number(b.itemCount);
          });
        break;
      case "view":
        this.flagIcreaseView = !this.flagIcreaseView;
        if (this.flagIcreaseView)
          this.listVideo.sort(function (a, b) {
            return Number(a.view) - Number(b.view);
          });
        else
          this.listVideo.sort(function (b, a) {
            return Number(a.view) - Number(b.view);
          });
        break;
      default:
        break;
    }
  }

  btnPrevPageList() {
    this.pageToken = this.prevPageToken;
    this.viewPlaylist();
  }
  btnNextPageList() {
    this.pageToken = this.nextPageToken;
    this.viewPlaylist();
  }

  handleError(error: string) {
    var mess = {
      talkTo: "dialog",
      data: {
        title: "Warning",
        content: error
      }
    }
    this.service.componentSay(mess);
  }

}



// WEBPACK FOOTER //
// ./src/app/playlist-manager/playlist-manager.component.ts