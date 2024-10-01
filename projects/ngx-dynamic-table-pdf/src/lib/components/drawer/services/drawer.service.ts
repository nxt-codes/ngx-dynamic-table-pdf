import { Injectable } from '@angular/core'
import { DrawerComponent } from '../components/drawer/drawer.component'

@Injectable({
    providedIn: 'root'
})
export class DrawerService
{
    private _componentRegistry: Map<string, DrawerComponent> = new Map<string, DrawerComponent>()

    constructor() { }

    registerComponent(name: string, component: DrawerComponent): void {
        this._componentRegistry.set(name, component)
    }

    deregisterComponent(name: string): void {
        this._componentRegistry.delete(name)
    }

    getComponent(name: string): DrawerComponent | undefined {
        return this._componentRegistry.get(name)
    }
}
