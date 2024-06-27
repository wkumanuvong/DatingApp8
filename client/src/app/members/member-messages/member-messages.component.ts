import {
  AfterViewChecked,
  Component,
  ViewChild,
  inject,
  input,
} from '@angular/core';
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
export class MemberMessagesComponent implements AfterViewChecked {
  @ViewChild('messageForm') messageForm?: NgForm;
  @ViewChild('scrollMe') scrollContainer?: any;
  messageService = inject(MessageService);
  username = input.required<string>();
  messageContent = '';
  loading = false;

  sendMessage() {
    this.loading = true;
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .then(() => {
        this.messageForm?.reset();
        this.scrollToBottom();
      })
      .finally(() => (this.loading = false));
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
