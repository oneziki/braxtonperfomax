import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobTitleRoleProfile, KraCompanySettings } from 'src/app/_models';
import { JobTitleRoleProfileService, KraService, LoaderService } from 'src/app/_services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-role-profiles-view',
  templateUrl: './role-profiles-view.page.html',
  styleUrls: ['./role-profiles-view.page.scss'],
})
export class RoleProfilesViewPage implements OnInit {
  private readonly onDestroy = new Subject<void>();

  _kraCompanySettings: KraCompanySettings;
  _jobTitleRole: JobTitleRoleProfile;
  _essentialQualifications = [];
  _optionalQualifications = [];

  constructor(
    private _router: Router,
    private _kraService: KraService,
    private _jobTitleRoleProfileService: JobTitleRoleProfileService,
    private _loaderService: LoaderService
  ) { }

  ngOnInit() {
    this._loaderService.initLoader(true);
    this._kraCompanySettings = this._kraService._kraCompanySettings;

    this.jobTitleRoleProfileUpdate();

  }

  jobTitleRoleProfileUpdate() {
    if (this._jobTitleRoleProfileService._roleProfile.length > 0) {
      let bShowOutcomeHeading = false;
      this._jobTitleRoleProfileService._roleProfile.forEach(role => {
        if (role['JobTitleUUID'] === this._jobTitleRoleProfileService._selectedJobTitle) {
          this._jobTitleRole = role;
          // qualifications
          this._essentialQualifications = this._jobTitleRole['qualifications'].filter(item => Boolean(item.bEssential) === true);
          this._optionalQualifications = this._jobTitleRole['qualifications'].filter(item => Boolean(item.bEssential) === false);

          this._jobTitleRole['competencyProfile'].forEach(compType => {
            bShowOutcomeHeading = false;
            compType['competencies'].forEach(dimensions => {
              dimensions['outcomes'].forEach(outcome => {
                if (!outcome['bHideOutcome']) {
                  bShowOutcomeHeading = true;
                }
              });
              compType['showOutcomeHeading'] = bShowOutcomeHeading;

            });
          });

        }

      });
    }
    this._loaderService.exitLoader();
  }

  printPDFReport() {
    this._loaderService.initLoader(true);
    this._jobTitleRoleProfileService.printRoleProfileReport(this._jobTitleRole['JobTitleUUID'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(v => {
        this._loaderService.exitLoader();
      });
  }

  goBack() {
    this._router.navigate(['profile-library'], { replaceUrl: true });
  }
}
