import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NEVER } from 'rxjs';

import { MaterialSelectVirtualScroll } from './material-select-virtual-scroll';

describe('MaterialSelectVirtualScroll', () => {
  let component: MaterialSelectVirtualScroll;
  let fixture: ComponentFixture<MaterialSelectVirtualScroll>;
  const config = {
    formControl: new FormControl({ key1: 1, key2: 10 }),
    compositeId: ['key1', 'key2'],
    optionItemDescription: 'description',
    load: () => NEVER,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialSelectVirtualScroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialSelectVirtualScroll);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('matches an initial composite ID by its key values', () => {
    const option = {
      selected: false,
      id: { key1: 1, key2: 10 },
      data: { key1: 1, key2: 10, description: 'Selected region' },
    };
    component['rawOptions'].push(option);
    component.itemSelectBasedOnFormControlvalue();

    expect(component['itemSelected']).toEqual([option]);
  });
});
