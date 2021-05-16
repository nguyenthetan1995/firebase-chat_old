import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';
  username: string = '';
  users: {email:string; uid: string}[];
  currentUser: any;
  constructor(private chatService: ChatService, private router: Router,
    public menuCtrl: MenuController,
    private menu: MenuController) {
      // this.initializeApp();
  }

  ngOnInit() {
 /*    this.users */
    this.chatService.getListUsers().pipe().subscribe((res)=>{
      this.users = []
      this.currentUser =  this.chatService.getProfile();
      if(res.length != 0){
        for(let user of res){
          if(user.uid !==  this.currentUser.uid){
            this.users.push(user);
          }
        }
      }
    })
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }
  selectUser(item){
    this.chatService.userSelected(item);
    this.router.navigateByUrl('/message', { replaceUrl: true });
  }
  toggleMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
}
