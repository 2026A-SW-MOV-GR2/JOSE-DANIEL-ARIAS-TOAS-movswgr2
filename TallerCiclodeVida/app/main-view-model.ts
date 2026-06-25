import { Observable } from '@nativescript/core';

export class HelloWorldModel extends Observable {
    private _count: number = 0;

    constructor() {
        super();
        this.set('count', this._count);
    }

    onIncrement() {
        this._count++;
        this.set('count', this._count);
    }
    
    setCount(value: number) {
        this._count = value;
        this.set('count', this._count);
    }
    
    getCount(): number {
        return this._count;
    }
}

// AÑADE ESTA LÍNEA AL FINAL: Exportamos una instancia única (Singleton)
export const sharedViewModel = new HelloWorldModel();