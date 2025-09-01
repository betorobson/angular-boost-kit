import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialSelectVirtualScroll } from './material-select-virtual-scroll';

describe('MaterialSelectVirtualScroll', () => {
  let component: MaterialSelectVirtualScroll;
  let fixture: ComponentFixture<MaterialSelectVirtualScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialSelectVirtualScroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialSelectVirtualScroll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
