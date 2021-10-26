import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VacancyAssesseePage } from './vacancy-assessee.page';

describe('VacancyAssesseePage', () => {
  let component: VacancyAssesseePage;
  let fixture: ComponentFixture<VacancyAssesseePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VacancyAssesseePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyAssesseePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
