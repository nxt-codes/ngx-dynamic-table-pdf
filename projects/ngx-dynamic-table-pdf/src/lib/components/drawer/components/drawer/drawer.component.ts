import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core'
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations'
import { DrawerService } from '../../services/drawer.service'

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { DrawerMode, DrawerPosition } from '../../models/drawer.types'
import { UtilsService } from '../../utils/utils.service'

@Component({
    selector     : 'drawer',
    standalone   : true,
    templateUrl  : './drawer.component.html',
    styleUrls    : ['./drawer.component.sass'],
    encapsulation: ViewEncapsulation.None
})
export class DrawerComponent implements OnChanges, OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_fixed: BooleanInput
    static ngAcceptInputType_opened: BooleanInput
    static ngAcceptInputType_transparentOverlay: BooleanInput
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() fixed: boolean = false
    @Input() mode: DrawerMode = 'side'
    @Input() name: string = this._UtilsService.randomId()
    @Input() opened: boolean = false
    @Input() position: DrawerPosition = 'left'
    @Input() transparentOverlay: boolean = false
    @Output() readonly fixedChanged: EventEmitter<boolean> = new EventEmitter<boolean>()
    @Output() readonly modeChanged: EventEmitter<DrawerMode> = new EventEmitter<DrawerMode>()
    @Output() readonly openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>()
    @Output() readonly positionChanged: EventEmitter<DrawerPosition> = new EventEmitter<DrawerPosition>()

    private _animationsEnabled: boolean = false
    private _hovered: boolean = false
    private _overlay!: HTMLElement | null
    private _player!: AnimationPlayer | null

    constructor(
        private _animationBuilder: AnimationBuilder,
        private _elementRef: ElementRef,
        private _renderer2: Renderer2,
        private _DrawerService: DrawerService,
        private _UtilsService: UtilsService
    ) {}


    @HostBinding('class') get classList(): any {
        return {
            'drawer-animations-enabled'         : this._animationsEnabled,
            'drawer-fixed'                      : this.fixed,
            'drawer-hover'                      : this._hovered,
            [`drawer-mode-${this.mode}`]        : true,
            'drawer-opened'                     : this.opened,
            [`drawer-position-${this.position}`]: true
        }
    }

    @HostBinding('style') get styleList(): any {
        return {
            'visibility': this.opened ? 'visible' : 'hidden'
        }
    }

    @HostListener('mouseenter') private _onMouseenter(): void {
        this._enableAnimations()
        this._hovered = true
    }

    @HostListener('mouseleave') private _onMouseleave(): void {
        this._enableAnimations()
        this._hovered = false
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ( 'fixed' in changes ) {
            this.fixed = coerceBooleanProperty(changes['fixed'].currentValue)
            this.fixedChanged.next(this.fixed)
        }

        if ( 'mode' in changes ) {
            const previousMode = changes['mode'].previousValue
            const currentMode = changes['mode'].currentValue

            // Disable the animations
            this._disableAnimations()

            // If the mode changes: 'over -> side'
            if ( previousMode === 'over' && currentMode === 'side' ) this._hideOverlay()

            // If the mode changes: 'side -> over'
            if ( previousMode === 'side' && currentMode === 'over' ) {
                if ( this.opened ) this._showOverlay()
            }

            // Execute the observable
            this.modeChanged.next(currentMode)

            // Enable the animations after a delay
            setTimeout(() => {
                this._enableAnimations()
            }, 500)
        }

        // Opened
        if ( 'opened' in changes ) {
            const open = coerceBooleanProperty(changes['opened'].currentValue)
            this._toggleOpened(open)
        }

        // Position
        if ( 'position' in changes ) this.positionChanged.next(this.position)

        // Transparent overlay
        if ( 'transparentOverlay' in changes ) this.transparentOverlay = coerceBooleanProperty(changes['transparentOverlay'].currentValue)
    }

    ngOnInit(): void {
        this._DrawerService.registerComponent(this.name, this)
    }

    ngOnDestroy(): void {
        if ( this._player ) this._player.finish()
        this._DrawerService.deregisterComponent(this.name)
    }

    open(): void {
        if ( this.opened ) return
        this._toggleOpened(true)
    }

    close(): void {
        if ( !this.opened ) return
        this._toggleOpened(false)
    }

    toggle(): void {
        if ( this.opened ) {
            this.close()
        } else {
            this.open()
        }
    }

    private _enableAnimations(): void {
        if ( this._animationsEnabled ) return
        this._animationsEnabled = true
    }

    private _disableAnimations(): void {
        if ( !this._animationsEnabled ) return
        this._animationsEnabled = false
    }

    private _showOverlay(): void {
        this._overlay = this._renderer2.createElement('div')
        if ( !this._overlay ) return
        this._overlay.classList.add('drawer-overlay')

        if ( this.fixed ) this._overlay.classList.add('drawer-overlay-fixed')
        if ( this.transparentOverlay ) this._overlay.classList.add('drawer-overlay-transparent')

        this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay)

        this._player = this._animationBuilder.build([
            style({opacity: 0}),
            animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({opacity: 1}))
        ]).create(this._overlay);

        this._player.onDone(() => {
            this._player?.destroy()
            this._player = null
        });

        this._player.play()
        this._overlay.addEventListener('click', () => {
            this.close()
        })
    }

    private _hideOverlay(): void {
        if ( !this._overlay ) return

        this._player = this._animationBuilder.build([
            animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({opacity: 0}))
        ]).create(this._overlay)

        this._player.play()

        this._player.onDone(() => {
            this._player?.destroy()
            this._player = null

            if (this._overlay) {
                this._overlay.parentNode?.removeChild(this._overlay)
                this._overlay = null
            }
        })
    }

    private _toggleOpened(open: boolean): void {
        this.opened = open
        this._enableAnimations()

        if ( this.mode === 'over' ) {
            if ( open ) {
                this._showOverlay()
            } else {
                this._hideOverlay()
            }
        }
        this.openedChanged.next(open)
    }
}