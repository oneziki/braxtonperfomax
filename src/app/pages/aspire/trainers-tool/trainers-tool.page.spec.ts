import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainersToolPage } from './trainers-tool.page';

describe('TrainersToolPage', () => {
  let component: TrainersToolPage;
  let fixture: ComponentFixture<TrainersToolPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainersToolPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainersToolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
