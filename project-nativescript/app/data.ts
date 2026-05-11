import { ObservableArray } from '@nativescript/core';

export interface Mascota {
    id: number;
    nombre: string;
    raza: string;
    tipo: 'Perro' | 'Gato' | 'Otro';
    imagen?: string;
    fechaNacimiento?: Date;
    activo?: boolean;
}

export const items = new ObservableArray<Mascota>([
    { id: 1, nombre: 'Max', raza: 'Labrador', tipo: 'Perro', imagen: 'res://ic1', fechaNacimiento: new Date('2021-03-15'), activo: true },
    { id: 2, nombre: 'Luna', raza: 'Siames', tipo: 'Gato', imagen: 'res://ic2', fechaNacimiento: new Date('2022-07-10'), activo: true },
    { id: 3, nombre: 'Rocky', raza: 'Pastor Alemán', tipo: 'Perro', imagen: 'res://ic3', fechaNacimiento: new Date('2020-11-05'), activo: true }
]);


