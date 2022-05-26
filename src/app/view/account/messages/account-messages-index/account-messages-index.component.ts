import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AccountMessagesService} from "../account-messages.service";
import {IMessage} from "../../../../interfaces/messages/IMessage";

@Component({
  selector: 'app-account-messages-index',
  templateUrl: './account-messages-index.component.html',
  styleUrls: ['./account-messages-index.component.scss']
})
export class AccountMessagesIndexComponent implements OnInit {

  constructor(private route: ActivatedRoute, private messageService: AccountMessagesService) {
  }


  activeMessage?: IMessage;


  messages: IMessage[] = [
    {id: 1, text: '1', email: '1', user_guid: 'efe1', title: 'title1'},
    {id: 2, text: '2', email: '2', user_guid: 'efe2', title: 'title2'},
    {id: 3, text: '3', email: '3', user_guid: 'efe3', title: 'title3'},
  ];


  ngOnInit(): void {

    this.messageService.messageUpdateEvent.subscribe({
      next: () => {
        this.activeMessage = this.messageService.message
      }
    })

  }


  setActiveElement(item: IMessage) {
    this.activeMessage = item;
    this.messageService.message = item;
    this.messageService.messageUpdateEvent.emit();
  }
}
