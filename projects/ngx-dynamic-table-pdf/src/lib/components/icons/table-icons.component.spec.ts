import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableIconsComponent } from './table-icons.component';

describe('IconsComponent', () => {
  let component: TableIconsComponent;
  let fixture: ComponentFixture<TableIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableIconsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
