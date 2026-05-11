import { EventData, Page, Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { items, Mascota } from './data';

let vm: Observable;
let mode: string;
let editItemId: number | null = null;

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  const ctx = page.navigationContext || {};
  mode = ctx.mode || 'create';
  vm = new Observable();

  if (mode === 'edit' && typeof ctx.itemId === 'number') {
    editItemId = ctx.itemId;
    const item = items.find(i => i.id === editItemId);
    if (item) {
      vm.set('nombre', item.nombre);
      vm.set('raza', item.raza);
      vm.set('tipo', item.tipo);
      vm.set('fechaNacimiento', item.fechaNacimiento || new Date());
      vm.set('activo', item.activo || false);
    }
  } else {
    vm.set('nombre', '');
    vm.set('raza', '');
    vm.set('tipo', 'Perro');
    vm.set('fechaNacimiento', new Date());
    vm.set('activo', true);
  }

  page.bindingContext = vm;
}

export function onSaveTap() {
  const nombre = vm.get('nombre');
  const raza = vm.get('raza');
  const tipo = vm.get('tipo');
  const fechaNacimiento = vm.get('fechaNacimiento');
  const activo = vm.get('activo');

  if (mode === 'edit' && editItemId !== null) {
    const item = items.find(i => i.id === editItemId);
    if (item) {
      item.nombre = nombre;
      item.raza = raza;
      item.tipo = tipo;
      item.fechaNacimiento = fechaNacimiento;
      item.activo = activo;
      // ObservableArray items will not auto-notify on object field change; replace item to trigger UI update
      const idx = items.findIndex(i => i.id === editItemId);
      if (idx !== -1) {
        items.setItem(idx, item);
      }
    }
  } else {
    const newItem: Mascota = {
      id: Date.now(),
      nombre,
      raza,
      tipo: tipo || 'Otro',
      fechaNacimiento,
      activo,
      imagen: 'res://ic_placeholder'
    };
    items.unshift(newItem);
  }

  Frame.topmost().goBack();
}


