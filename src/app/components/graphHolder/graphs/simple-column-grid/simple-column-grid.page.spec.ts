import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimpleColumnGridPage } from './simple-column-grid.page';

describe('MorrisGraphPage', () => {
  let component: SimpleColumnGridPage;
  let fixture: ComponentFixture<SimpleColumnGridPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleColumnGridPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleColumnGridPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
