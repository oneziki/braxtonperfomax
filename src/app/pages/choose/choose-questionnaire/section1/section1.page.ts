import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Experience, LanguagePreference, SessionUser } from '../../../../_models/index';
import { AuthService, LoaderService, ChooseQuestionnaireService } from '../../../../_services/index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-section1',
  templateUrl: './section1.page.html',
  styleUrls: ['./section1.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Section1Page implements OnInit, OnDestroy {

  _sessionUser: SessionUser;
  _userQuestionnaire = {};
  _languageObj = [];
  _experienceObj = [];
  _lengthOfService = ['Less Than 6 Months', '6 - 12 Months', '1 - 3 Years', '3 - 5 Years', 'More Than 5 Years'];
  _sLanguageOptions = ['Not Applicable', 'Basic', 'Intermediate', 'Fluent'];
  _questionnaireData = {};
  _questionnaireSettings = {};
  _iNumberOfLanguages = 0;
  _languages = [];
  _bDisplayMessage = false;
  isLoading = true;

  private readonly onDestroy = new Subject<void>();

  constructor (
    private _chooseQuestionnaireService: ChooseQuestionnaireService,
    private _loaderService: LoaderService,
    public _authService: AuthService,
    private _router: Router) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(true);
    this._sessionUser = this._authService._sessionUser;
    this._questionnaireSettings = this._chooseQuestionnaireService._questionnaireSettings;
    this._userQuestionnaire = this._chooseQuestionnaireService._userQuestionnaire;

    if (this.isEmpty(this._questionnaireSettings)) {

      this._chooseQuestionnaireService.getQuestionnaireSettings()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.emitQuestionnaireData();
        });
    } else {
      this.emitQuestionnaireData();
    }
    this._loaderService.exitLoader();
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  emitQuestionnaireData() {
    this._questionnaireSettings = this._chooseQuestionnaireService._questionnaireSettings;
    this._iNumberOfLanguages = this._questionnaireSettings['iNumberOfLanguages'];
    this._languages = this._questionnaireSettings['languages'];

    if (this.isEmpty(this._userQuestionnaire)) {

      this._chooseQuestionnaireService.getQuestionnaireForUser()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(v => {
          this.emitQuestionnaireUserData();
        });
    } else {
      this.emitQuestionnaireUserData();
    }
  }

  emitQuestionnaireUserData() {
    this._userQuestionnaire = this._chooseQuestionnaireService._userQuestionnaire;

    if (this.isEmpty(this._userQuestionnaire)) {
      this._bDisplayMessage = true;
    } else {
      if (this._userQuestionnaire['experience'].length !== 0) {
        this._experienceObj = this._userQuestionnaire['experience'];
      } else {
        for (let x = 0; x < 1; x++) {
          if (this._experienceObj.length < 1) {
            this.addExperienceRow();
          }
        }
      }

      if (this._userQuestionnaire['languages'].length !== 0) {
        this._languageObj = this._userQuestionnaire['languages'];
      } else {
        for (let x = 0; x < this._questionnaireSettings['languages'].length; x++) {
          this._languageObj.push({ 'sLanguageName': this._questionnaireSettings['languages'][x]['sLanguageName'], 'sConversing': '', 'sReading': '', 'sWriting': '' });
        }
      }
      this._bDisplayMessage = false;
    }
    this.isLoading = false;
    this._loaderService.exitLoader();
  }

  addExperienceRow() {
    const newExperience = new Experience();
    this._experienceObj.push(newExperience);
  }

  addLanguageRow() {
    const newlanguage = new LanguagePreference();
    this._languageObj.push(newlanguage);
  }

  deleteExperienceRow(index) {
    this._experienceObj.splice(index, 1);
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  validate() {
    let sMessage = '';
    this._userQuestionnaire['languages'] = [];
    this._userQuestionnaire['experience'] = [];

    this._languageObj.forEach(language => {
      this._userQuestionnaire['languages'].push(language);
    });
    this._experienceObj.forEach(experience => {
      this._userQuestionnaire['experience'].push(experience);
    });

    this._userQuestionnaire['languages'].forEach(language => {
      if (language['sLanguage'] === '') {
        sMessage = sMessage + 'Please insert a language<br>';
      } else if (language['sConversing'] === '') {
        sMessage = sMessage + 'Please select your Conversing type for ' + language['sLanguageName'] + '<br>';
      } else if (language['sReading'] === '') {
        sMessage = sMessage + 'Please select your Reading type for ' + language['sLanguageName'] + '<br>';
      } else if (language['sWriting'] === '') {
        sMessage = sMessage + 'Please select your Writing type for ' + language['sLanguageName'] + '<br>';
      }
    });

    if (this._userQuestionnaire['sLengthOfService'] === '') {
      sMessage = sMessage + 'Please select a Length of Service<br>';
    }
    if (this._userQuestionnaire['sInterests'] === '') {
      sMessage = sMessage + 'Please insert your interests outside of the business<br>';
    }

    this._userQuestionnaire['experience'].forEach(experience => {
      if (experience['sDepartmentName'] === '') {
        sMessage = sMessage + 'Please insert your department<br>';
      }
      if (experience['sMonths'] === '') {
        sMessage = sMessage + 'Please insert the amount of months';
      }
    });

    if (sMessage !== '') {
      Swal.fire({
        title: '',
        html: sMessage,
        icon: 'warning',
        confirmButtonColor: 'var(--primary)',
        heightAuto: false
      });
    } else {
      this._chooseQuestionnaireService._questionnaireSettings = this._questionnaireSettings;
      this._chooseQuestionnaireService._userQuestionnaire = this._userQuestionnaire;
      this.goNext();
    }
  }

  goNext() {
    this._router.navigate(['choose/choose-questionnaire/section2'], { replaceUrl: true });
  }

  goChoosePage() {
    this._router.navigate(['choose'], { replaceUrl: true });
  }

}
