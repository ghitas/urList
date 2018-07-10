import { Injectable } from '@angular/core';
declare var $: any;

@Injectable()
export class PlayListService {
  modalInfo = {
    title: "title",
    content: "content"
  };
  modalConfirm = {
    title: "title",
    content: "content",
    accept: function () {
      $("#modalConfirm").modal("hide");
      return true;
    }
  };
  constructor() { }
  showInfo() {
    $("#modalInfo").modal("show");
  }
}
