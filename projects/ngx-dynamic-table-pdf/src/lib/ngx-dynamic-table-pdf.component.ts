import { Component } from '@angular/core';
import { TableIconsComponent } from './components/icons/table-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive';

@Component({
  selector: 'ngx-dynamic-table-pdf',
  standalone: true,
  imports: [
    ClickStopPropagationDirective,
    CommonModule,
    MatMenuModule,
    TableIconsComponent
  ],
  templateUrl: './ngx-dynamic-table-pdf.component.html',
  styleUrls: ['./ngx-dynamic-table-pdf.component.sass']
})
export class NgxDynamicTablePdfComponent {
  items: any = ['id', 'name', 'date', 'ort', 'checked', 'description']

  show() {
    console.log('show')
  }
}