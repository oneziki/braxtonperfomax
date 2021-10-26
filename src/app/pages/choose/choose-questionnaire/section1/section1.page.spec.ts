import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Section1Page } from './section1.page';

describe('Section1Page', () => {
  let component: Section1Page;
  let fixture: ComponentFixture<Section1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Section1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
