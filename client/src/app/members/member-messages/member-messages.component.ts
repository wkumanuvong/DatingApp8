import { Component, ViewChild, inject, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from '../../_services/message.service';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css',
  imports: [TimeagoModule, FormsModule],
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  messageService = inject(MessageService);
  username = input.required<string>();
  messageContent = '';

  sendMessage() {
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .then(() => {
        this.messageForm?.reset();
      });
  }
}
