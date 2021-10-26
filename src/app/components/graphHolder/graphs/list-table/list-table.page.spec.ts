import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListTablePage } from './list-table.page';

describe('MorrisGraphPage', () => {
  let component: ListTablePage;
  let fixture: ComponentFixture<ListTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListTablePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
