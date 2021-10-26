import { Component, OnDestroy, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { AuthService, ChatBotService } from '../../_services/index';
import { ChatBotMessage, AppSettings } from '../../_models/index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.page.html',
  styleUrls: ['./chat-box.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatBoxPage implements OnInit, OnDestroy {

  @Input() sizeOption: string;

  _selectedAppTab = '';
  _sessionUser: object;
  _showChat = true;
  _setUserDefaultImage = false;
  _hasHovered = false;
  _knowledgeBaseCategories = [];
  _kbCat = '';
  _kbQuestion = '';
  _conversation = [];
  _chatCardType = 'Braxton Support';
  _newMessage: ChatBotMessage = new ChatBotMessage();
  _bSupportOnline = false;
  _iSupportNotification = 0;

  _canPublish = true;
  _throttleTime = 2000; //2 seconds
  _clearInterval = 2500; //2.5 seconds
  _isUserTyping = false;
  _clearTimerId;
  _isLoading = true;

  private readonly onDestroy = new Subject<void>();
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private subscriptionE: Subscription;
  private subShowChat: Subscription;
  private _newSupportMessage: Subscription;
  private _userOnlineOffline: Subscription;
  private _onlineUsers: Subscription;
  private _userTypingChatBot: Subscription;

  constructor (
    public _authService: AuthService,
    private _chatBotService: ChatBotService
  ) {
    this.subscriptionE = this._chatBotService._knowledgeBaseCategoriesDataChanged.subscribe(value => this.setKnowledgeBaseCategories());
    this.subShowChat = this._chatBotService._chatToggled.subscribe(value => this.setShowChat());
  }

  ngOnInit() {
    this._selectedAppTab = this._authService._selectedAppTab.replace("/", "");
    this._knowledgeBaseCategories = this._chatBotService._knowledgeBaseCategories;
    this._conversation = this._chatBotService._conversation;
    this._sessionUser = this._authService._sessionUser;

    // ---- //
    this._newSupportMessage = this._chatBotService.newSupportMessage.subscribe(value => this.updateSupportChatFeed(value));
    this._onlineUsers = this._chatBotService.onlineUsers.subscribe(value => this.setOnlineUserList(value));
    this._userOnlineOffline = this._chatBotService.userOnlineOffline.subscribe(value => this.updateUserList(value));
    this._userTypingChatBot = this._chatBotService.userTypingChatBot.subscribe(value => this.userIsTyping(value));
    // ---- //

    // KnowledgeBase
    if (this._chatBotService._knowledgeBaseCategories.length === 0) {
      this._chatBotService.getKnowledgeBaseCategories()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setKnowledgeBaseCategories();
        });

    } else {
      this.setKnowledgeBaseCategories();
    }

    // Chat
    this._chatBotService.getConversation(true)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this.setSupportChat();
      });

    const that = this;
    setTimeout(() => {
      // if (!that._hasHovered) {
      this._chatBotService._showChat = true;
      that.toggleShowChat();
      // }
    }, 7000);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  setOnlineUserList(employeeList) {
    let isOnline = false;
    if (this._sessionUser['sCompanyName'] === 'Barrick') {
      if ('Barrick' in employeeList) {
        const indexSupp = employeeList['Barrick'].findIndex(x => x['userUID'] === '00000000-0000-0000-0000000000000000');

        if (indexSupp !== -1) {
          isOnline = employeeList[this._sessionUser['sCompanyName']][indexSupp]['bIsOnline'];
        }
      }
    } else {
      if ('Braxton' in employeeList) {
        const indexSupp = employeeList['Braxton'].findIndex(x => x['userUID'] === '00000000-0000-0000-0000000000000000');
        if (indexSupp !== -1) {
          isOnline = employeeList['Braxton'][indexSupp]['bIsOnline'];
        }
      } else if ('Braxton Live' in employeeList) {
        const indexSupp = employeeList['Braxton Live'].findIndex(x => x['userUID'] === '00000000-0000-0000-0000000000000000');
        if (indexSupp !== -1) {
          isOnline = employeeList['Braxton Live'][indexSupp]['bIsOnline'];
        }
      }
    }
    this._bSupportOnline = isOnline;
  }

  updateUserList(user) {
    if (user['userUID'] !== '00000000-0000-0000-0000000000000000') return;

    if (this._sessionUser['sCompanyName'] === 'Barrick' && user['sCompanyName'] === 'Barrick') {
      this._bSupportOnline = user['bIsOnline'];
    } else {
      this._bSupportOnline = user['bIsOnline'];
    }
  }

  updateSupportChatFeed(message) {
    if (message['sReciever_fkUserUID'] !== this._sessionUser['P5Corp_userUID']) return;

    if ((!this._showChat) || (this._showChat && this._chatCardType !== 'Braxton Support')) {
      this._iSupportNotification += 1;
    }

    this._chatBotService.getConversation(false)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._conversation = this._chatBotService._conversation;
      });
  }


  sendChat() {
    if (/^ *$/.test(this._newMessage['sMessage'])) {
      Swal.fire({
        text: 'Messagebox Cannot be empty!',
        icon: 'warning',
        showCloseButton: true,
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      }).then(function (dismiss) {
      }).catch();
    } else {
      this._chatBotService.sendSupportMessage(this._newMessage)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.setSupportChat();
        });
    }
  }

  userDefaultImg() {
    return this._setUserDefaultImage = true;
  }

  toggleShowChat() {
    this._chatBotService.toggleChat();
  }

  setShowChat() {
    if (this._chatCardType !== 'Braxton Support') {
      this._chatCardType = 'Knowledge Base';
      this.hideKnowledgeBase();
    } else if (!this._showChat && this._chatCardType === 'Braxton Support') {
      this._iSupportNotification = 0;
    }

    this._showChat = this._chatBotService['_showChat'];
  }

  // Chat //
  setSupportChat() {
    this._conversation = this._chatBotService._conversation;
    this._newMessage['SupportMessageSubjectUID'] = this._sessionUser['SupportMessageSubjectUID'];
    this._newMessage['sSender_fkUserUUID'] = this._sessionUser['P5Corp_userUID'];
    this._newMessage['sMessage'] = '';
    this._newMessage['organisationlbuuuid'] = this._sessionUser['P5ClientUID'];
    this._isLoading = false;
  }

  // KnowledgeBase //
  setKnowledgeBaseCategories() {
    this._knowledgeBaseCategories = this._chatBotService._knowledgeBaseCategories;
    this._kbCat = '';
    this._kbQuestion = '';
  }

  hideKnowledgeBase() {
    const knowledgeCard = document.getElementById('knowledge');
    const chatBlock = document.getElementById('chatBlock');

    if (this._chatCardType === 'Braxton Support') {
      knowledgeCard.style.display = 'block';
      chatBlock.style.display = 'none';
      this._chatCardType = 'Knowledge Base';
      this._iSupportNotification = 0;
    } else {
      knowledgeCard.style.display = 'none';
      chatBlock.style.display = 'block';
      this._chatCardType = 'Braxton Support';
    }
  }

  kbToggleCat(catID) {
    if (this._kbCat === catID) {
      this._kbCat = '';
    } else {
      this._kbCat = catID;
    }
  }

  kbToggleQuestion(questionID) {
    if (this._kbQuestion === questionID) {
      this._kbQuestion = '';
    } else {
      this._kbQuestion = questionID;
    }
  }

  userIsTyping(userSubject) {
    if (userSubject[1] === this._newMessage['SupportMessageSubjectUID'] && userSubject[0] === this._sessionUser['P5Corp_userUID']) {
      this._isUserTyping = true;
      if (this._clearTimerId) {
        clearTimeout(this._clearTimerId);
      }

      this._clearTimerId = setTimeout(() => {
        this._isUserTyping = false;
      }, this._clearInterval);
    }
  }

  chatKeyDown(event) {
    if (event.key === "Enter") {
      this.sendChat();
    }

    if (this._canPublish) {
      this._chatBotService.isTypingChatbot(this._newMessage['sReciever_fkUserUID'], this._newMessage['SupportMessageSubjectUID']);
      this._canPublish = false;
      setTimeout(() => {
        this._canPublish = true;
      }, this._throttleTime);
    }
  }

}
