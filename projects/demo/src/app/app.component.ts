import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  data: any = [
    { id: '1', name: 'Tim', date: '01.01.2024 00:00:59', ort: 'Berlin', checked: false, description: 'Test1' },
    { id: '2', name: 'Tom', date: '01.01.2023 00:00:59', ort: 'Hamburg', checked: false, description: 'Test2' },
    { id: '3', name: 'Thomas', date: '01.02.2023 00:00:59', ort: 'Dresden', checked: false, description: 'Test3' },
    { id: '4', name: 'Martin', date: '03.02.2023 00:00:59', ort: 'München', checked: false, description: 'Halllo1' },
    { id: '5', name: 'Markus', date: '04.02.2023 00:00:59', ort: 'Köln', checked: false, description: 'Hallo2' },
    { id: '6', name: 'Rene', date: '04.02.2023 00:01:59', ort: 'Köln', checked: false, description: 'Hallo2' }
  ]
}
