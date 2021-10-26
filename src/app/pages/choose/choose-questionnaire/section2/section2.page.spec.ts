import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Section2Page } from './section2.page';

describe('Section2Page', () => {
  let component: Section2Page;
  let fixture: ComponentFixture<Section2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Section2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
