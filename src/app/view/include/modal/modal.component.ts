import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() title = "Title";
  @Input() text = "Long text";
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor() {
  }

  isShow = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.isShow = true;

    }, 0)
  }

  closeModal() {
    this.isShow = false;
    setTimeout(() => {
      this.closeModalEvent.emit(false)
    }, 150)


  }


}
