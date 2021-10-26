import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { AppSettings, SessionUser, KnowledgeBaseCategories } from '../_models/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessengerService } from './messengerservice.service';
import { Socket } from 'ngx-socket-io';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class ChatBotService implements OnDestroy {
  _knowledgeBaseCategories: KnowledgeBaseCategories[] = [];
  _sessionUser: SessionUser;
  _conversation = [];
  _showChat = true;

  _knowledgeBaseCategoriesDataChanged = new EventEmitter();
  _chatToggled = new EventEmitter();
  _moduleDataChanged = new EventEmitter();

  // ---- //
  chatUser: {};
  onlineUsers = this.socket.fromEvent<string[]>('onlineUsers');
  newSupportMessage = this.socket.fromEvent<string[]>('newSupportMessage');
  userOnlineOffline = this.socket.fromEvent<string[]>('userOnlineOffline');
  userTypingChatBot = this.socket.fromEvent<string[]>('userTypingChatBot');
  // ---- //
  activeUsers = this.socket.fromEvent<string[]>('activeUsers');
  activeUserModules = {};
  // ---- //
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;


  constructor (
    private socket: Socket,
    private _mService: MessengerService,
    private _http: HttpClient,
    private _router: Router,
    private _authService: AuthService) {
    this._sessionUser = this._authService._sessionUser;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.AUTHSubscription.unsubscribe();
  }

  // ---- //
  signIn(user) {
    // console.log('signIn', user);

    this.chatUser = user;
    const chat = this._conversation;
    this.socket.emit('signIn', [user, chat]);
  }
  isTypingChatbot(sReciever_fkUserUID, SupportMessageSubjectUID) {
    this.socket.emit('isTypingChatbot', [sReciever_fkUserUID, SupportMessageSubjectUID]);
  }
  sendChat(msg: object) {
    this.socket.emit('sendChat', msg);
  }
  getOnlineUsers(sCompanyName) {
    this.socket.emit('getOnlineUsers', sCompanyName);
  }
  // ---- //

  toggleChat() {
    this._showChat = !this._showChat;
    this._chatToggled.emit();
  }

  getKnowledgeBaseCategories() {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'KnowledgeBase',
      'sFunction': 'getKnowledgeBaseCategories',
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._knowledgeBaseCategories = JSON.parse(JSON.stringify(result));
        this._knowledgeBaseCategoriesDataChanged.emit();
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getKnowledgeBaseCategories', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getKnowledgeBaseCategories'))
    );
  }

  getConversation(bSignIn) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SupportMessaging',
      'sFunction': 'getConversation',
      'SupportMessageSubjectUID': this._authService._sessionUser.SupportMessageSubjectUID,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._conversation = JSON.parse(JSON.stringify(result));
        if (bSignIn) {
          this.signIn(this._authService._sessionUser);
          this.getOnlineUsers(this._authService['sCompanyName']);
        }
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getConversation', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getConversation'))
    );
  }

  sendSupportMessage(message) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SupportMessaging',
      'sFunction': 'sendSupportMessage',
      'message': message,
      'P5Corp_userUID': this._authService._sessionUser.P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._conversation = JSON.parse(JSON.stringify(result));
        this.sendChat(message);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'sendSupportMessage', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'sendSupportMessage'))
    );
  }

  removeUploadedFile(doc, P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'SupportMessaging',
      'sFunction': 'removeUploadedFile',
      'deletedDoc': doc,
      'P5Corp_userUID': P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        // do something
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'removeUploadedFile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'removeUploadedFile'))
    );
  }


  // ////////////////////// //
  // Active Users Functions //
  // ////////////////////// //

  updateModule(mod, notifications) {
    this.activeUserModules[mod] = notifications;
    this._moduleDataChanged.emit();
  }

}