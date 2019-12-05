import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionlistComponent } from './optionlist.component';

describe('OptionlistComponent', () => {
  let component: OptionlistComponent;
  let fixture: ComponentFixture<OptionlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
