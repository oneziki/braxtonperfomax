import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VacancyQuestionnairePage } from './vacancy-questionnaire.page';

describe('VacancyQuestionnairePage', () => {
  let component: VacancyQuestionnairePage;
  let fixture: ComponentFixture<VacancyQuestionnairePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VacancyQuestionnairePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyQuestionnairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
