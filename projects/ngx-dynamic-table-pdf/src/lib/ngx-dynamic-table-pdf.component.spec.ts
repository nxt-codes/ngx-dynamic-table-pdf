import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDynamicTablePdfComponent } from './ngx-dynamic-table-pdf.component';

describe('NgxDynamicTablePdfComponent', () => {
  let component: NgxDynamicTablePdfComponent;
  let fixture: ComponentFixture<NgxDynamicTablePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxDynamicTablePdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxDynamicTablePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
