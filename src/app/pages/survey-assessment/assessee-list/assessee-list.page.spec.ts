import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssesseeListPage } from './assessee-list.page';

describe('AssesseeListPage', () => {
  let component: AssesseeListPage;
  let fixture: ComponentFixture<AssesseeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssesseeListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssesseeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
