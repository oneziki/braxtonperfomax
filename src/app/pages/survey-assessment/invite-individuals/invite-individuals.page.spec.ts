import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InviteIndividualsPage } from './invite-individuals.page';

describe('InviteIndividualsPage', () => {
  let component: InviteIndividualsPage;
  let fixture: ComponentFixture<InviteIndividualsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteIndividualsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteIndividualsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
