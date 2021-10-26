import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyMaxPopComponent } from './mymax-pop.component';

describe('MyMaxPopComponent', () => {
  let component: MyMaxPopComponent;
  let fixture: ComponentFixture<MyMaxPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMaxPopComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyMaxPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
