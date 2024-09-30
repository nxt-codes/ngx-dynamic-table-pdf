import { Directive, HostListener } from '@angular/core'

@Directive({
  selector: '[clickStopPropagation]',
  standalone: true
})
export class ClickStopPropagationDirective {

  @HostListener("click", ["$event"]) onClick(event: any): void {
    event.stopPropagation()
  }

}
