import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SelectVirtualScroll } from './select-virtual-scroll';

describe('SelectVirtualScroll', () => {
  let component: SelectVirtualScroll;
  let fixture: ComponentFixture<SelectVirtualScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectVirtualScroll],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectVirtualScroll);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
