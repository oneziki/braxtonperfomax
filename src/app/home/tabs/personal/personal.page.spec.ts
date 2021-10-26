import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PersonalPage } from './personal.page';

describe('FolderPage', () => {
  let component: PersonalPage;
  let fixture: ComponentFixture<PersonalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
