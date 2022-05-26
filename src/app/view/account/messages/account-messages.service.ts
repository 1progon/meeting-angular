import {EventEmitter, Injectable, Output} from '@angular/core';
import {IMessage} from "../../../interfaces/messages/IMessage";

@Injectable({
  providedIn: 'root'
})
export class AccountMessagesService {
  @Output() messageUpdateEvent = new EventEmitter();


  constructor() {
  }

  private _message: IMessage = <IMessage>{};

  get message(): IMessage {
    return this._message;
  }

  set message(message: IMessage) {
    this._message = message;
  }

}
