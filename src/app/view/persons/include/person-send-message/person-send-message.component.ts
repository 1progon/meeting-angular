import {Component, OnInit} from '@angular/core';
import {PersonsService} from "../../../../services/persons/persons.service";

@Component({
  selector: 'app-person-send-message',
  templateUrl: './person-send-message.component.html',
  styleUrls: ['./person-send-message.component.scss']
})
export class PersonSendMessageComponent implements OnInit {

  constructor(private personsService: PersonsService) {
  }

  isSending = false;

  form: {
    name?: string;
    email?: string;
    message?: string;
    phone?: string;

  } = {}

  ngOnInit(): void {
  }

  submit() {

    this.isSending = true;

    this.personsService
      .sendMessage(this.form)
      .subscribe({
        next: response => {
          console.log(response)

        }, error: err => {
          console.error(err)
        }
      })
      .add(() => {
        this.isSending = false;
      })
  }
}
