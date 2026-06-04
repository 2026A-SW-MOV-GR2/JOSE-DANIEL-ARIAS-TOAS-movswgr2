import { EventData, Page, Observable, Frame } from '@nativescript/core';
import { Mascota } from './data';
import { StorageMode, STORAGE_COLORS, STORAGE_LABELS } from './models/storage-mode.model';
import { saveItem, updateItem, loadItems } from './services/storage.service';
 
let vm:          Observable;
let mode:        string;        // 'create' | 'edit'
let editItemId:  number | null = null;
let storageMode: StorageMode   = 'SQL';
 
export async function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  const ctx  = page.navigationContext || {};
 
  mode        = ctx.mode        || 'create';
  storageMode = ctx.storageMode || 'SQL';
  vm          = new Observable();
 
  // Color de la ActionBar según el motor activo
  vm.set('storageMode',  storageMode);
  vm.set('storageColor', STORAGE_COLORS[storageMode]);
  vm.set('storageLabel', STORAGE_LABELS[storageMode]);
  vm.set('actionTitle',  mode === 'edit' ? 'Editar Mascota' : 'Nueva Mascota');
 
  if (mode === 'edit' && typeof ctx.itemId === 'number') {
    editItemId = ctx.itemId;
 
    // Cargar el item desde el motor activo
    try {
      const items = await loadItems(storageMode);
      const item  = items.find(i => i.id === editItemId);
      if (item) {
        vm.set('nombre',          item.nombre);
        vm.set('raza',            item.raza);
        vm.set('tipo',            item.tipo);
        vm.set('fechaNacimiento', item.fechaNacimiento || new Date());
        vm.set('activo',          item.activo ?? true);
      }
    } catch (err) {
      console.error('[ERROR] form-page loadItems:', err);
      setDefaults();
    }
  } else {
    setDefaults();
  }
 
  page.bindingContext = vm;
}
 
function setDefaults() {
  vm.set('nombre',          '');
  vm.set('raza',            '');
  vm.set('tipo',            'Perro');
  vm.set('fechaNacimiento', new Date());
  vm.set('activo',          true);
}
 
export async function onSaveTap() {
  const nombre          = vm.get('nombre') || '';
  const raza            = vm.get('raza')   || '';
  const tipo            = vm.get('tipo')   || 'Otro';
  const fechaNacimiento = vm.get('fechaNacimiento');
  const activo          = vm.get('activo');
 
  if (!nombre.trim()) {
    console.warn('[WARN] form-page: nombre vacío, no se guarda');
    return;
  }
 
  try {
    if (mode === 'edit' && editItemId !== null) {
      const item: Mascota = {
        id: editItemId,
        nombre,
        raza,
        tipo: tipo as Mascota['tipo'],
        fechaNacimiento,
        activo,
        imagen: 'res://ic_placeholder',
      };
      await updateItem(item, storageMode);
      console.log(`[INFO] form-page: update en ${storageMode} → id=${editItemId}`);
    } else {
      const item: Mascota = {
        id: Date.now(),      // ID único basado en timestamp
        nombre,
        raza,
        tipo: tipo as Mascota['tipo'],
        fechaNacimiento,
        activo,
        imagen: 'res://ic_placeholder',
      };
      await saveItem(item, storageMode);
      console.log(`[INFO] form-page: insert en ${storageMode} → id=${item.id}`);
    }
 
    Frame.topmost().goBack();
  } catch (err) {
    console.error(`[ERROR] form-page.onSaveTap (${storageMode}):`, err);
  }
}