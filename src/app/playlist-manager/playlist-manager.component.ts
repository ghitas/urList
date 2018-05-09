import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager.component.html',
  styleUrls: ['./playlist-manager.component.css']
})
export class PlaylistManagerComponent implements OnInit {
  listPLL = [
    "Audiobook Harry Potter (12dsdzcseUdseE)",
    "Audiobook Harry Potter (12dsdzcseUdseE)",
    "Audiobook Harry Potter (12dsdzcseUdseE)"
  ]
  selectPLL = this.listPLL[0];
  constructor() { }

  ngOnInit() {
  }

}
