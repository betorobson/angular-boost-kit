import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularBoostKit } from './angular-boost-kit';

describe('AngularBoostKit', () => {
  let component: AngularBoostKit;
  let fixture: ComponentFixture<AngularBoostKit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularBoostKit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularBoostKit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
