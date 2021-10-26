import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { AppSettings, SessionUser, UserData } from '../_models/index';
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
export class ConversationService implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private AUTHSubscription: Subscription;

  // ---- //
  onlineUsers = this.socket.fromEvent<string[]>('onlineUsers');
  userOnlineOffline = this.socket.fromEvent<string[]>('userOnlineOffline');
  newConversationMessage = this.socket.fromEvent<string[]>('newConversationMessage');
  userTypingCoach = this.socket.fromEvent<string[]>('userTypingCoach');
  // ---- //

  _sessionUser: SessionUser;
  _userData: UserData = new UserData();
  _conversationCategories = [];
  _subjects = [];
  _conversationSubjectsUID = '';
  _conversationFeed = [];
  _conversationFeedCat = [];
  _conversationPDFData = {};
  _latestConversation = [];
  _bSubjectUpdated = [];


  constructor(
    private socket: Socket,
    private _mService: MessengerService,
    private _http: HttpClient,
    private _router: Router,
    public _authService: AuthService) {
    this._sessionUser = this._authService._sessionUser;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.AUTHSubscription.unsubscribe();
  }

  // REALTIME FUNCTIONS //
  //_______START____________//
  getOnlineUsers(sCompanyName) {
    this.socket.emit('getOnlineUsers', sCompanyName);
  }

  sendMessage(sCompanyName, conversation) {
    this.socket.emit('sendMessage', [sCompanyName, conversation]);
  }

  isTypingCoach(sReciever_fkUserUID, ConversationSubjectsUID) {
    this.socket.emit('isTypingCoach', [sReciever_fkUserUID, ConversationSubjectsUID]);
  }
  //________END___________//
  updateSessionUser(value) {
    this._sessionUser = this._authService._sessionUser;
  }

  getUserData(P6_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'getUserData',
      'P6_userUID': P6_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._userData = JSON.parse(JSON.stringify(result));
        this.getOnlineUsers(this._sessionUser['sCompanyName']);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getUserData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getUserData'))
    );
  }

  getConversationCategories(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'getConversationCategories',
      'P5Corp_userUID': P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._conversationCategories = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getConversationCategories', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getConversationCategories'))
    );
  }

  getCategorieSubjects(conversation) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'getCategorieSubjects',
      'conversation': conversation
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._subjects = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getCategorieSubjects', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getCategorieSubjects'))
    );
  }

  getConversation(conversation) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'getConversation',
      'conversation': conversation
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._conversationFeed = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getConversation', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getConversation'))
    );
  }

  getPDFConversationData(pdfData) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'getPDFConversationData',
      'pdfData': pdfData
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._conversationPDFData = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getPDFConversationData', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getPDFConversationData'))
    );
  }



  saveSubject(conversation, subject, P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'saveSubject',
      'conversation': conversation,
      'subject': subject,
      'P5Corp_userUID': P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._conversationSubjectsUID = JSON.parse(JSON.stringify(result));
        conversation['ConversationSubjectsUID'] = this._conversationSubjectsUID;
        this.sendMessage(this._sessionUser['sCompanyName'], conversation);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveSubject', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveSubject'))
    );
  }


  saveConversation(conversation, message, P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'saveConversation',
      'conversation': conversation,
      'message': message,
      'P5Corp_userUID': P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._conversationFeed = JSON.parse(JSON.stringify(result));
        this.sendMessage(this._sessionUser['sCompanyName'], conversation);
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'saveConversation', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'saveConversation'))
    );
  }

  updateSubject(subjectObj) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'UpdateSubjectHeading',
      'subjectObj': subjectObj
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._bSubjectUpdated = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'updateSubject', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'updateSubject'))
    );
  }

  removeUploadedFile(doc, P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'removeUploadedFile',
      'deletedDoc': doc,
      'P5Corp_userUID': P5Corp_userUID
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        // test
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'removeUploadedFile', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'removeUploadedFile'))
    );
  }

  printConversationFeed(pdfData) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'pdfData': pdfData,
      'sFunction': 'printConversationFeed',
    });

    const downloadWindow = window.open('about:blank');
    var doc = downloadWindow.document;
    doc.open("text/html");
    doc.write("<br><br><br><br><center><h2 style='color: #8d9098;'>Please wait while your PDF is downloading...</h2></center>");

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        const sURL = JSON.parse(JSON.stringify(result));
        downloadWindow.location.href = sURL;
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'printConversationFeed', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'printConversationFeed'))
    );
  }

  getLatestConversationForCat(P5Corp_userUID, category) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'getLatestConversationForCat',
      'P5Corp_userUID': P5Corp_userUID,
      category
    });

    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._conversationFeedCat = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getLatestConversationForCat', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getLatestConversationForCat'))
    );
  }

  getLatestConversation(P5Corp_userUID) {
    const bodyString = JSON.stringify({
      'peformaxToken': AppSettings.PEFORMAX_TOKEN,
      'sModule': 'Conversation',
      'sFunction': 'getLatestConversation',
      'P5Corp_userUID': P5Corp_userUID
    });
    return this._http.post(AppSettings.API_ENDPOINT, bodyString, httpOptions).pipe(
      map((result: any) => {
        this._latestConversation = JSON.parse(JSON.stringify(result));
      }),
      tap(_ => this._mService.handleTap(this.constructor.name, 'getLatestConversation', bodyString)),
      catchError(this._mService.handleError<any>(this.constructor.name, 'getLatestConversation'))
    );
  }

}
