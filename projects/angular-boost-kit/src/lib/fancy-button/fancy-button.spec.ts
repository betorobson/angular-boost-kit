import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyButton } from './fancy-button';

describe('FancyButton', () => {
  let component: FancyButton;
  let fixture: ComponentFixture<FancyButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FancyButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FancyButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
