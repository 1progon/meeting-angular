import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AccountMessagesService} from "../account-messages.service";
import {IMessage} from "../../../../interfaces/messages/IMessage";

@Component({
  selector: 'app-account-message-show',
  templateUrl: './account-messages-show.component.html',
  styleUrls: ['./account-messages-show.component.scss']
})
export class AccountMessagesShowComponent implements OnInit {
  @Input() message?: IMessage;

  constructor(private route: ActivatedRoute, private messageService: AccountMessagesService) {
  }

  unsetActiveMessage() {
    this.messageService.message = <IMessage>{};
    this.messageService.messageUpdateEvent.emit()
  }

  ngOnInit(): void {
    this.message = this.messageService.message;

    this.messageService.messageUpdateEvent.subscribe({
      next: () => {
        this.message = this.messageService.message
      }
    })
  }

}
