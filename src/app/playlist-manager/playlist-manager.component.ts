import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { PlayListService } from '../services/playlist.service';

@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager.component.html',
  styleUrls: ['./playlist-manager.component.css']
})
export class PlaylistManagerComponent implements OnInit {
  listPLL = [
    "UC6rVB-_0m1hsn9iEp0YUtng",
    "Audiobook Harry Potter (12dsdzcseUdseE)",
    "Audiobook Harry Potter (12dsdzcseUdseE)"
  ]
  selectPLL = this.listPLL[0];

  listCount = ["25", "50", "100", "1000"];
  countView = this.listCount[0];

  listVideo = [];
  prevClick: number;
  constructor(
    private service: EventService
  ) { }

  ngOnInit() {
  }

  viewPlaylist() {
    this.listVideo = [];
    this.service.get("http://FastY2B.com:8081/youtube/getPlaylistsListByChannelId?channelId=" + this.selectPLL + "&maxResults=" + this.countView).subscribe(res => {
      console.log(JSON.parse(res._body));
      var listData = JSON.parse(res._body);
      if (listData.code === 400) {
        this.handleError(JSON.parse(listData.message).message);
        return;
      }
      listData = listData.data.items;
      listData.forEach(item => {
        this.listVideo.push({
          thumbnails: item.snippet.thumbnails.default.url,
          title: item.snippet.title,
          itemCount: item.contentDetails.itemCount,
          dateUpdate: new Date(item.snippet.publishedAt.value),
          link: item.id,
          check: false
        });
      });
      console.log(this.listVideo);
    }, err => {
      this.handleError("Can't get playlist");
    });
  }

  selectVideo(item, index, $event) {
    console.log(index);
    item.check = !item.check;
    if ($event.shiftKey) {
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

  sort(option: string) {
    switch (option) {
      case "countVideo":
        this.listVideo.sort(function (a, b) {
          return Number(a.itemCount) - Number(b.itemCount);
        });
        break;

      default:
        break;
    }
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
