import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVirtualScroll } from './select-virtual-scroll';

describe('SelectVirtualScroll', () => {
  let component: SelectVirtualScroll;
  let fixture: ComponentFixture<SelectVirtualScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectVirtualScroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectVirtualScroll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
