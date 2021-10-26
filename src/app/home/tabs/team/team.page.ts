import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService, MyMax7Service, LoaderService } from '../../../_services/index';
import { SessionUser } from '../../../_models';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit, OnDestroy {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  chartOptionsRadial = {
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
          image: undefined
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: false
          }
        }
      }
    },
    dataLabels: {
      enabled: true
    },
    fill: {
      opacity: 1
    },
    legend: {
      show: true,
      floating: true,
      fontSize: "10px",
      position: "left",
      offsetX: 0,
      offsetY: 0,
      labels: {
        useSeriesColors: true
      },
      markers: {
        width: 8,
        height: 8,
      },
      formatter: function (seriesName, opts) {
        return (
          seriesName.substring(0, 10) +
          ":  " +
          opts.w.globals.series[opts.seriesIndex]
        );
      },
      itemMargin: {
        vertical: -1
      }
    }
  }

  _sessionUser: SessionUser;
  _companyTemplate: {};
  _myMaxData = {};
  _chartsLoaded = false;

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  private Subscription: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor (private router: Router,
    public _authService: AuthService,
    private _myMaxService: MyMax7Service,
    private activatedRoute: ActivatedRoute,
    public _loaderService: LoaderService) { }

  ngOnInit() {
    this._chartsLoaded = false;
    this._loaderService.initLoader(true);
    this._authService.hideAppPanel(false);
    this._sessionUser = this._authService._sessionUser;
    this._companyTemplate = this._sessionUser['companytemplate'];

    this._myMaxService.getTabData(this._sessionUser.P6_userUID, 'team')
      .pipe(takeUntil(this.onDestroy))
      .subscribe(myMaxData => {
        this._myMaxData = myMaxData;
        this._chartsLoaded = true;
        this._loaderService.exitLoader();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.onDestroy.next();
  }

  navTo(tab) {
    this._authService.toggleAppMenu(tab);
  }

}
