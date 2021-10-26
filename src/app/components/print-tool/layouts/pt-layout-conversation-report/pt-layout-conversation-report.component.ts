import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { AuthService, ConversationService, LoaderService } from '../../../../_services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PrintToolContent } from '../../print-tool';

@Component({
  selector: 'app-pt-layout-conversation-report',
  templateUrl: './pt-layout-conversation-report.component.html',
  styleUrls: ['./pt-layout-conversation-report.component.scss']
})
export class LayoutConversationFeedComponent implements OnInit, OnDestroy {

  @Input() _coverData = {};
  @Input() _contentData: PrintToolContent;
  @Output() backHandler: EventEmitter<any> = new EventEmitter<any>();

  _navStatus = '';

  private readonly onDestroy = new Subject<void>();

  constructor (
    public _authService: AuthService,
    private _conversationService: ConversationService,
    private _loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this._navStatus = this._authService['_verticalNavType'];
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  goBack(): void {
    this.backHandler.emit();
  }

  printPDFReport() {
    this._loaderService.initLoader(true);
    this._conversationService.printConversationFeed(this._contentData)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }
}
