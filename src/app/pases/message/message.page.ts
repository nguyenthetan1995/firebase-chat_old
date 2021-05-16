import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';
  username: string = '';
  users: {email:string; uid: string}[];
  currentUser: any;
  constructor(private chatService: ChatService, private router: Router) {

  }

  ngOnInit() {
 /*    this.users */
    this.chatService.getListUsers().pipe().subscribe((res)=>{
      this.users = []
      this.currentUser =  this.chatService.getProfile();

    })
    this.messages = this.chatService.getChatMessages();
    console.log(this.messages);
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  back() {
    this.router.navigateByUrl('/chat', { replaceUrl: true });
  }

}
