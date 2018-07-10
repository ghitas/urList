import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { EventService } from '../services/event.service';
import { PlayListService } from '../services/playlist.service';
declare var jquery: any;
declare var $: any;

@Component({
	selector: 'app-app-modal',
	templateUrl: './app-modal.component.html',
	styleUrls: ['./app-modal.component.css']
})
export class AppModalComponent implements OnDestroy {
	dialog = {
		title: "title",
		content: "content",
		btnYN: false,
		access: {
			yes: "none",
			no: "none",
			choose: "none"
		}
	}
	playlist = {
		title: "title",
		description: "descripttion"
	}
	subs = new Subscription;
	messInfo: any;
	constructor(
		private service: EventService, 
		private elRef: ElementRef,
		public playListService: PlayListService
	) {
		this.subs = service.componentSaid$.subscribe(mess => {
			if (mess.talkTo === 'dialog' && mess.mess === "edit playlist") {
				$("#modal").modal("hide");
				$("#modalEditPlaylist").modal("show");
				this.playlist = mess.data;
			} else if (mess.talkTo === 'dialog') {
				this.messInfo = mess;
				this.dialog = mess.data;
				this.show();
			}
		});
	}
	public visible = false;
	private visibleAnimate = false;
	ngOnDestroy() {
		this.subs.unsubscribe();
	}

	btnYes() {
		var mess = {
			talkTo: this.messInfo.from,
			mess: this.messInfo.mess,
			accept: "yes"
		}
		this.service.componentSay(mess);
		$("#modal").modal("hide");
	}
	public show(): void {
		$("#modal").modal("show");
	}

	public hide(choose: string): void {
		this.visibleAnimate = false;
		setTimeout(() => {
			this.visible = false;
			this.dialog.access.choose = choose;
			this.service.dialogSay(this.dialog.access);
		}, 100);
	}

	public onContainerClicked(event: MouseEvent): void {
		if ((<HTMLElement>event.target).classList.contains('modal')) {
		}
	}
}
