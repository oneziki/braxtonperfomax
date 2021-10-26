import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './components/shared.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Drivers, Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';

import { MyMaxPopComponent } from "./components/popovers/mymax-pop/mymax-pop.component";

// Node Server
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: environment.realTimeEndPoint, options: {} };

// Services
import {
  AuthService,
  KraService,
  AuthGuardService,
  LoaderService,
  MessengerService,
  StorageService,
  PostService,
  ExitInterviewService,
  EsurveyService,
  ExpertiseReviewService,
  ThreeSixtyService,
  ResourcesService,
  SurveyAssessmentService,
  ConversationService,
  EmployeeDirectoryService,
  JobTitleRoleProfileService,
  OrganogramService,
  SupportService,
  MyMax7Service,
  ContributionScorecardService,
  KraReviewService,
  PrintToolService,
  SWOTAnalysisService,
  KraPdpService,
  RecruitmentService,
  ChooseQuestionnaireService,
  TrainingService,
  PersonalPortfolioService,
  ChatBotService,
  NotificationService,
} from './_services/index';

// PRINTER-TOOL
import { PrintToolPage } from './components/print-tool/print-tool.page';
// PRINTER-TOOL - LAYOUTS
import {

  // LayoutAdminGenericComponent,
  LayoutEsurveyAssessmentComponent,
  LayoutPerformanceReviewsComponent,
  LayoutPerformanceAgreementsComponent,
  LayoutThreesixtyReportsComponent,
  // LayoutPeriodSummaryComponent,
  LayoutSwotReportComponent,
  LayoutPDPReportComponent,
  LayoutIntegratedPDPReportComponent,
  LayoutExpertiseReviewReportsComponent,
  // LayoutSelfAssessmentReportsComponent,
  LayoutChooseQuestionnaireComponent,
  LayoutConversationFeedComponent,
  // LayoutSafetyMetricComponent,
  LayoutPersonalPortfolioComponent,
  LayoutExitInterviewReportsComponent,
  // LayoutCompanyScorecardComponent,
  LayoutContributionScorecardComponent,
  LayoutRecruitmentReportsComponent,

} from './components/print-tool/layouts';

import { environment } from '../environments/environment';

import { DataTablesModule } from 'angular-datatables';

// Azure
import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import {
  MsalService,
  MSAL_INSTANCE,
} from '@azure/msal-angular';
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azureApplicationID, //Application ID
      authority: environment.azureTenantID, //Tenant ID
      redirectUri: environment.azureRedirectURI
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

@NgModule({
  declarations: [AppComponent,
    PrintToolPage,
    // LayoutAdminGenericComponent,
    LayoutEsurveyAssessmentComponent,
    LayoutPerformanceReviewsComponent,
    LayoutPerformanceAgreementsComponent,
    LayoutThreesixtyReportsComponent,
    // LayoutPeriodSummaryComponent,
    LayoutSwotReportComponent,
    LayoutPDPReportComponent,
    LayoutIntegratedPDPReportComponent,
    LayoutExpertiseReviewReportsComponent,
    // LayoutSelfAssessmentReportsComponent,
    LayoutChooseQuestionnaireComponent,
    LayoutConversationFeedComponent,
    // LayoutSafetyMetricComponent,
    LayoutPersonalPortfolioComponent,
    LayoutExitInterviewReportsComponent,
    // LayoutCompanyScorecardComponent,
    LayoutContributionScorecardComponent,
    LayoutRecruitmentReportsComponent,
    MyMaxPopComponent
  ],
  entryComponents: [MyMaxPopComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicSelectableModule,
    FormsModule,
    DataTablesModule,
    SharedModule,
    RouterModule,
    SocketIoModule.forRoot(config),
    IonicStorageModule.forRoot({
      name: '_braxtonDB',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    })
  ],
  providers: [
    AuthService,
    KraService,
    AuthGuardService,
    LoaderService,
    StorageService,
    MessengerService,
    PostService,
    ExitInterviewService,
    EsurveyService,
    ExpertiseReviewService,
    ThreeSixtyService,
    ResourcesService,
    SurveyAssessmentService,
    ConversationService,
    PrintToolService,
    StatusBar,
    SplashScreen,
    EmployeeDirectoryService,
    JobTitleRoleProfileService,
    OrganogramService,
    SupportService,
    MyMax7Service,
    ContributionScorecardService,
    KraReviewService,
    SWOTAnalysisService,
    KraPdpService,
    RecruitmentService,
    ChooseQuestionnaireService,
    TrainingService,
    PersonalPortfolioService,
    ChatBotService,
    NotificationService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MsalService,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
