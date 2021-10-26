import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SwotAnalysisPage } from './swot-analysis.page';

describe('SwotAnalysisPage', () => {
  let component: SwotAnalysisPage;
  let fixture: ComponentFixture<SwotAnalysisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwotAnalysisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SwotAnalysisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
