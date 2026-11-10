import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { MaterialSelectVirtualScroll } from './material-select-virtual-scroll';

describe('MaterialSelectVirtualScroll', () => {
  let component: MaterialSelectVirtualScroll;
  let fixture: ComponentFixture<MaterialSelectVirtualScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialSelectVirtualScroll],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialSelectVirtualScroll);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('config', {
      compositeId: ['id'],
      populateBasedOnFormControls: true,
      formControl: new FormControl(null),
      // demais campos obrigatórios do MaterialSelectVirtualScrollConfig
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
