import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExpertiseReviewPage } from './expertise-review.page';

describe('ExpertiseReviewPage', () => {
  let component: ExpertiseReviewPage;
  let fixture: ComponentFixture<ExpertiseReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertiseReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertiseReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
