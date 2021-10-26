import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssesseePage } from './assessee.page';

describe('AssesseePage', () => {
  let component: AssesseePage;
  let fixture: ComponentFixture<AssesseePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssesseePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssesseePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
