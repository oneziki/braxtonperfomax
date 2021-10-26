import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TeamPage } from './team.page';

describe('FolderPage', () => {
  let component: TeamPage;
  let fixture: ComponentFixture<TeamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
