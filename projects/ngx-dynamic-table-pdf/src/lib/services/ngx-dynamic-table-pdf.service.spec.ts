import { TestBed } from '@angular/core/testing';

import { NgxDynamicTablePdfService } from './ngx-dynamic-table-pdf.service';

describe('NgxDynamicTablePdfService', () => {
  let service: NgxDynamicTablePdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDynamicTablePdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
