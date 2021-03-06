import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { switchMap, map, tap } from 'rxjs/operators';
import { Observable,BehaviorSubject } from 'rxjs';

export interface User {
  uid: string;
  email: string;
}
export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  userSelect: User
  currentUser: User = null;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
      // debugger
    });
  }
  Filter1$: BehaviorSubject<string|null>;
  Filter2$: BehaviorSubject<string|null>;
  async signup({ email, password }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    const uid = credential.user.uid;

    return this.afs.doc(
      `users/${uid}`
    ).set({
      uid,
      email: credential.user.email,
    })
  }

  signIn({ email, password }) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
  getProfile() {
    return this.currentUser;
  }
  getListUsers() {
    return this.getUsers();
  }
  userSelected(user) {
    this.userSelect = user;
  }
  addChatMessage(msg) {
    
    return this.afs.collection('messages').add({
      msg: msg,
      from: this.currentUser.uid,
      to: this.userSelect.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  getChatMessages() {
    let users = [];
    var db = firebase.firestore();
    
    return this.getUsers().pipe(
      switchMap((res) => {
        users.push(this.userSelect);
        users.push({uid:this.currentUser.uid, email:this.currentUser.email });
        var a = res;

        return this.afs.collection('messages',(ref) =>{
            let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query = query.where('from', 'in', [this.currentUser.uid,this.userSelect.uid] ) ;
            let query2 : firebase.firestore.CollectionReference | firebase.firestore.Query =query
            query2 = query2.limit(30);
            return query2;
        }
        ).valueChanges() as Observable<Message[]>;
      }),
      map( messages => {
        // Get the real name for each user
        messages = messages.filter((mess:any) =>{
          if(mess.to === this.userSelect.uid || mess.to === this.currentUser.uid){
            return mess;
          }
        });
        for (let m of messages) {
          m.fromName = this.getUserForMsg(m.from, users);
          m.myMsg = this.currentUser.uid === m.from;
        }
        return messages
      })
    )
  }

  private getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }
  private getUserForMsg(msgFromId, users: User[]): string {
    for (let usr of users) {
      if (usr.uid == msgFromId) {
        return usr.email;
      }
    }
    return 'Deleted';
  }
}
