import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraphHolderPage } from './graphHolder.page';

describe('GraphHolderPage', () => {
  let component: GraphHolderPage;
  let fixture: ComponentFixture<GraphHolderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GraphHolderPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphHolderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
